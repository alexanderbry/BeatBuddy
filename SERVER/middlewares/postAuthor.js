const { Post } = require("../models");

const postAuthor = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { PostId } = req.params;

    let validateId = await Post.findByPk(PostId);
    if (!validateId) throw { name: "NotFound" };
    
    if (id !== validateId.ProfileId) throw { name: "Forbidden" };

    next();
  } catch (error) {
    next(error);
  }
};
module.exports = postAuthor;
