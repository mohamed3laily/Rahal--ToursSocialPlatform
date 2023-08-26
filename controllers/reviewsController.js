const Reviews = require("../models/reviewsModel");
const Tours = require("../models/toursModel");

//get review midelleware
exports.getReview = async (req, res, next) => {
  try {
    const review = await Reviews.findById(req.params.id);
    if (review == null) {
      return res.status(404).json({ message: "Cannot find review" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.review = review;
  next();
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Reviews.find();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.createReview = async (req, res) => {
  try {
    const newReview = await Reviews.create(req.body);
    res.status(201).json(newReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
