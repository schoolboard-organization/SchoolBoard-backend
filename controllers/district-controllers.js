// custom error model
const HttpError = require("../models/http-error");

// include mongoose
const mongoose = require("mongoose");

// include validation via express
const { validationResult } = require("express-validator");

// custom District model
const District = require("../models/district");

const BoardMember = require("../models/boardMember");

/**
 * POST request to add a new board member to the database and to an existing school district
 * @param {Request} req - Contains all necessary info to make a new board member along with appropriate district to associate with
 * @param {Response} res - Response to be sent back containing the new board member
 * @param {Function} next - Middleware function to handle errors
 * @returns
 */
const addMember = async (req, res, next) => {
  const errors = validationResult(req);

  // checks for 422 error: unprocessable errors, i.e invalid fields
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid inputs, double check fields.", 422));
  }

  // grabs district number from URL
  const districtNumber_ = req.params.districtNumber_;

  // grabs necessary info from body
  const {
    member_firstName,
    member_lastName,
    member_role,
    member_homeDistrict,
  } = req.body;

  // creates new board member using aforementioned info, to be added to array
  const newBoardMember = new BoardMember({
    member_firstName,
    member_lastName,
    member_role,
    member_homeDistrict,
  });

  // variable to keep track of which district new board member will be apart of
  let newBoardMember_destination;

  // iterate through all districts looking for matching district number
  try {
    newBoardMember_destination = await District.findOne({
      districtNumber: districtNumber_,
    });
  } catch (err) {
    const error = new HttpError("Error finding district inside addMember", 500);
    return next(error);
  }

  // error if there is not a valid district to add the member to
  if (newBoardMember_destination == null) {
    const err = new HttpError(
      "Board member's destination could not be found.",
      404
    );
    return next(err);
  }

  newBoardMember.member_districtId = newBoardMember_destination._id;

  let savedBoardMember;
  try {
    savedBoardMember = await newBoardMember.save();
  } catch (err) {
    return next(new HttpError("Error saving new board member", 500));
  }

  // response
  res.status(201).json({ newBoardMember: savedBoardMember });
};

/**
 * POST request to create a new district and add it to the database
 * @param {Request} req - Contains all necessary info to make a new district, name, number, and zip
 * @param {Response} res - Response to be sent back containing the new district
 * @param {Function} next - Middleware function to handle errors
 * @returns
 */
const createDistrict = async (req, res, next) => {
  // looks into req object and checks for errors which we specified
  const errors = validationResult(req);

  // checks for 422 error: unprocessable errors, i.e invalid fields
  if (!errors.isEmpty()) {
    console.log("ERROR CODE: 3. ");
    console.log(errors);
    return next(new HttpError("Invalid inputs, double check fields.", 422));
  }
  // object destructuring from the request body
  const { districtName, districtNumber, districtZipCode } = req.body;

  // create new mongoose District object
  const newDistrict = new District({
    districtName,
    districtNumber,
    districtZipCode,
  });

  // saves newly made district
  try {
    // starts session
    const session = await mongoose.startSession();

    // start transaction using session
    session.startTransaction();

    // saves newly created district
    await newDistrict.save({ session: session });

    // commits transaction IFF all operations were successful
    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Error in district-controllers. ERROR CODE: 1",
      500
    );
    return next(error);
  }

  // response, logs the created place
  res.status(201).json({ createdDistrict: newDistrict });
};

/**
 * GET request to retrieve all districts in database
 * @param {Request} req - EMPTY
 * @param {Response} res - Response to be sent back containing all districts
 * @param {Function} next - Middleware function to handle errors
 * @returns
 */
const getAllDistricts = async (req, res, next) => {
  let allDistricts; // variable to store all districts in the DB

  try {
    allDistricts = await District.find({}); // .find({}) finds all elements in the db

    // checks if there are no districts to return
    if (!allDistricts.length) {
      return res.status(404).json({
        errorMessage: "No district found. FIRST ERROR IN getAllDistricts",
      });
    }

    // returns all districts
    res.status(200).json({ allDistricts: allDistricts });
  } catch (err) {
    const error = new HttpError("Error in getAllDistricts.");
    return next(error);
  }
};

/**
 * GET request to retrieve all districts
 * @param {Request} req - EMPTY
 * @param {Response} res - Response to be sent back containing all districts
 * @param {Function} next - Middleware function to handle errors
 * @returns
 */
const getDistrictByNumber = async (req, res, next) => {
  // grabs district zip code in URL
  const districtNumberFromParams = req.params.districtNumber;

  let foundDistrict; // variable to store the corresponding district associated with zip code

  // use zip code from url as a parameter to search
  try {
    foundDistrict = await District.find({
      districtNumber: districtNumberFromParams,
    });
  } catch (err) {
    const error = new HttpError(
      "Error finding district by ZipCode. ERROR IN DISTRICT CONTROLLERS",
      404
    );
    return next(error);
  }

  // sending response
  res.status(200).json({
    foundDistrict: foundDistrict,
  });
};

// exports
exports.createDistrict = createDistrict;
exports.getAllDistricts = getAllDistricts;
exports.getDistrictByNumber = getDistrictByNumber;
exports.addMember = addMember;
