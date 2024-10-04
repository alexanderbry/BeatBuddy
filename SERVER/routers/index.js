const express = require("express");
const userRouter = require("./userRouter");
const profileRouter = require("./profileRouter");
const postRouter = require("./postRouter");
const errorHandler = require("../middlewares/errorHandler");
const router = express.Router();

router.use("/", postRouter);
router.use("/users", userRouter);
router.use("/profiles", profileRouter);

router.use(errorHandler);
module.exports = router;