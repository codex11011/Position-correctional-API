const WAAS1A_model = require("../models/waas1a_format");
const WAASXA_model = require("../models/waasxa_format");

const observing_timestamp_change = (iodp_current, message_type) => {
  var model_type;
  if (message_type === "WAAS1A") {
    model_type = WAAS1A_model;
  } else {
    model_type = WAASXA_model;
  }
  model_type.find({ message_type: message_type }, (err, docs) => {
    docs.map(doc => {
      console.log(doc.iodp + " " + doc.timestamp);
    });
  });
};

module.exports = observing_timestamp_change;
