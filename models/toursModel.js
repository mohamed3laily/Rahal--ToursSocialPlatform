const mongoose = require('mongoose');

const toursSchema = new mongoose.Schema({
  tripName: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  categories: {
    type: [String],
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min:[1, "the rating must be above 1"],
    max:[5, "the rating must be less than 5"]
  },
  numOfParticipants: {
    type: Number,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },
 
  description: {
    type: String,
    required: true,
  },
});

const Tours = mongoose.model('Tours', toursSchema);

module.exports = Tours;
