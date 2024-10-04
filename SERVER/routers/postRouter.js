const express = require("express");
const authenticate = require("../middlewares/authentication");
const postAuthor = require("../middlewares/postAuthor")
const ControllerPost = require("../controllers/controllerPost");
const postRouter = express.Router()

postRouter.get("/", ControllerPost.getAllPosts)
postRouter.get("/gemini", ControllerPost.gemini)

postRouter.post("/posts/create", authenticate, ControllerPost.createPost)
postRouter.patch("/posts/:PostId", authenticate, postAuthor, ControllerPost.updatePost)
postRouter.delete("/posts/:PostId", authenticate, postAuthor, ControllerPost.deletePost)

module.exports = postRouter 