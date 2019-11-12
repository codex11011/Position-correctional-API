const router = require("express").Router();

// const return_active_iodp_data = require("../modules/return_iodp_data");
// const get_rawephema_data_by_id = require("../modules/get_raweph_data_byId");
// const get_active_iodp = require("../modules/get_active_iodp");

const download_gps_correctional_data = require("./download");
const read_file_data = require("./read_file");

download_gps_correctional_data();
setTimeout(() => {
  download_gps_correctional_data();
}, 300001);

// setInterval(() => {
//   download_gps_correctional_data();
// }, 300000);

// read_file_data();

module.exports = router;
