const User = require("../models/userModel");
var jwt = require("jsonwebtoken");
const { promisify } = require("util");
const sendEmail = require("../utils/emailSender");
const crypto = require("crypto");
const { compare } = require("bcryptjs");
///////////////////////////////////////////////
const signToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: process.env.Token_EXPIRES_IN,
  });
};

const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookiesOptions = {
    expires: new Date(
      Date.now() + process.env.Token_COOKIES_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookiesOptions.secure = true;

  user.password = undefined;
  res.cookie("jwt", token, cookiesOptions);
  res.status(statusCode).json({ message: "success", token, data: user });
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
    sendToken(newUser, 201, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, userName, password } = req.body;

    if (!password) {
      return next(new Error("Please provide a password"));
    }

    // Check if either email or userName is provided
    if (!email && !userName) {
      return next(new Error("Please provide email or username"));
    }

    let user;

    if (email) {
      user = await User.findOne({ email }).select("+password");
    } else if (userName) {
      user = await User.findOne({ userName }).select("+password");
    }

    if (!user || !(await user.comparePassword(password, user.password))) {
      return next(new Error("Incorrect email/username or password"));
    }

    sendToken(user, 200, res);
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

  //send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
  try {
    sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });

    res.status(200).json({
      message: "Token sent to email",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(res.status(500).json({ message: error.message }));
  }
};
//reset password
exports.resetPassword = async (req, res, next) => {
  // get user using token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      res.status(400).json({ message: "Token is invalid or has expired" })
    );
  }
  //set new password
  user.password = req.body.password;
  user.passwordConform = req.body.passwordConform;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  //log the user in, send JWT
  const token = signToken(user._id);
  res.status(200).json({ message: "User logged in", token });
};
// update password
exports.updatePassword = async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.comparePassword(req.body.passwordCurrent, user.password))) {
    return next(new Error("Your current password is wrong"));
  }
  user.password = req.body.password;
  user.passwordConform = req.body.passwordConform;
  await user.save();
  sendToken(user, 201, res);
};

//delete user
exports.deleteMe = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({ message: "User deleted" });
};
