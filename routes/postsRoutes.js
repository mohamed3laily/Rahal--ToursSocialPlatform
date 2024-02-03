const express = require("express");
const postController = require("../controllers/postcontroller");
const authController = require("../controllers/authController");
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(postController.getAllPosts)

  .post(
    authController.protect,
    authController.restrictTo("user" || "admin"),
    postController.createPostMid,
    postController.createPost
  );
router
  .route("/:id")
  .get(postController.getPost)
  .put(authController.protect, postController.updatePost)
  .delete(authController.protect, postController.deletePost);

module.exports = router;
