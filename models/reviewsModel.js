const mongoose = require("mongoose");

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
