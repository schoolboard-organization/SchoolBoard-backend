// custom error model
const HttpError = require("../models/http-error");

// include mongoose
const mongoose = require("mongoose");

// include validation via express
const { validationResult } = require("express-validator");

// custom District model
const District = require("../models/district");

/*
 * * * * * * * * * * * * * * * * * * * * * * POST for creating a new district * * * * * * * * * * * * * * * * * * * * *
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

/*
 * * * * * * * * * * * * * * * * * * * GET for all users  * * * * * * * * * * * * * * * * * * * * *
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

/*
 * * * * * * * * * * * * * * * * * * * GET district given specific zipCode  * * * * * * * * * * * * * * * * * * * * *
 */
const getDistrictByZipCode = async (req, res, next) => {
  // grabs district zip code in URL
  const zipCodeFromUrl = req.params.ZipCode;

  let foundDistrict; // variable to store the corresponding district associated with zip code

  // use zip code from url as a parameter to search
  try {
    foundDistrict = await District.find({
      districtZipCode: zipCodeFromUrl,
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
exports.getDistrictByZipCode = getDistrictByZipCode;
