const express = require("express");
const router = express.Router();
const toursController = require("../controllers/toursController");
const authController = require("../controllers/authController");
const reveiwRouter = require("./reviewsRoutes");

router.use("/:tourId/reviews", reveiwRouter);

router
  .route("/")
  .get(toursController.getAllTours)
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
