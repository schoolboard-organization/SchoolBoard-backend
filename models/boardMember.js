// imports
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/*
 * mongoose boardMember_schema object:
 * - data represents a school board member
 * - everything is required
 */
const boardMember_schema = new Schema({
  member_firstName: { type: String, required: true },
  member_lastName: { type: String, required: true },
  member_role: { type: String, required: true },
  member_homeDistrict: { type: String, required: true },

  member_districtId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "District",
  },
});

// export schema as "Place"
module.exports = mongoose.model("BoardMember", boardMember_schema);
