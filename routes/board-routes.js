/* imports */
const express = require("express");
const router = express.Router();
const boardController = require("../controllers/board-controller");
const { check } = require("express-validator");

router.get("/all/:districtNumber", boardController.getAllMemberForDistrict);

// export
module.exports = router;
