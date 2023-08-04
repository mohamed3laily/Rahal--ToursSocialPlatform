const User = require("../models/userModel");
var jwt = require("jsonwebtoken");
const { promisify } = require("util");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: process.env.Token_EXPIRES_IN,
  });
};

exports.signUp = async (req, res) => {
  const {
    userName,
    role,
    password,
    passwordConform,
    firstName,
    secondName,
    email,
    phoneNumber,
    location,
  } = req.body;

  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    console.log(existingUser);
    if (existingUser) {
      return res.status(409).json({
        message: "Email already in use. Please use a different email.",
      });
    }

    // Create a new user
    const user = new User({
      userName,
      role,
      password,
      passwordConform,
      firstName,
      secondName,
      email,
      phoneNumber,
      location,
    });

    // Save the new user to the database
    const newUser = await user.save();

    // Generate and send JWT token
    const token = signToken(newUser._id);
    res.status(201).json({ message: "User created", token, data: newUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email && !password) {
      return next(new Error("Please provide email and password"));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password, user.password))) {
      return next(new Error("Incorrect email or password"));
    }

    const token = signToken(user._id);
    res.status(200).json({ message: "User logged in", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.protect = async (req, res, next) => {
  // get the token from the header if it exists
  let token = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new Error("You are not logged in! Please log in to get access.")
    );
  }

  // Verify token
  let decoded;
  try {
    decoded = await promisify(jwt.verify)(token, process.env.TOKEN_SECRET);
    console.log(decoded);
  } catch (error) {
    return next(res.status(401).json({ message: error.message }));
  }
  //check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(res.status(401).json({ message: "User no longer exists" }));
  }
  req.user = currentUser;
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        res.status(403).json({ message: "You do not have permission" })
      );
    }
    next();
  };
};

// reset password
exports.forgotPassword = async (req, res, next) => {
  //check if user exists
  console.log(req.body.email);
  if (!req.body.email) {
    return next(new Error("Please provide email"));
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(res.status(404).json({ message: "User not found" }));
  }
  //generate random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
};
