// // /\#([^)]+)\*/;
// var str =
//   "<�����pAB��CD=�{���n�4|&M�AU�=>�����B�(<�ߛ�*+B�Cd=�������<~ߏA�=�s�����y��;����FB��C�=��(��#WAAS2A,COM1,0,37.5,SATTIME,2039,259479.000,00a00000,e194,7103;123,0,0,-10,0,0,0,0,-10,-2,0,-13,-11,0,6,8,5,14,14,14,14,5,5,14,5,6,14,5,8*e054fbb1 hjzd78<D+";

// var temp_str = str.replace(
//   /[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g,
//   ""
// );
// // var temp = "afskfsd33j";
// var test = temp_str.match(/\#([^)]+)\*/);
// console.log(test[1]);
// // /\#([^)]+)\*/

// const get_mask_data = mask => {
//   // var x = "efffffff0000000000000000000000200100000000000000000000";
//   var hex_code = mask.slice(0, 8);
//   var hex_code_char = hex_code.split("");
//   var length = 0;
//   var binary_arr = hex_code_char.map(function(e) {
//     var str = parseInt(e, 16).toString(2);
//     var temp = "";
//     length = str.length;
//     for (var i = 0; i < 4 - length; i++) {
//       temp += "0";
//     }
//     return temp + str;
//   });
//   // console.log(binary_arr);
//   var mask_data = [];
//   binary_arr.map(e => {
//     temp = e.split("");
//     temp.map(el => {
//       mask_data.push(parseInt(el));
//     });
//   });
// };

// get_mask_data("efffffff0000000000000000000000200100000000000000000000");

// const sleep = milliseconds => {
//   return new Promise(resolve => setTimeout(resolve, milliseconds));
// };

// const console_log_after = async () => {
//   while (true) {
//     await sleep(5000);
//     console.log("wow");
//   }
// };

// console_log_after();

// var lineReader = require("line-reader"),
//   Promise = require("bluebird");

// var sleep = milliseconds => {
//   return new Promise(resolve => setTimeout(resolve, milliseconds));
// };

// var eachLine = Promise.promisify(lineReader.eachLine);
// eachLine("/home/shubham/mpj/SIH/routes/gagan_data.txt", function(line) {
//   console.log(line);
// })
//   .then(function() {
//     console.log("done");
//   })
//   .catch(function(err) {
//     console.error(err);
//   });

// var LineByLineReader = require("line-by-line"),
//   lr = new LineByLineReader("/home/shubham/mpj/SIH/routes/gagan_data.txt", {
//     encoding: "utf8",
//     skipEmptyLines: true,
//     start: 0
//   });
// var http = require("http");

// http.get("https://sih.isro.gov.in/samples/P2/214_19FEB19_000000.GPS", res => {
//   var str = "";
//   console.log("Response is " + res.statusCode);

//   res.on("data", function(chunk) {
//     str += chunk;
//     console.log(chunk);
//   });

//   res.on("end", function() {
//     console.log(str);
//   });
// });

//------------------------------
// var request = http.request(options, function(res) {
//   var data = "";
//   res.on("data", function(chunk) {
//     data += chunk;
//     console.log(chunk);
//   });
//   res.on("end", function() {
//     console.log(data);
//   });
// });
// request.on("error", function(e) {
//   console.log(e.message);
// });
// request.end();

// var fs = require("fs");
// var data = "";

// var readerStream = fs.createReadStream(
//   "https://sih.isro.gov.in/samples/P2/214_19FEB19_000000.GPS"
// );
// readerStream.setEncoding("UTF8");

// readerStream.on("data", function(chunk) {
//   data += chunk;
//   console.log(chunk);
// });

// readerStream.on("end", function() {
//   console.log(data);
// });

// readerStream.on("error", function(err) {
//   console.log(err.stack);
// });

// // var request = require("request");

// let res_split;
// let geo_data;
// let cal_data;
// let message_type_current;
// let dataGagan;

// lr.on("error", function(err) {
//   // 'err' contains error object
// });

// request.get(
//   "https://sih.isro.gov.in/samples/P2/214_19FEB19_000000.GPS",
//   function(error, response, body) {
//     if (!error && response.statusCode == 200) {
//       var csv = body;
//       console.log("wow");

//       console.log(csv);
//       // setTimeout(() => {
//       //   return;
//       // }, 1000);
//       // Continue with your processing here.
//     }
//   }
// );

// lr.on("line", function(line) {
//   // pause emitting of lines...
//   console.log(line);
//   let temp_str = "" + line;
//   temp_str = temp_str.replace(
//     /[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g,
//     ""
//   );
//   const re = /\#W([^)]+)\*/;
//   let temp_result = temp_str.match(re);
//   let final = temp_result === null ? "" : "W" + temp_result[1];
//   dataGagan += final;
//   res_split = final.split(";");
//   geo_data = res_split[0].split(",");
//   cal_data = res_split[1] ? res_split[1].split(",") : "";
//   message_type_current = geo_data[0];
//   // console.log(message_type_current);
//   // if (message_type_current === "WAAS1A") {
//   //   console.log("WAAS1A");
//   // }
//   lr.pause();
//   // ...do your asynchronous line processing..
//   setTimeout(function() {
//     // ...and continue emitting lines.
//     lr.resume();
//   }, 0);
// });
const mongoose = require("mongoose");
const secret = require("./config/secret");

mongoose.connect(secret.database, { useNewUrlParser: true }, err => {
  if (err) {
    throw err;
  } else {
    console.log("connected to database");
  }
});

const ACTIVE_IODI_model = require("./models/active_iodi");
let active_iodi = new ACTIVE_IODI_model();
active_iodi.iodi = -1;

active_iodi.save();

// lr.on("end", function() {
//   // All lines are read, file is closed now.
// });

// for (let i = 0; i < number_of_iodp; i++) {
//   await WAASXA_model.find({ iodp: i }, async (err, docs) => {
//     total_timestamp = 0;
//     total_timestamp = await docs.reduce((sum, doc) => {
//       return sum + doc.timestamp;
//     }, 0);
//     // console.log(total_timestamp);
//     let temp = await (total_timestamp + (number_of_iodp - docs.length) * 100);
//     await arr.push(temp);
//   });

// console.log(arr);

// for await (const iterator of indx_arr) {
//   total_timestamp = 0;
//   await WAASXA_model.find(
//     {
//       iodp: iterator
//     },
//     async (err, docs) => {
//       total_timestamp = await docs.reduce((sum, doc) => {
//         return sum + doc.timestamp;
//       }, 0);
//       let temp = await (total_timestamp +
//         (number_of_iodp - docs.length) * 100);
//       if (temp < min) {
//         min = temp;
//         indx = iterator;
//       }
//     }
//   );
// }
// console.log(indx);

// console.log(iterator + " " + total_timestamp_1[0]);
// total_timestamp_1 = await docs_1.reduce((sum, doc) => {
//   return sum + doc.timestamp;
// }, 0);
// // console.log(total_timestamp_1 + " " + docs_1.length);
// total_timestamp_x = await docs_x.reduce((sum, doc) => {
//   return sum + doc.timestamp;
// }, 0);
// // console.log(total_timestamp_x + " " + docs_x.length);
// var m_x = await (total_timestamp_x +
//   (number_of_iodp - docs_x.length) * 100);
// var m_1 = await (total_timestamp_1 + (1 - docs_1.length) * 100);
// total_timestamp = await (m_1 + m_x);
// console.log(total_timestamp);
// if (total_timestamp < min) {
//   min = total_timestamp;
//   indx = iterator;
//   // console.log(indx);
// }

// #RAWEPHEMA, COM1, 11, 37.0, SATTIME, 2039, 259170.000, 00a00000, 97b7, 7103;
// 16,2039,259200,
// 8b0fdc545e24fdd00047044a92ac1768f3ed69cce9323f4800ffeafdba2b,
// 8b0fdc545ea932051428ec61a95058045a05666a1218f0a10e3b483f487d,
// 8b0fdc545cadff9c862ea668ffc8281fde20149915c30399ffaee632f6a2 * 3f206a4e
// let t = 240;
// count = 0;
// count_x = 0;
// for (i = 0; i < 720; i++) {
//   count++;
//   if (count === 24) {
//     count = 0;
//     count_x++;
//     console.log(count_x + " " + i);
//     if (count_x === 10) {
//       count_x = 0;
//       console.log("-------------------");
//     }
//   }
// }

// lineReader.eachLine(
//   "/home/shubham/mpj/SIH/routes/gagan_data.txt",
//   async (line, last) => {
//     // console.log("\n");

//     let temp_str = "" + line;
//     temp_str = temp_str.replace(
//       /[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g,
//       ""
//     );
//     const re = /\#W([^)]+)\*/;
//     let temp_result = temp_str.match(re);
//     let final = temp_result === null ? "" : "W" + temp_result[1];
//     dataGagan += final;
//     res_split = final.split(";");
//     geo_data = res_split[0].split(",");
//     cal_data = res_split[1] ? res_split[1].split(",") : "";
//     message_type_current = geo_data[0];
//     eventEmitter.emit("" + message_type_current);
//     // console.log("" + message_type_current);
//     if (last) {
//       res.send("dataGagan");
//       await active_iodp_row();
//       // console.log(dataGagan);
//       await return_active_iodp_data(active_iodp);
//     }
//   }
// );

// let y = Math.acos(1 / a) - a * Math.sin(Math.acos(1 / a));

// let raweph_obj = {
//   sv_id: 14,
//   C_ic: 52,
//   C_is: 65428,
//   C_rc: 7361,
//   C_rs: 1122,
//   C_uc: 977,
//   C_us: 4101,
//   IDOT: 1697,
//   IODC: 106,
//   IODE_1: 106,
//   IODE_2: 106,
//   M0: 1585595539,
//   __v: 0,
//   af_0: 3996901,
//   af_1: 6,
//   af_2: 0,
//   delta_n: 12624,
//   e: 86851256,
//   i_0: 2564318,
//   omega_0: 814628958,
//   omega_dot: 16755233,
//   ref_secs: 266400,
//   ref_week: 2039,
//   satellite_health: 0,
//   sqrtA: 2702004979,
//   t_1: 0,
//   t_2: 1,
//   toc: 16650,
//   toe: 16650,
//   ura: 0,
//   w: 11571759,
// //   week_num: 1015
// // };
// let raweph_obj = {
//   sv_id: 14,
//   C_ic: 9.685754776000977e-8,
//   C_is: 0.00012186914682388306,
//   C_rc: 230.03125,
//   C_rs: 35.0625,
//   C_uc: 0.000001819804310798645,
//   C_us: 0.000007638707756996155,
//   IDOT: 1.929265636135824e-10,
//   IODC: 106,
//   IODE_1: 106,
//   IODE_2: 106,
//   M0: 0.7383504598401487,
//   __v: 0,
//   af_0: 3996901,
//   af_1: 6,
//   af_2: 0,
//   delta_n: 1.4351826393976808e-9,
//   e: 0.010110816918313503,
//   i_0: 0.30569059029221535,
//   omega_0: 0.37934116926044226,
//   omega_dot: 0.0000019048494550588657,
//   ref_secs: 266400,
//   ref_week: 2039,
//   satellite_health: 0,
//   sqrtA: 5153.665502548218,
//   t_1: 0,
//   t_2: 1,
//   toc: 16650,
//   toe: 266400,
//   ura: 0,
//   w: 1.3794612372294068,
//   week_num: 1015
// };
// algebra = require("algebra.js");
// // console.log(Date.now());
// mu = 3.986005e14;
// omega_dot_earth = 7.2921151467e-5; //(rad / sec)
// A = Math.pow(raweph_obj.sqrtA, 2);
// // console.log(A);
// cmm = Math.sqrt(mu / Math.pow(A, 3)); // computed mean motion
// // raweph_obj.t_1

// tk = Date.now() / 1000 - raweph_obj.toe;
// // console.log(tk);
// // account for beginning of end of week crossover
// if (tk > 302400) tk = tk - 604800;
// if (tk < -302400) tk = tk + 604800;
// //apply mean motion correction
// n = cmm + raweph_obj.delta_n;

// // Mean anomaly
// mk = raweph_obj.M0 + n * tk;
// // console.log(mk);
// //solve for eccentric anomaly
// // syms E;
// var Fraction = algebra.Fraction;
// var Expression = algebra.Expression;
// var Equation = algebra.Equation;
// var exp1 = algebra.parse("x-0.010110816918313503*sin(x)");
// var exp2 = algebra.parse("226162.4458646934");

// var eq = new Equation(exp1, exp2);
// // `E - ${raweph_obj.e}*sin(E) - ${mk} = 0`;

// // var x1 = algebra.parse("1/5 * x + 2/15");
// // var x2 = algebra.parse("1/7 * x + 4");

// console.log(eq.toString());

// var answer = eq.solveFor("x");
// console.log("x = " + answer);
// var ans = eqx.solveFor("E");
// console.log(ans);

//   eqn = E - raweph_obj.e * Math.sin(E) == mk;
//   solx = vpasolve(eqn, E);
//  Ek = Math.double(solx);
// True anomaly:

// nu = Math.atan2(
//   (Math.sqrt(Math.pow(1 - raweph_obj.e, 2)) * Math.sin(Ek)) /
//     (1 - raweph_obj.e * Math.cos(Ek)),
//   (Math.cos(Ek) - raweph_obj.e) / (1 - raweph_obj.e * Math.cos(Ek))
// );
// //Ek = Math.acos((e + Math.cos(nu)) / (1 + e * Math.cos(nu)));
// compute_harmonic_correction = 1;
// Phi = nu + raweph_obj.w;
// du = 0;
// dr = 0;
// di = 0;
// if (compute_harmonic_correction === 1) {
//   //compute harmonic corrections
//   du =
//     raweph_obj.C_us * Math.sin(2 * Phi) + raweph_obj.C_uc * Math.cos(2 * Phi);
//   dr =
//     raweph_obj.C_rs * Math.sin(2 * Phi) + raweph_obj.C_rc * Math.cos(2 * Phi);
//   di =
//     raweph_obj.C_is * Math.sin(2 * Phi) + raweph_obj.C_ic * Math.cos(2 * Phi);
// }
// u = Phi + du;
// r = A * (1 - raweph_obj.e * Math.cos(Ek)) + dr;

// //inclination angle at reference time
// i = raweph_obj.i_0 + raweph_obj.IDOT * tk + di;
// x_prime = r * Math.cos(u);
// y_prime = r * Math.sin(u);
// omega =
//   raweph_obj.omega_0 +
//   (raweph_obj.omega_dot - omega_dot_earth) * tk -
//   omega_dot_earth * raweph_obj.toe;

// x = x_prime * Math.cos(omega) - y_prime * Math.cos(i) * Math.sin(omega);
// y = x_prime * Math.sin(omega) + y_prime * Math.cos(i) * Math.cos(omega);
// z = y_prime * Math.sin(i);

// console.log(x, y, z);

// { "_id" : ObjectId("5c715fdc6f95118acf1e3c6f"), "sv_id" : 14, "C_ic" : 52, "C_is" : 65428, "C_rc" : 7361, "C_rs" : 1122, "C_uc" : 977, "C_us" : 4101, "IDOT" : 1697, "IODC" : 106, "IODE_1" : 106, "IODE_2" : 106, "M0" : 1585595539, "__v" : 0, "af_0" : 3996901, "af_1" : 6, "af_2" : 0, "delta_n" : 12624, "e" : 86851256, "i_0" : 656465544, "omega_0" : 814628958, "omega_dot" : 16755233, "ref_secs" : 266400, "ref_week" : 2039, "satellite_health" : 0, "sqrtA" : 2702004979, "t_1" : 0, "t_2" : 1, "toc" : 16650, "toe" : 16650, "ura" : 0, "w" : 2962370450, "week_num" : 1015 }
