const GPS = require("gps");
const readChunk = require("read-chunk");
const fs = require("fs");
const lineReader = require("line-reader");
const events = require("events");
const LineByLineReader = require("line-by-line");
var readingTime = require("reading-time");

const WAAS1A_model = require("../models/waas1a_format");
const WAASXA_model = require("../models/waasxa_format");
const RAWEPHEMA_model = require("../models/rawEphema_format");
const WAAS18A_model = require("../models/waas18a_format");
const WAAS26A_model = require("../models/waas26a_format");

// const return_active_iodp_data = require("../modules/return_iodp_data");
const set_priority_ionos = require("../modules/priority_setter_ionos");
const set_priority_waasxa = require("../modules/priority_setter_waasxa");
const get_rawephema_data = require("../modules/get_rawephema_data");
// const get_rawephema_data_by_id = require("../modules/get_raweph_data_byId");
const update_active_iodp = require("../modules/update_active_iodp");
const update_active_iodi = require("../modules/update_active_iodi");
// const get_active_iodp = require("../modules/get_active_iodp");
const get_waas18a_data = require("../modules/get_waas18a_data");
const get_waas26a_data = require("../modules/get_waas26a_data");

// [f-index,s-index]; f-index:priority, s-index:active state,0:not active
let waas1a_iodp_queue = [[-1, 0], [-1, 0], [-1, 0], [-1, 0]];

let message_type_current; //current message being served
let eventEmitter = new events.EventEmitter();
let res_split;
let geo_data;
let cal_data;
let number_of_iodp = 4;
let active_iodp = -1; // active iodp

//global iodp state functions
const waas1a_iodp_queue_active_state_setter = indx => {
  waas1a_iodp_queue[indx][1] = 1;
  for (let i = 0; i < waas1a_iodp_queue.length; i++) {
    if (i != indx) {
      waas1a_iodp_queue[i][1] = 0;
    }
  }
};

const waas1a_iodp_queue_priority_setter = iodp_current => {
  for (let i = 0; i < waas1a_iodp_queue.length; i++) {
    if ((waas1a_iodp_queue[i][0] != -1) & (i != iodp_current)) {
      waas1a_iodp_queue[i][0]++;
    }
  }
  // console.log(waas1a_iodp_queue);
};

let indx = -1;
let active_iodi = -1;
//active iodp index
let number_of_iodi = 4;

const active_iodi_row = async () => {
  let min = 2000;
  let timestamp_18x = 0;
  let timestamp_26x = 0;
  let total_timestamp = 0;
  let sum_x = 0;
  let block_id_18 = 0;
  let sum_1 = 0;
  for (let iterator = 0; iterator < number_of_iodi; iterator++) {
    let present = 0;
    // total_timestamp_x = 0;
    await WAAS18A_model.findOne({ iodi: iterator }, async (err_X, docs_18x) => {
      if (docs_18x === null) {
        present = 0;
        timestamp_18x = 0;
        timestamp_26x = 0;
        // await WAAS26A_model.findOne({{ iodi: iterator }});
      } else {
        present = 1;
        timestamp_18x = await docs_18x.timestamp;
        band_num_18 = docs_18x.band_num;
        // // console.log(timestamp_18x);
        await WAAS26A_model.findOne(
          { iodi: iterator, band_num: band_num_18 },
          async (err_y, docs_26x) => {
            if (docs_26x === null) {
              timestamp_26x = 200;
            } else {
              timestamp_26x = docs_26x[0].timestamp;
            }
          }
        );
      }
      // console.log(active_iodi, iterator);
      sum_t = await (timestamp_18x + timestamp_26x);
      if (sum_t < min && present != 1) {
        await (min = sum_t);
        await (active_iodi = iterator);
      }
      // let sum_time =
    });
  }

  // console.log(active_iodi);
  update_active_iodi(active_iodi);
  // active_iodi = indx;

  // return indx;
};

const active_iodp_row = async () => {
  let min = 2000;
  let total_timestamp_x = 0;
  let sum_x = 0;
  let sum_1 = 0;
  for (let iterator = 0; iterator < number_of_iodp; iterator++) {
    total_timestamp_x = 0;
    await WAASXA_model.find({ iodp: iterator }, async (err_X, docs_x) => {
      if (docs_x.length === 0 || docs_x === null) {
        total_timestamp_x = 0;
      } else {
        total_timestamp_x = await docs_x.reduce((sum, doc) => {
          return sum + doc.timestamp;
        }, 0);
      }
      sum_x = await (total_timestamp_x +
        (number_of_iodp - docs_x.length) * 100);

      sum_1 =
        waas1a_iodp_queue[iterator][0] === -1
          ? 100
          : waas1a_iodp_queue[iterator][0];
      var sum_t = await (sum_1 + sum_x);
      if (sum_t < min && waas1a_iodp_queue[iterator][0] != -1) {
        min = sum_t;
        indx = iterator;
      }
      // console.log(sum_t + " " + iterator);
      // console.log("\n");
    });
  }
  console.log(indx);
  update_active_iodp(indx);
  active_iodp = indx;

  // return indx;
};

// event listners
// #WAAS1A listner
const WAAS1A_listner = () => {
  let WAAS1A_current = new WAAS1A_model();
  WAAS1A_current.message_type = "WAAS1A";
  WAAS1A_current.prn = parseInt(cal_data[0]);
  WAAS1A_current.mask = cal_data[1];
  WAAS1A_current.iodp = parseInt(cal_data[2]);
  var iodp_current = parseInt(cal_data[2]);
  WAAS1A_current.timestamp = 0;
  // console.log(waas1a_iodp_queue);
  WAAS1A_model.findOne({ iodp: iodp_current }, (err, existing) => {
    if (existing) {
      WAAS1A_model.findOneAndUpdate(
        { iodp: iodp_current },
        {
          $set: {
            prn: WAAS1A_current.prn,
            mask: WAAS1A_current.mask,
            timestamp: WAAS1A_current.timestamp
          }
        },
        { upsert: true },
        (err_u, data_u) => {
          if (err_u) throw err_u;
          // console.log("updated");
        }
      );
    } else {
      WAAS1A_current.save((err_s, data_s) => {
        if (err_s) throw err_s;
        // console.log("saved");
      });
    }
  });
  set_priority_waasxa(iodp_current, "WAAS1A");
  waas1a_iodp_queue[iodp_current][0] = 0;
  waas1a_iodp_queue_priority_setter(iodp_current);
  active_iodp_row();
};

// #WAASXA listner :- 2,3,4,5
const WAASXA_listner = async () => {
  let WAASXA_current = new WAASXA_model();
  WAASXA_current.message_type = message_type_current;
  WAASXA_current.prn = parseInt(cal_data[0]);
  WAASXA_current.iodf = parseInt(cal_data[1]);
  WAASXA_current.iodp = parseInt(cal_data[2]);
  WAASXA_current.prc = cal_data.slice(3, 16);
  WAASXA_current.udre = cal_data.slice(16, 30);
  WAASXA_current.timestamp = 0;
  var iodp_current = await parseInt(cal_data[2]);
  // console.log(WAASXA_current);
  if (WAASXA_current === undefined) {
    console.log("nan--->");
  } else {
    WAASXA_model.find(
      { iodp: iodp_current, message_type: WAASXA_current.message_type },
      (err, existing) => {
        if (existing) {
          WAASXA_model.findOneAndUpdate(
            {
              iodp: iodp_current,
              message_type: WAASXA_current.message_type
            },
            {
              $set: {
                prn: WAASXA_current.prn,
                iodf: WAASXA_current.iodf,
                prc: WAASXA_current.prc,
                udre: WAASXA_current.udre,
                mask: WAASXA_current.mask,
                timestamp: WAASXA_current.timestamp
              }
            },
            { upsert: true },
            (err_u, data_u) => {
              if (err_u) throw err_u;
              // console.log("updated");
            }
          );
        } else {
          WAASXA_current.save((err_s, data_s) => {
            if (err_s) throw err_s;
            // console.log("saved");
          });
        }
      }
    );
  }
  set_priority_waasxa(iodp_current, WAASXA_current.message_type);
  // console.log(cal_data);
  active_iodp_row();
};

let rawephema_current_satellite_id = -1;
const RAWEPHEMA_listner = async () => {
  // console.log(cal_data);
  // console.log(geo_data);
  rawephema_data = await get_rawephema_data(cal_data, geo_data);

  let RAWEPHEMA_current = new RAWEPHEMA_model();
  RAWEPHEMA_current.ref_week = rawephema_data.ref_week;
  RAWEPHEMA_current.ref_secs = rawephema_data.ref_secs;
  RAWEPHEMA_current.week_num = rawephema_data.week_num;
  RAWEPHEMA_current.tow = rawephema_data.tow;
  RAWEPHEMA_current.ura = rawephema_data.ura;
  RAWEPHEMA_current.satellite_health = rawephema_data.satellite_health;
  RAWEPHEMA_current.IODC = rawephema_data.IODC;
  RAWEPHEMA_current.tgd = rawephema_data.tgd;
  RAWEPHEMA_current.toc = rawephema_data.toc;
  RAWEPHEMA_current.af_2 = rawephema_data.af_2;
  RAWEPHEMA_current.af_1 = rawephema_data.af_1;
  RAWEPHEMA_current.af_0 = rawephema_data.af_0;
  RAWEPHEMA_current.t_1 = rawephema_data.t_1;
  RAWEPHEMA_current.IODE_1 = rawephema_data.IODE_1;
  RAWEPHEMA_current.C_rs = rawephema_data.C_rs;
  RAWEPHEMA_current.delta_n = rawephema_data.delta_n;
  RAWEPHEMA_current.M0 = rawephema_data.M0;
  RAWEPHEMA_current.C_uc = rawephema_data.C_uc;
  RAWEPHEMA_current.e = rawephema_data.e;
  RAWEPHEMA_current.C_us = rawephema_data.C_us;
  RAWEPHEMA_current.sqrtA = rawephema_data.sqrtA;
  RAWEPHEMA_current.toe = rawephema_data.toe;
  RAWEPHEMA_current.C_ic = rawephema_data.C_ic;
  RAWEPHEMA_current.omega_0 = rawephema_data.omega_0;
  RAWEPHEMA_current.C_is = rawephema_data.C_is;
  RAWEPHEMA_current.i_0 = rawephema_data.i_0;
  RAWEPHEMA_current.C_rc = rawephema_data.C_rc;
  RAWEPHEMA_current.w = rawephema_data.w;
  RAWEPHEMA_current.omega_dot = rawephema_data.omega_dot;
  RAWEPHEMA_current.IODE_2 = rawephema_data.IODE_2;
  RAWEPHEMA_current.IDOT = rawephema_data.IDOT;
  RAWEPHEMA_current.t_2 = rawephema_data.t_2;
  RAWEPHEMA_current.position_xyz = rawephema_data.position_xyz;
  let id = rawephema_data.sv_id;
  // let obj = {

  // }
  // console.log(object);
  RAWEPHEMA_model.find({ sv_id: id }, (err, docs) => {
    if (err) return next(err);
    if (docs) {
      RAWEPHEMA_model.findOneAndUpdate(
        {
          sv_id: id
        },
        {
          $set: {
            ref_week: rawephema_data.ref_week,
            ref_secs: rawephema_data.ref_secs,
            week_num: rawephema_data.week_num,
            tow: rawephema_data.tow,
            ura: rawephema_data.ura,
            satellite_health: rawephema_data.satellite_health,
            IODC: rawephema_data.IODC,
            tgd: rawephema_data.tgd,
            toc: rawephema_data.toc,
            af_2: rawephema_data.af_2,
            af_1: rawephema_data.af_1,
            af_0: rawephema_data.af_0,
            t_1: rawephema_data.t_1,
            IODE_1: rawephema_data.IODE_1,
            C_rs: rawephema_data.C_rs,
            delta_n: rawephema_data.delta_n,
            M0: rawephema_data.M0,
            C_uc: rawephema_data.C_uc,
            e: rawephema_data.e,
            C_us: rawephema_data.C_us,
            sqrtA: rawephema_data.sqrtA,
            toe: rawephema_data.toe,
            C_ic: rawephema_data.C_ic,
            omega_0: rawephema_data.omega_0,
            C_is: rawephema_data.C_is,
            i_0: rawephema_data.i_0,
            C_rc: rawephema_data.C_rc,
            w: rawephema_data.w,
            omega_dot: rawephema_data.omega_dot,
            IODE_2: rawephema_data.IODE_2,
            IDOT: rawephema_data.IDOT,
            t_2: rawephema_data.t_2,
            position_xyz: rawephema_data.position_xyz
          }
        },
        { upsert: true },
        (err_u, data_u) => {
          if (err_u) throw err_u;
          // console.log("updated");
        }
      );
    } else {
      RAWEPHEMA_current.save((err_s, data_s) => {
        if (err_s) throw err_s;
        // console.log("saved");
      });
    }
  });
};

const WAAS18A_listner = async () => {
  // console.log(cal_data);
  // console.log(geo_data);
  let waas18a_data = await get_waas18a_data(cal_data, geo_data);
  let id = waas18a_data.iodi;
  waas18a_data.timestamp = 0;
  let WAAS18A_current = new WAAS18A_model();
  WAAS18A_current.message_type = "WAAS18A";
  WAAS18A_current.prn = waas18a_data.prn;
  WAAS18A_current.bands = waas18a_data.bands;
  WAAS18A_current.band_num = waas18a_data.band_num;
  WAAS18A_current.mask = waas18a_data.mask;
  WAAS18A_current.binary_mask = waas18a_data.binary_mask;
  WAAS18A_current.iodi = waas18a_data.iodi;
  WAAS18A_current.timestamp = waas18a_data.timestamp;
  WAAS18A_model.find({ iodi: id }, (err, docs) => {
    if (err) return next(err);
    if (docs) {
      WAAS18A_model.findOneAndUpdate(
        {
          iodi: id
        },
        {
          $set: {
            message_type: "WAAS18A",
            prn: waas18a_data.prn,
            bands: waas18a_data.bands,
            band_num: waas18a_data.band_num,
            mask: waas18a_data.mask,
            binary_mask: waas18a_data.binary_mask,
            iodi: waas18a_data.iodi,
            timestamp: waas18a_data.timestamp
          }
        },
        { upsert: true },
        (err_u, data_u) => {
          if (err_u) throw err_u;
          // console.log("updated");
        }
      );
    } else {
      WAAS18A_current.save((err_s, data_s) => {
        if (err_s) throw err_s;
        // console.log("saved");
      });
    }
  });
  set_priority_ionos(id, "WAAS18A");
  active_iodi_row();
};

let WAAS26A_listner = async () => {
  // console.log(cal_data);
  // console.log(geo_data);
  let waas26a_data = await get_waas26a_data(cal_data, geo_data);
  let id = waas26a_data.iodi;
  waas26a_data.timestamp = 0;

  let WAAS26A_current = new WAAS26A_model();
  WAAS26A_current.message_type = "WAAS26A";
  WAAS26A_current.prn = parseInt(cal_data[0]);
  WAAS26A_current.band_num = parseInt(cal_data[1]);
  WAAS26A_current.block_id = parseInt(cal_data[2]);
  WAAS26A_current.num_points = parseInt(cal_data[3]);
  WAAS26A_current.igp_vde = waas26a_data.igp_vde;
  WAAS26A_current.give_i = waas26a_data.give_i;
  WAAS26A_current.iodi = waas26a_data.iodi;
  WAAS26A_current.timestamp = waas26a_data.timestamp;
  WAAS26A_model.find({ iodi: id }, (err, docs) => {
    if (err) return next(err);
    if (docs) {
      WAAS26A_model.findOneAndUpdate(
        {
          iodi: id,
          block_id: WAAS26A_current.block_id
        },
        {
          $set: {
            message_type: "WAAS26A",
            prn: waas26a_data.prn,
            prn: parseInt(cal_data[0]),
            band_num: parseInt(cal_data[1]),
            block_id: parseInt(cal_data[2]),
            num_points: parseInt(cal_data[3]),
            igp_vde: waas26a_data.igp_vde,
            give_i: waas26a_data.give_i,
            iodi: waas26a_data.iodi,
            timestamp: waas26a_data.timestamp
          }
        },
        { upsert: true },
        (err_u, data_u) => {
          if (err_u) throw err_u;
          // console.log("updated");
        }
      );
    } else {
      WAAS26A_current.save((err_s, data_s) => {
        if (err_s) throw err_s;
        // console.log("saved");
      });
    }
  });
  set_priority_ionos(id, "WAAS26A");
  active_iodi_row();
};

// let WAAS3A_listner = () => {};

// let WAAS4A_listner = () => {};

// let WAAS5A_listner = () => {};

// adding event listner
// binding event value to listner
eventEmitter.addListener("AAS1A", WAAS1A_listner);
eventEmitter.addListener("AAS2A", WAASXA_listner);
eventEmitter.addListener("AAS3A", WAASXA_listner);
eventEmitter.addListener("AAS4A", WAASXA_listner);
eventEmitter.addListener("AAS5A", WAASXA_listner);
eventEmitter.addListener("WEPHEMA", RAWEPHEMA_listner);
eventEmitter.addListener("AAS18A", WAAS18A_listner);
eventEmitter.addListener("AAS26A", WAAS26A_listner);

const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

let line_count = 0;
let start_counter = 0;
let buffer_size = 0;
const follow = require("text-file-follower");
// let i = 0;
// let follower = follow("/home/shubham/mpj/SIH-download/routes/gps_data.txt");
// await follower.on("line", (filename, line) => {
//   i++;
// });
// await console.log(i++);
let arr1 = [];
const readLastLines = require("read-last-lines");
const read_file_data = async () => {
  const re = /\#W([^)]+)\*|\#RA([^)]+)\*/;
  readLastLines
    .read("/home/shubham/mpj/SIH-download-1/routes/gagan_data_1.txt", 1000)
    .then(async lines => {
      let arr = lines.split("\n");
      arr1 = arr.map(e => {
        let str = e.replace(
          /[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g,
          ""
        );
        let str_1 = str.match(re);
        // console.log(str_1);
        if (str_1 != null) {
          {
            // console.log(str_1[1]);
            return str_1[1];
          }
        }
      });
      await process_data();
      // console.log(arr1);
    });
};

// read_file_data();
const process_data = () => {
  arr1.forEach(async element => {
    // console.log(element);
    if (element != undefined) {
      console.log(element);
      res_split = element.split(";");
      geo_data = res_split[0].split(",");
      cal_data = res_split[1].split(",");
      message_type_current = geo_data[0];
      await eventEmitter.emit("" + message_type_current);
      // if (
      //   message_type_current === "WAAS18A" ||
      //   message_type_current === "WAAS26A"
      // ) {
      // }
    }
  });
};

module.exports = read_file_data;

// // var stats = readingTime("/home/shubham/mpj/SIH-download/routes/gpsdata.txt");
// // console.log(stats);
// // console.log("read file data");
// line_count = 0;
// let lr = new LineByLineReader(
//   "/home/shubham/mpj/SIH-download/routes/gps_data.txt",
//   {
//     encoding: "utf8",
//     skipEmptyLines: true,
//     start: 0
//   }
// );

// lr.on("line", async function (line) {
//   //   // pause emitting of lines...
//   // console.log(line);

//   // let buff = await new Buffer(line);
//   // buffer_size += parseInt(buff.length);
//   // buffer_size += await parseInt(Buffer.byteLength(line, "utf8"));
//   // console.log(buffer_size);

//   let temp_str = "" + line;
//   let temp_str_1 = temp_str.replace(
//     /[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g,
//     ""
//   );
//   if (temp_str_1 != null || temp_str_1 != "") {
//     const re = /\#W([^)]+)\*|\#RA([^)]+)\*/;
//     let temp_result = temp_str.match(re);
//     if (temp_result != null) {
//       line_count++;
//       // console.log(temp_result);
//     }
//     // temp_res = temp_result[0].slice(1, temp_result[0].length - 1);
//     // console.log(temp_res);
//     // dataGagan += temp_res+"\n";
//     // res_split = temp_res.split(";");
//     // geo_data = res_split[0].split(",");
//     // cal_data = res_split[1] ? res_split[1].split(",") : "";
//     // message_type_current = geo_data[0];
//     // // console.log(message_type_current);
//     // await eventEmitter.emit("" + message_type_current);
//     // if (
//     //   message_type_current === "WAAS18A" ||
//     //   message_type_current === "WAAS26A"
//     // ) {
//     //   //   //   // console.log(message_type_current);
//     // }
//   }
//   lr.pause();
//   // ...do your asynchronous line processing..
//   setTimeout(async function () {
//     // await active_iodp_row();
//     // ...and continue emitting lines.
//     lr.resume();
//   }, 0);
//   //   }
// });

// lr.on("end", function () {
//   console.log(line_count);
//   // console.log("----------");
//   // All lines are read, file is closed now.
// });

// lr.on("error", function (err) {
//   // return next(err);
// });
