const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WAAS1A_Schema = new Schema({
  message_type: String,
  prn: Number,
  mask: String,
  iodp: { type: Number },
  active: { Boolean, default: false },
  timestamp: Number
});

module.exports = mongoose.model("WAAS1A", WAAS1A_Schema);
