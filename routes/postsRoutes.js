const express = require("express");
const postController = require("../controllers/postcontroller");
const authController = require("../controllers/authController");
const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     description: Retrieve a list of all the posts.
 *     responses:
 *       '200':
 *         description: A successful response with the list of posts.
 *       '500':
 *         description: Internal server error.
 *   post:
 *     summary: Create a new post
 *     description: Create a new post with the provided data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       '201':
 *         description: Review created successfully.
 *       '400':
 *         description: Bad request. Invalid input data.
 *       '500':
 *         description: Internal server error.
 */

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
