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
  const { districtName, districtNumber } = req.body;

  // create new mongoose District object
  const newDistrict = new District({
    districtName,
    districtNumber,
  });

  // ADDING COMMENT TO RE-PUSH

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

// exports
exports.createDistrict = createDistrict;
