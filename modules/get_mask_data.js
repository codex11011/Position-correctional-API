// returns an array of 32 integers specifying
// data availability from different satellites

const WAAS1A_model = require("../models/waas1a_format");
const WAASXA_model = require("../models/waasxa_format");

const get_waas1a_mask_data = mask => {
  // var x = "efffffff0000000000000000000000200100000000000000000000";
  var hex_code = mask.slice(0, 8);
  var hex_code_char = hex_code.split("");
  var length = 0;
  var binary_arr = hex_code_char.map(function(e) {
    var str = parseInt(e, 16).toString(2);
    var temp = "";
    length = str.length;
    for (var i = 0; i < 4 - length; i++) {
      temp += "0";
    }
    return temp + str;
  });
  // console.log(binary_arr);
  var mask_data = [];
  binary_arr.map(e => {
    temp = e.split("");
    temp.map(el => {
      mask_data.push(parseInt(el));
    });
  });
  return mask_data;
};
module.exports = get_mask_data;
