// let af_1 = 0,
//   af_2 = 0,
//   af_0 = 0;
// let e;
// let sqrtA;
// let prn = 0;
// let ref_week = 0;
// let ref_secs = 0;
// let toe = 0;
// let toc = 0;

// let iod;
// let IODC = 0;
// let IODE = 0;
// let IDOT = 0;

// let C_ic = 0;
// let C_is = 0;
// let C_rs = 0;
// let C_uc = 0;
// let C_rc = 0;
// let C_us = 0;

// let omega_0 = 0;
// let omega_dot = 0;

// let w = 0;
// let i_0 = 0;
// let delta_n = 0;
// let M0 = 0;
// let t = 0;

const get_binary_for_hex_char = hex_code_char => {
  let binary = parseInt(hex_code_char, 16).toString(2);
  let temp = "";
  length = binary.length;
  for (var i = 0; i < 4 - length; i++) {
    temp += "0";
  }
  return temp + binary;
};

const get_rawephema_data = (cal_data, geo_data) => {
  let binary_data = "";
  var hex_code = cal_data[3] + cal_data[4] + cal_data[5];

  //   console.log(hex_code);

  let subframe_binary_code = [...hex_code].reduce((sum, char) => {
    let binary_char_code = get_binary_for_hex_char(char);
    return sum + "" + binary_char_code;
  }, "");

  //   console.log(subframe_binary_code);
  //   console.log(subframe_binary_code.length);
  let raweph_obj = {
    sv_id: parseInt(cal_data[0]),
    ref_week: parseInt(cal_data[1]),
    ref_secs: parseInt(cal_data[2]),
    tow: 6 * parseInt(subframe_binary_code.slice(24, 41), 2),
    week_num: parseInt(subframe_binary_code.slice(48, 58), 2),
    ura: parseInt(subframe_binary_code.slice(60, 64), 2),
    satellite_health: parseInt(subframe_binary_code.slice(64, 70), 2),
    tgd: Math.pow(2, -31) * parseInt(subframe_binary_code.slice(161, 169), 2),
    IODC: parseInt(subframe_binary_code.slice(169, 176), 2),
    toc: Math.pow(2, 4) * parseInt(subframe_binary_code.slice(176, 192), 2),
    af_2: Math.pow(2, -55) * parseInt(subframe_binary_code.slice(192, 200), 2),
    af_1: Math.pow(2, -43) * parseInt(subframe_binary_code.slice(200, 216), 2),
    af_0: Math.pow(2, -31) * parseInt(subframe_binary_code.slice(216, 238), 2),
    t_1: parseInt(subframe_binary_code.slice(238, 240), 2),
    IODE_1: parseInt(subframe_binary_code.slice(288, 296), 2),
    C_rs: Math.pow(2, -5) * parseInt(subframe_binary_code.slice(296, 312), 2),
    delta_n:
      Math.pow(2, -43) * parseInt(subframe_binary_code.slice(312, 328), 2),
    M0: Math.pow(2, -31) * parseInt(subframe_binary_code.slice(328, 360), 2),
    C_uc: Math.pow(2, -29) * parseInt(subframe_binary_code.slice(360, 376), 2),
    e: Math.pow(2, -33) * parseInt(subframe_binary_code.slice(376, 408), 2),
    C_us: Math.pow(2, -29) * parseInt(subframe_binary_code.slice(408, 424), 2),
    sqrtA: Math.pow(2, -19) * parseInt(subframe_binary_code.slice(424, 456), 2),
    toe: Math.pow(2, 4) * parseInt(subframe_binary_code.slice(456, 472), 2),
    C_ic: Math.pow(2, -29) * parseInt(subframe_binary_code.slice(528, 544), 2),
    omega_0:
      Math.PI *
      Math.pow(2, -31) *
      parseInt(subframe_binary_code.slice(544, 576), 2),
    C_is: Math.pow(2, -29) * parseInt(subframe_binary_code.slice(576, 592), 2),
    i_0:
      Math.PI *
      Math.pow(2, -31) *
      parseInt(subframe_binary_code.slice(592, 624), 2),
    C_rc: Math.pow(2, -5) * parseInt(subframe_binary_code.slice(624, 640), 2),
    w:
      Math.PI *
      Math.pow(2, -31) *
      parseInt(subframe_binary_code.slice(640, 672), 2),
    omega_dot:
      Math.PI *
      Math.pow(2, -43) *
      parseInt(subframe_binary_code.slice(672, 696), 2),
    IODE_2: parseInt(subframe_binary_code.slice(696, 704), 2),
    IDOT:
      Math.PI *
      Math.pow(2, -43) *
      parseInt(subframe_binary_code.slice(704, 718), 2),
    t_2: parseInt(subframe_binary_code.slice(718, 720), 2)
  };

  algebra = require("algebra.js");
  // console.log(Date.now());

  mu = 3.986005e14;
  omega_dot_earth = 7.2921151467e-5; //(rad / sec)
  A = Math.pow(raweph_obj.sqrtA, 2);

  let F = -4.442807633 * Math.pow(10, -10);
  let t = raweph_obj.tow;
  // (raweph_obj.week_num - 1) * 604800 +

  // `${raweph_obj.af_2}*x^2 + ${raweph_obj.af_1 + 1}*x + ${cons_t}`

  // var ans = eqx.solveFor("E");
  // console.log(ans);

  let cmm = Math.sqrt(mu / Math.pow(A, 3)); // computed mean motion
  // // raweph_obj.t_1

  tk = t - raweph_obj.toe;
  // // console.log(tk);
  // // account for beginning of end of week crossover
  if (tk > 302400) tk = tk - 604800;
  if (tk < -302400) tk = tk + 604800;
  // //apply mean motion correction
  n = cmm + raweph_obj.delta_n;

  // // Mean anomaly
  mk = (raweph_obj.M0 + n * tk) * Math.PI;
  let dp = -10;
  let pi = Math.PI;
  // K = pi;

  let maxIter = 30,
    i = 0;

  let delta = Math.pow(10, dp);
  let Ek, F_eq;
  // let m;
  // m = 2.0 * pi * (m - Math.floor(m));
  if (raweph_obj.e < 0.8) Ek = mk;
  else Ek = pi;

  F_eq = Ek - raweph_obj.e * Math.sin(Ek) - mk;
  // console.log(F_eq);
  while (Math.abs(F_eq) > delta && i < maxIter) {
    Ek = mk + raweph_obj.e * Math.sin(Ek);
    // E = E - F_eq / (1.0 - raweph_obj.e * Math.cos(E));
    F_eq = Ek - raweph_obj.e * Math.sin(Ek) - mk;
    // console.log(i + " " + F_eq + " " + Ek);
    i = i + 1;
  }

  let rounded_res = Ek.toFixed(5);

  nu = Math.atan2(
    (Math.sqrt(1 - Math.pow(raweph_obj.e, 2)) * Math.sin(Ek)) /
      (1 - raweph_obj.e * Math.cos(Ek)),
    (Math.cos(Ek) - raweph_obj.e) / (1 - raweph_obj.e * Math.cos(Ek))
  );
  Phi = nu + raweph_obj.w;

  du = 0;
  dr = 0;
  di = 0;
  du =
    raweph_obj.C_us * Math.sin(2 * Phi) + raweph_obj.C_uc * Math.cos(2 * Phi);
  dr =
    raweph_obj.C_rs * Math.sin(2 * Phi) + raweph_obj.C_rc * Math.cos(2 * Phi);
  di =
    raweph_obj.C_is * Math.sin(2 * Phi) + raweph_obj.C_ic * Math.cos(2 * Phi);
  // // }
  u = Phi + du;
  r = A * (1 - raweph_obj.e * Math.cos(Ek)) + dr;
  i = raweph_obj.i_0 + raweph_obj.IDOT * tk + di;
  x_prime = r * Math.cos(u);
  y_prime = r * Math.sin(u);
  omega =
    raweph_obj.omega_0 +
    (raweph_obj.omega_dot - omega_dot_earth) * tk -
    omega_dot_earth * raweph_obj.toe;

  x = x_prime * Math.cos(omega) - y_prime * Math.cos(i) * Math.sin(omega);
  y = x_prime * Math.sin(omega) + y_prime * Math.cos(i) * Math.cos(omega);
  z = y_prime * Math.sin(i);
  // console.log("-------------------");
  position_xyz = {
    x: x / 1000,
    y: y / 1000,
    z: z / 1000
  };
  raweph_obj["position_xyz"] = position_xyz;
  return raweph_obj;
  //   console.log("----------------------------");
};
module.exports = get_rawephema_data;
