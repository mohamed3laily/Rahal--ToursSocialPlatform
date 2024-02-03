const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const toursRoutes = require("./routes/tourRoutes");
const reteLimit = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const reviewsRoutes = require("./routes/reviewsRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const postRoutes = require("./routes/postsRoutes");

const app = express();
// Set up security HTTP headers
app.use(helmet());

// Limit requests from same API
const limiter = reteLimit({
  max: 60,
  windowMs: 30 * 60 * 1000,
  message: "Too many request , please try again after half hour!",
});

app.use("/", limiter);
// Data sanitization against XSS
app.use(xss());
// Set up middleware
app.use(bodyParser.json());
app.use(mongoSanitize());
app.use(cors());
app.use("/users", userRoutes);
app.use("/tours", toursRoutes);
app.use("/reviews", reviewsRoutes);
app.use("/booking", bookingRoutes);
app.use("/posts", postRoutes);

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
