const express = require("express");
const commentController = require("../controllers/commentController");
const authController = require("../controllers/authController");
const router = express.Router({ mergeParams: true });

router
  .route("/:postId")
  .get(commentController.getAllCommentsOfPost)

  .post(
    authController.protect,
    authController.restrictTo("user" || "admin"),
    commentController.createCommentMid,
    commentController.createComment
  );
router
  .route("/:id")
  .get(commentController.getComment)
  .delete(authController.protect, commentController.deleteComment);

module.exports = router;
