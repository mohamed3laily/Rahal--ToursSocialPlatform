const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

router.post(
  "/login",
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  authController.login
);

router.post("/signup", authController.signUp);

router.post("/forgotpassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword
);

router.post("/login", authController.login);

/**
 * @swagger
 *
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     responses:
 *       200:
 *         description: A list of users.
 */
router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

// router
//   .route("/:id")
//   .get(userController.getUserById)
//   .patch(userController.updateUser)
//   .delete(userController.deleteUser);

router
  .route("/getme")
  .get(authController.protect, userController.getMe, userController.getUser);

router.patch(
  "/updateMe",
  authController.protect,
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);

module.exports = router;
