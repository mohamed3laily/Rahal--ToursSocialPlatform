const express = require("express");
const router = express.Router();
const toursController = require("../controllers/toursController");
const authController = require("../controllers/authController");

router
  .route("/")
  .get(authController.protect, toursController.getAllTours)
  .post(toursController.createTour);

router
  .route("/:id")
  .get(toursController.getTourById)
  .patch(toursController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    toursController.deleteTour
  );

module.exports = router;
