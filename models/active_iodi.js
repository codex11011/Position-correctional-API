const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Active_IODI_Schema = new Schema({
  iodi: { type: Number, default: -1 }
});

module.exports = mongoose.model("Active_IODI", Active_IODI_Schema);
