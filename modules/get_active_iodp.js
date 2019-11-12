const ACTIVE_IIODP_model = require("../models/active_iodp");

const get_active_iodp = async id => {
  active_iodp = {};
  await ACTIVE_IIODP_model.find({}, async (err, doc) => {
    if (err) throw err;
    if (doc) {
      await (active_iodp = doc[0]);
    }
  });
  return active_iodp;
};

module.exports = get_active_iodp;
