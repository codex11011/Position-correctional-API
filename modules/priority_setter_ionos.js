const WAAS18A_model = require("../models/waas18a_format");
const WAAS26A_model = require("../models/waas26a_format");

const set_priority_ionos = (iodi_current, message_type) => {
  var model_type;
  if (message_type === "WAAS18A") {
    model_type = WAAS18A_model;
  } else if (message_type === "WAAS26A") {
    model_type = WAAS26A_model;
  }

  model_type.find({ message_type: message_type }, (err, docs) => {
    if (err) throw err;
    docs.map(doc => {
      if (doc.iodi != iodi_current) {
        model_type.update(
          {
            iodi: doc.iodi,
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

module.exports = set_priority_ionos;
