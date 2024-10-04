const { Profile } = require("../models");

class ControllerProfile {
  static async getAllProfiles(req, res, next) {
    try {
      let profiles = await Profile.findAll();

      res.json(profiles);
    } catch (error) {
      next(error);
    }
  }

  static async createProfile(req, res, next) {
    try {
      const { id } = req.user;
      const { fullName, dateOfBirth, gender, profilePicture } = req.body;

      await Profile.create({
        fullName,
        dateOfBirth,
        gender,
        profilePicture,
        UserId: id,
      });

      res.status(201).json({
        message: "Profile created successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProfileById(req, res, next) {
    try {
      const { ProfileId } = req.query;

      const profile = await Profile.findOne({
        where: { spotifyId: ProfileId },
      });
      if (!profile) throw { name: "NotFound" };

      res.json(profile);
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const { ProfileId } = req.params;
      const { fullName, dateOfBirth, gender, profilePicture } = req.body;

      const profile = await Profile.findByPk(ProfileId);
      if (!profile) throw { name: "NotFound" };

      await Profile.update(
        {
          fullName,
          dateOfBirth,
          gender,
          profilePicture,
        },
        {
          where: { id: ProfileId },
        }
      );
      res.json({
        message: "Profile updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ControllerProfile;
