const Comment = require("../models/commentModel");
const Post = require("../models/postModel");
const factory = require("./handlerFactory");

exports.createCommentMid = async (req, res, next) => {
  try {
    const postId = req.params.postId;

    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(400)
        .json({ message: "Comment must belong to a post. Post not found." });
    }

    // Set the post ID for the comment
    req.body.post = postId;

    // Set the author as the current user if not provided in the request body
    if (!req.body.author) {
      req.body.author = req.user.id;
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllCommentsOfPost = factory.getAll(Comment);

exports.createComment = factory.createOne(Comment);
exports.getComment = factory.createOne(Comment);

exports.deleteComment = factory.deleteOne(Comment);
