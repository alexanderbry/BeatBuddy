const express = require("express");
const ControllerUser = require("../controllers/controllerUser");
const userRouter = express.Router()

userRouter.post("/register", ControllerUser.register)
userRouter.post("/login", ControllerUser.login)
userRouter.get("/login/spotify", ControllerUser.loginSpotify)
userRouter.post("/login/google", ControllerUser.loginGoogle)
userRouter.get("/callback", ControllerUser.callback)

module.exports = userRouter