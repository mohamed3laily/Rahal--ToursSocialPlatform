const { json } = require("body-parser");
const Tour = require("../models/toursModel");
const APIFeatures = require("../utils/apiFeatures");

//get tour midelleware
exports.getTourById = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.id).populate("reviews");
    res.status(200).json(tour);

    if (tour == null) {
      return res.status(404).json({ message: "Cannot find tour" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  next();
};

// Getting all
exports.getAllTours = async (req, res) => {
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

// Create tour
exports.createTour = async (req, res) => {
  const tour = new Tour({
    tripName: req.body.tripName,
    destination: req.body.destination,
    date: req.body.date,
    duration: req.body.duration,
    categories: req.body.categories,
    rating: req.body.rating,
    numOfParticipants: req.body.numOfParticipants,
    price: req.body.price,
    description: req.body.description,
  });
  try {
    const newTour = await tour.save();
    res.status(201).json(newTour);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Update tour
exports.updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json({
      status: "success",
      data: {
        updatedTour,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//delete tour
exports.deleteTour = async (req, res) => {
  try {
    const deletedTour = await Tour.findByIdAndDelete(req.params.id); // delete the tour by id
    if (!deletedTour) {
      // return 404 if tour not found
      return res.status(404).json({ message: "tour not found" });
    }
    res.json({ message: "Deleted tour" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
