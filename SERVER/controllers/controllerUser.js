const { query } = require("express");
const { comparePassword } = require("../helpers/bcrypt");
const { createToken } = require("../helpers/jwt");
const { User, Profile } = require("../models");
const querystring = require("querystring");
const axios = require("axios");
const { OAuth2Client } = require("google-auth-library");
const { error } = require("console");

class ControllerUser {
  static async register(req, res, next) {
    try {
      const { email, username, password } = req.body;
      const newUser = await User.create({
        email,
        username,
        password,
      });

      res.status(201).json({
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email) throw { name: "EmailRequired" };
      if (!password) throw { name: "PasswordRequired" };

      const user = await User.findOne({ where: { email } });
      if (!user) throw { name: "Invalid email/password" };

      const isValidPassword = comparePassword(password, user.password);
      if (!isValidPassword) throw { name: "Invalid email/password" };

      const payload = {
        id: user.id,
      };

      const access_token = createToken(payload);
      res.status(200).json({ access_token });
    } catch (error) {
      next(error);
    }
  }
  static async loginGoogle(req, res, next) {
    try {
      const { email, username, password } = req.body;
      const newUser = await User.create({
        email,
        username,
        password,
      });
      const payload = {
        id: newUser.id,
      };
      const access_token = createToken(payload);
      res.status(200).json({ access_token });
    } catch (error) {
      next(error);
    }
  }

  static async loginSpotify(req, res, next) {
    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
    const SERVER_BASE_URL = process.env.SERVER_BASE_URL;
    const redirect_uri = `${SERVER_BASE_URL}/users/callback`;
    try {
      const scope =
        "user-read-private user-read-email user-read-recently-played user-library-read";
      res.redirect(
        "https://accounts.spotify.com/authorize?" +
          querystring.stringify({
            response_type: "code",
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
          })
      );
    } catch (error) {
      next(error);
    }
  }

  static async callback(req, res, next) {
    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
    const SERVER_BASE_URL = process.env.SERVER_BASE_URL;
    const CLIENT_BASE_URL = process.env.CLIENT_BASE_URL;
    const redirect_uri = `${SERVER_BASE_URL}/users/callback`;
    try {
      const code = req.query.code || null;

      const response = await axios({
        method: "post",

        url: "https://accounts.spotify.com/api/token",
        data: querystring.stringify({
          grant_type: "authorization_code",
          code: code,
          redirect_uri: redirect_uri,
          client_id: client_id,
          client_secret: client_secret,
        }),
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            new Buffer.from(client_id + ":" + client_secret).toString("base64"),
        },
      });
      const { access_token, refresh_token } = response.data;

      const user = await axios.get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      let findUser = await User.findOne({
        where: { email: user.data.email },
      });

      if (!findUser) {
        findUser = await User.create(
          {
            email: user.data.email,
            username: user.data.display_name,
            password: "123456",
          },
          {
            hooks: false,
          }
        );
      }

      let validateId = await Profile.findOne({
        where: { spotifyId: user.data.id },
      });

      if (!validateId) {
        await Profile.create({
          fullName: user.data.display_name,
          spotifyId: user.data.id,
          profilePicture: user.data.images[0].url,
          UserId: findUser.id,
        });
      }
      const payload = {
        id: findUser.id,
      };

      const server_token = createToken(payload);

      res.redirect(
        `${CLIENT_BASE_URL}/?spotify_token=` +
          access_token +
          "&access_token=" +
          server_token
      );
    } catch (error) {
      next(error);
    }
  }

  static async loginGoogle(req, res, next) {
    try {
      const client = new OAuth2Client();
      const { googleToken } = req.body;

      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      
      const payload = ticket.getPayload();
      let email = payload.email;
      const [user, created] = await User.findOrCreate({
        where: { email },
        defaults: {
          username: payload.name,
          email: payload.email,
          password: "google_id",
        },
        hooks: false,
      });
      
      const token = createToken({ id: user.id });
      res.status(created ? 201 : 200).json({ access_token: token });
    } catch (error) {
      console.log(error);
      
      next(error);
    }
  }
}

module.exports = ControllerUser;
