const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RAWEPHEMA_Schema = new Schema({
  sv_id: Number,
  ref_week: Number,
  ref_secs: Number,
  week_num: Number,
  tow: Number,
  ura: Number,
  satellite_health: Number,
  IODC: Number,
  tgd: Number,
  toc: Number,
  af_2: Number,
  af_1: Number,
  af_0: Number,
  t_1: Number,
  IODE_1: Number,
  C_rs: Number,
  delta_n: Number,
  M0: Number,
  C_uc: Number,
  e: Number,
  C_us: Number,
  sqrtA: Number,
  toe: Number,
  C_ic: Number,
  omega_0: Number,
  C_is: Number,
  i_0: Number,
  C_rc: Number,
  w: Number,
  omega_dot: Number,
  IODE_2: Number,
  IDOT: Number,
  t_2: Number,
  position_xyz: {
    x: Number,
    y: Number,
    z: Number
  }
});

module.exports = mongoose.model("RAWEPHEMA", RAWEPHEMA_Schema);

// #RAWEPHEMA,COM1,13,37.0,SATTIME,2039,259170.000,00a00000,97b7,7103;
// 10,2039,259200,
// 8b0fdc545e24fdd00047044a92ac1768f3ed69cc04503f4800ffc0100ad0,
// 8b0fdc545ea950f5972c13924ef489f6ec0234d658175ea10d60de3f487c,
// 8b0fdc545f2cfff9029e3d420000273afdd814fb8f6ed3b3ffabe55002ea
