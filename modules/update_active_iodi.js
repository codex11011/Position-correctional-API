const ACTIVE_IODI_model = require("../models/active_iodi");

const update_active_iodi = async id => {
  let active_iodi_u = new ACTIVE_IODI_model();
  active_iodi_u.iodi = id;
  await ACTIVE_IODI_model.find({}, async (err, existing) => {
    if (err) throw err;
    if (existing) {
      ACTIVE_IODI_model.findOneAndUpdate(
        {},
        {
          $set: {
            iodi: id
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

module.exports = update_active_iodi;
