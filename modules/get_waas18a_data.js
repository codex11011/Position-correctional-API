const hex_binary = require("hex-to-binary");
const get_waas18a_data = (cal_data, geo_data) => {
  let binary_mask = hex_binary(cal_data[4]);
  let arr = binary_mask.split("").map(e => parseInt(e));
  let waas18a_obj = {
    prn: parseInt(cal_data[0]),
    bands: parseInt(cal_data[1]),
    band_num: parseInt(cal_data[2]),
    iodi: parseInt(cal_data[3]),
    mask: cal_data[4],
    binary_mask: arr
  };
  return waas18a_obj;
};

// #WAAS18A, COM1, 0, 16.5, SATTIME, 2038, 0.000, 00a00000, f2c0, 7103;
// 128, 3, 6, 3, 0001fe0003ff0003ff8001ffc000ffe0007ff0001ff80003fc00, 0

module.exports = get_waas18a_data;
