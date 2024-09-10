// custom error hook
const HttpError = require("../models/http-error");

const User = require("../models/user");
// include mongoose
const mongoose = require("mongoose");

// include validation via express
const { validationResult } = require("express-validator");

/**
 * POST request to LOGIN a user
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * @returns
 */
const login = async (req, res, next) => {
  const errors = validationResult(req);

  // checks for 422 error: unprocessable errors, i.e invalid fields
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid inputs, double check fields.", 422));
  }

  // grabs necessary info from body
  const { user_email, user_password } = req.body;

  const req_user_email = user_email;
  const req_user_password = user_password;
  let validUser;

  try {
    validUser = await User.findOne({
      user_email: req_user_email,
      user_password: req_user_password,
    });
  } catch (err) {
    console.log("CANT FIND USER CREDS. ERROR IN USER CONTROLLER");
    return next(err);
  }

  if (!validUser) {
    return next(
      new HttpError("No user found with given email and password", 403)
    );
  }

  // response
  res.status(200).json({ validUserId: validUser });
};

/**
 * POST request to SIGN UP a user, add their data to the database
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * @returns
 */
const signup = async (req, res, next) => {
  const errors = validationResult(req);

  // checks for 422 error: unprocessable errors, i.e invalid fields
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid inputs, double check fields.", 422));
  }

  // grabs necessary info from body
  const { user_email, user_password } = req.body;

  let repeatUser;

  try {
    repeatUser = await User.findOne({ user_email: user_email });
  } catch (err) {
    console.log("ERROR WHILE FINDING REPEAT EMAIL");
    return next(err);
  }

  if (repeatUser !== null) {
    const error = new HttpError("Error: Email is already in use", 401);
    return next(error);
  }

  // creates new board member using aforementioned info, to be added to array
  const newUser = new User({
    user_email,
    user_password,
    user_zipcode: "-1",
    user_address: "-1",
  });
  //
  let savedNewUser;
  try {
    savedNewUser = await newUser.save();
    console.log("NEW USER SAVED");
  } catch (err) {
    console.log("Error is:", err);
    return next(new HttpError("Error saving new user", 500));
  }

  // response
  res.status(201).json({ newUser: savedNewUser });
};

exports.signup = signup;
exports.login = login;
