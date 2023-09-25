const { json } = require("body-parser");
const Tour = require("../models/toursModel");
const APIFeatures = require("../utils/apiFeatures");
const factory = require("./handlerFactory");

exports.getTourById = factory.getOne(Tour, { path: "reviews" });

// Getting all
exports.getAllTours = factory.getAll(Tour);

// Create tour
exports.createTour = factory.createOne(Tour);

//Update tour
exports.updateTour = factory.updateOne(Tour);

//delete tour
exports.deleteTour = factory.deleteOne(Tour);
