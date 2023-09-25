const { json } = require("body-parser");
const factory = require("./handlerFactory");

const User = require("../models/userModel");

//get user midelleware
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "Cannot find user" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.user = user;
  next();
};

// Getting all
exports.getAllUsers = factory.getAll(User);

// Get one user
exports.getUserById = factory.getOne(User);

// Create user
exports.createUser = factory.createOne(User);

//Update user
exports.updateUser = factory.updateOne(User);

//delete user
exports.deleteUser = factory.deleteOne(User);
