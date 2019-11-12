const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WAAS26A_Schema = new Schema({
  message_type: String,
  prn: Number,
  band_num: Number,
  block_id: Number,
  num_points: Number,
  iodi: Number,
  igp_vde: [
    {
      type: Number
    }
  ],
  give_i: [
    {
      type: Number
    }
  ],
  active: { Boolean, default: false },
  timestamp: Number
});

module.exports = mongoose.model("WAAS26A", WAAS26A_Schema);
