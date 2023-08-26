const { json } = require("body-parser");

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
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get one user
exports.getUserById = (req, res) => {
  res.json(res.user);
};

// Create user
exports.createUser = async (req, res) => {
  const user = new User({
    userName: req.body.userName,
    password: req.body.password,
    firstName: req.body.firstName,
    secondName: req.body.secondName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    location: req.body.location,
  });
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Update user
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json({
      status: "success",
      data: {
        updatedUser,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//delete user
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id); // delete the user by id
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "Deleted user" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
