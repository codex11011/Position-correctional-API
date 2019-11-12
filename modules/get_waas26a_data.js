const hex_binary = require("hex-to-binary");
const get_waas26a_data = (cal_data, geo_data) => {
  let arr_igp_vde = cal_data.slice(4, 19).map(e => parseInt(e));
  let arr_give_i = cal_data.slice(19, 34).map(e => parseInt(e));
  let waas26a_obj = {
    prn: parseInt(cal_data[0]),
    band_num: parseInt(cal_data[1]),
    block_id: parseInt(cal_data[2]),
    num_points: parseInt(cal_data[3]),
    igp_vde: arr_igp_vde,
    give_i: arr_give_i,
    iodi: parseInt(cal_data[34])
  };
  return waas26a_obj;
};

module.exports = get_waas26a_data;
// #WAAS26A, COM1, 0, 16.5, SATTIME, 2038, 0.000, 00a00000, ec70, 7103;
//  127, 6, 1, 15, 1, 12, 1, 13, 0, 14, 2, 13, 2, 13, 2, 12, 2, 12, 2, 12, 2, 12, 2, 12, 1, 12, 1, 12, 1, 13, 0, 14, 1, 13, 3, 0
