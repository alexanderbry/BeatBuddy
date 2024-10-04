const profileAuthor = (req, res, next) => {
  try {
    const { id } = req.user;
    const { ProfileId } = req.params;
    
    if (id !== +ProfileId) throw { name: "Forbidden" };

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = profileAuthor;