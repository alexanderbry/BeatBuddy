const jwt = require('jsonwebtoken');
const secret_key = process.env.SECRET_KEY;

let createToken = (payload) => jwt.sign(payload, secret_key);
let verifyToken = (token) => jwt.verify(token, secret_key);

module.exports = { createToken, verifyToken };