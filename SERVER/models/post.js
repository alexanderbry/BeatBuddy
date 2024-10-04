"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.Profile)
    }
  }
  Post.init(
    {
      caption: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Caption is required",
          },
          notEmpty: {
            msg: "Caption is required",
          },
        },
      },
      imageUrl: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        defaultValue:
          "https://www.shutterstock.com/image-vector/bb-logo-design-template-modern-600nw-2027698046.jpg",
      },
      TrackId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Track is required",
          },
          notEmpty: {
            msg: "Track is required",
          },
        },
      },
      ProfileId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Post",
    }
  );
  return Post;
};
