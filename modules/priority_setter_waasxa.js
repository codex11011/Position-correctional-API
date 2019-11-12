const WAAS1A_model = require("../models/waas1a_format");
const WAASXA_model = require("../models/waasxa_format");
const observing_timestamp_change = require("../modules/observing_timestamp_change");

//set priority of WAASXA messages in database
const set_priority_waasxa = (iodp_current, message_type) => {
  var model_type;
  if (message_type === "WAAS1A") {
    model_type = WAAS1A_model;
  } else {
    model_type = WAASXA_model;
  }

  model_type.find({ message_type: message_type }, (err, docs) => {
    if (err) throw err;
    docs.map(doc => {
      if (doc.iodp != iodp_current) {
        model_type.update(
          {
            iodp: doc.iodp,
            message_type: message_type
          },
          {
            $inc: {
              timestamp: 1
            }
          },
          (err, data) => {
            if (err) throw err;
          }
        );
      }
    });
  });
  // observing_timestamp_change(iodp_current, message_type);
};

module.exports = set_priority_waasxa;
