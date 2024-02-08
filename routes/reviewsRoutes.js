const express = require("express");
const reviewsController = require("../controllers/reviewsController");
const authController = require("../controllers/authController");
const router = express.Router({ mergeParams: true });
/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get all reviews
 *     description: Retrieve a list of all reviews.
 *     responses:
 *       '200':
 *         description: A successful response with the list of reviews.
 *       '500':
 *         description: Internal server error.
 *   post:
 *     summary: Create a new review
 *     description: Create a new review with the provided data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
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
  .get(reviewsController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo("user" || "admin"),
    reviewsController.createReviewMid,
    reviewsController.createReview
  );

module.exports = router;
