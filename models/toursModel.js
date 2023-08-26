const mongoose = require("mongoose");
const User = require("./userModel");
const Reviews = require("./reviewsModel");

const toursSchema = new mongoose.Schema(
  {
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
      min: [1, "the rating must be above 1"],
      max: [5, "the rating must be less than 5"],
    },
    numOfParticipants: {
      type: Number,
      required: true,
    },
    startLocation: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
      },
    ],
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },

        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    price: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// virtual populate

toursSchema.virtual("reviews", {
  ref: "Reviews",
  foreignField: "tour",
  localField: "_id",
});

toursSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt",
  });
  next();
});

const Tours = mongoose.model("Tours", toursSchema);

module.exports = Tours;
