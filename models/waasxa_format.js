const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WAASXA_Schema = new Schema({
  message_type: String,
  prn: Number,
  iodf: Number,
  iodp: Number,
  prc: [
    {
      type: Number
    }
  ],
  udre: [
    {
      type: Number
    }
  ],
  active: { Boolean, default: false },
  timestamp: Number
});

module.exports = mongoose.model("WAASXA", WAASXA_Schema);
