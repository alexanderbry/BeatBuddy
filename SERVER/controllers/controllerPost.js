const { Post } = require("../models");
const { GoogleGenerativeAI } = require("@google/generative-ai");


class ControllerPost {
  static async getAllPosts(req, res, next) {
    try {
      let posts = await Post.findAll({
        include: ["Profile"],
        order: [["createdAt", "DESC"]],
      });
      
      res.json(posts);
    } catch (error) {
      next(error);
    }
  }
  
  static async createPost(req, res, next) {
    try {
      const { caption, imageUrl, TrackId, ProfileId } = req.body;
      
      await Post.create({
        caption,
        imageUrl,
        TrackId,
        ProfileId,
      });
      
      res.status(201).json({
        message: "Post created successfully",
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async updatePost(req, res, next) {
    try {
      const { PostId } = req.params;
      const { caption } = req.body;
      
      const post = await Post.findByPk(PostId);
      if (!post) throw { name: "NotFound" };
      
      await Post.update(
        {
          caption,
        },
        {
          where: { id: PostId },
        }
      );

      res.json({
        message: "Post updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async deletePost(req, res, next) {
    try {
      const { PostId } = req.params;

      const post = await Post.findByPk(PostId);
      if (!post) throw { name: "NotFound" };

      await Post.destroy({ where: { id: PostId } });

      res.json({
        message: "Post deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
  static async gemini(req, res, next) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_CLIENT_ID);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = "Write a funny greeting different greeting for me max 100 words";
      
      const result = await model.generateContent(prompt);
      
      res.json(result.response.text());
     } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = ControllerPost;
