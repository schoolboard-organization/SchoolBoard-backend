// custom error hook
const HttpError = require("../models/http-error");

// include mongoose
const mongoose = require("mongoose");

// include validation via express
const { validationResult } = require("express-validator");

// custom District model
const District = require("../models/district");

// custom Board Member model
const BoardMember = require("../models/boardMember");

/**
 * GET request to get all board members associated with a given district number
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * @returns
 */
const getAllMemberForDistrict = async (req, res, next) => {
  // grab district number from API URL
  const districtNumber_ = req.params.districtNumber;

  // first, find the district associated with the district number
  let associatedDistrict;
  try {
    associatedDistrict = await District.findOne({
      districtNumber: districtNumber_,
    });
  } catch (err) {
    const error = new HttpError(
      "Error finding district while getting all members. In getAllMemberForDistrict.",
      500
    );
  }

  // second, using the associatedDistrict, get its _id
  let associatedDistrictId = associatedDistrict._id;

  // third, iterate through all members looking for matching districtId's with
  let allBoardMembers;
  try {
    allBoardMembers = await BoardMember.find({
      member_districtId: associatedDistrictId,
    });
  } catch (err) {
    const error = new HttpError(
      "Error finding all board members. In getAllMemberForDistrict.",
      500
    );
  }

  console.log("District id" + associatedDistrictId);
  console.log(allBoardMembers);

  res.status(200).json({
    allBoardMembers: allBoardMembers,
  });
};

exports.getAllMemberForDistrict = getAllMemberForDistrict;
