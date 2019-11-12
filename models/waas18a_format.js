const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WAAS18A_Schema = new Schema({
  message_type: String,
  prn: Number,
  bands: Number,
  band_num: Number,
  binary_mask: [{ type: Number }],
  mask: String,
  iodi: { type: Number },
  active: { Boolean, default: false },
  timestamp: Number
});

module.exports = mongoose.model("WAAS18A", WAAS18A_Schema);
