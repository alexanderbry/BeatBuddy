const express = require("express");
const ControllerProfile = require("../controllers/controllerProfile");
const profileAuthor = require("../middlewares/profileAuthor")
const authenticate = require("../middlewares/authentication");
const profileRouter = express.Router()

profileRouter.get("/", ControllerProfile.getAllProfiles)
profileRouter.post("/create", authenticate, ControllerProfile.createProfile)

profileRouter.get("/profile", ControllerProfile.getProfileById)
profileRouter.put("/:ProfileId", authenticate, profileAuthor, ControllerProfile.updateProfile)

module.exports = profileRouter