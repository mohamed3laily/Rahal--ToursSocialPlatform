const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - rating
 *         - tour
 *         - user
 *       properties:
 *         reviewContent:
 *           type: string
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *         createdAt:
 *           type: string
 *           format: date-time
 *         tour:
 *           type: string
 *           description: ID of the tour the review belongs to
 *         user:
 *           type: string
 *           description: ID of the user who wrote the review
 *       example:
 *         reviewContent: "This tour was amazing!"
 *         rating: 5
 *         createdAt: "2022-02-08T12:00:00Z"
 *         tour: "5fd7eb2c5b06f6318c496c65"
 *         user: "5fd7eb2c5b06f6318c496c64"
 */
const reviewsSchema = new mongoose.Schema(
  {
    reviewContent: {
      type: String,
    },
    rating: {
      type: Number,
      required: true,
      min: [1, "the rating must be above 1"],
      max: [5, "the rating must be less than 5"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tours",
      required: [true, "Review must belong to a tour."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user."],
    }, // user who wrote the review
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewsSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewsSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "userName photo",
  });
  next();
});

module.exports = mongoose.model("Reviews", reviewsSchema);
