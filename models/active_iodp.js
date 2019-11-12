const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Active_IODP_Schema = new Schema({
  iodp: { type: Number, default: -1 }
});

module.exports = mongoose.model("Active_IODP", Active_IODP_Schema);
