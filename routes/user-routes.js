/* imports */
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user-controller.js");
const { check } = require("express-validator");

router.post(
  "/",
  [check("user_email").not().isEmpty(), check("user_password").not().isEmpty()],
  userController.signup
);

router.post(
  "/login",
  [check("user_email").not().isEmpty(), check("user_password").not().isEmpty()],
  userController.login
);

// export
module.exports = router;
