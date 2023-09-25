const Reviews = require("../models/reviewsModel");
const Tours = require("../models/toursModel");
const factory = require("./handlerFactory");

//get review midelleware
exports.createReviewMid = async (req, res, next) => {
  try {
    if (!req.body.tourId) req.body.tourId = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
  } catch (error) {
    res.status(400).json({ message: error.message });
  }

  next();
};

exports.getReview = factory.getOne(Reviews);

exports.getAllReviews = factory.getAll(Reviews);

exports.createReview = factory.createOne(Reviews);

exports.updateReview = factory.updateOne(Reviews);

exports.deleteReview = factory.deleteOne(Reviews);
