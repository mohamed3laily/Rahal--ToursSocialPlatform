const { json } = require("body-parser");
const factory = require("./handlerFactory");
const User = require("../models/userModel");

const multer = require("multer");
const sharp = require("sharp");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("please upload a photo", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("avatar");

exports.resizeUserPhoto = async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`photos/avatars/${req.file.filename}`);

  next();
};

//get user midelleware

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

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user._id.toString(); // Convert ObjectId to string
  console.log(req.params.id);

  next();
};
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Cannot find user" });
    }

    // Set the user in the response object
    res.user = user;
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  // Continue to the next middleware or route handler
  next();
};
exports.updateMe = async (req, res, next) => {
  try {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return res.status(400).json({
        status: "fail",
        message:
          "This route is not for password updates. Please use /updateMyPassword.",
      });
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(
      req.body,
      "firstName",
      "secondName",
      "email"
    );
    if (req.file) filteredBody.avatar = req.file.filename;
    console.log(filteredBody);
    // 3) Update user document
    const updatedUser = await User.findOneAndUpdate(
      { id: req.user._id },
      filteredBody,
      { new: true }
    );
    res.status(200).json({
      status: "success",
      data: updatedUser,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
