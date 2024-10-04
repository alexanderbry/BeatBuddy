'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    static associate(models) {
      Profile.belongsTo(models.User)
      Profile.hasMany(models.Post)
    }
  }
  Profile.init({
    fullName: {
      type : DataTypes.STRING,
      unique : true,
      allowNull : false,
      validate : {
        notNull : {
          msg : "Full Name is required"
        },
        notEmpty : {
          msg : "Full Name is required"
        }
      }
    },
    spotifyId: {
      type : DataTypes.STRING,
      unique : true,
      allowNull : false,
      validate : {
        notNull : {
          msg : "Spotify ID is required"
        },
        notEmpty : {
          msg : "Spotify ID is required"
        }
      }
    },
    gender: {
      type : DataTypes.STRING,
    },
    profilePicture : {
      type : DataTypes.STRING,
      allowNull : false,
      defaultValue : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    },
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};