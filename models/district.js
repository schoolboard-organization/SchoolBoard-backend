// imports
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/*
 * mongoose district_schema object:
 * - data represents a 'school district'
 * - everything is required
 */
const district_schema = new Schema({
  districtNumber: { type: String, required: true },
  districtName: { type: String, required: true },
  districtZipCode: { type: Number, required: true },
});

// export schema as "Place"
module.exports = mongoose.model("District", district_schema);
