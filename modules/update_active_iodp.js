const ACTIVE_IODP_model = require("../models/active_iodp");

const update_active_iodp = async id => {
  let active_iodp_u = new ACTIVE_IODP_model();
  active_iodp_u.iodp = id;
  await ACTIVE_IODP_model.find({}, async (err, existing) => {
    if (err) throw err;
    if (existing) {
      ACTIVE_IODP_model.findOneAndUpdate(
        {},
        {
          $set: {
            iodp: id
          }
        },
        { upsert: true },
        (err_u, data_u) => {
          if (err_u) throw err_u;
          // console.log(`active iodp: ${id}`);
        }
      );
    }
  });
};

module.exports = update_active_iodp;
