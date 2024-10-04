const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

const authentication = async (req, res, next) => {
  try {
    if (!req.headers.authorization) throw { name: "Unauthorized" };
    let [bearer, token] = req.headers.authorization?.split(" ");
    
    if (!token) throw { name: "Unauthorized" };
    
    const data = verifyToken(token);

    const user = await User.findByPk(data.id);
    if (!user) throw { name: "Unauthorized" };

    req.user = {
      id: user.id,
    };

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = authentication;
