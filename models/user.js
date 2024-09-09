// imports
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/*
 * mongoose district_schema object:
 * - data represents a 'school district'
 * - everything is required
 */
const user_schema = new Schema({
  user_email: { type: String, required: true },
  user_password: { type: String, required: true },
  user_zipcode: { type: String, required: true },
  user_address: { type: String, required: true },
});

// export schema as "Place"
module.exports = mongoose.model("User", user_schema);
