const Post = require("../models/postModel");
const factory = require("./handlerFactory");

exports.createPostMid = async (req, res, next) => {
  try {
    if (!req.body.author) req.body.author = req.user.id;
  } catch (error) {
    res.status(400).json({ message: error.message });
  }

  next();
};

exports.getPost = factory.getOne(Post, { path: "comments" });

exports.getAllPosts = factory.getAll(Post);

exports.createPost = factory.createOne(Post);

exports.updatePost = factory.updateOne(Post);

exports.deletePost = factory.deleteOne(Post);
