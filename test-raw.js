// const get_binary_for_hex_char = hex_code_char => {
//   let binary = parseInt(hex_code_char, 16).toString(2);
//   let temp = "";
//   length = binary.length;
//   for (var i = 0; i < 4 - length; i++) {
//     temp += "0";
//   }
//   return temp + binary;
// };
// let subframe_binary_code;
// const get_rawephema_data = sub1 => {
//   let binary_data = "";
//   //   var hex_code = cal_data[3] + cal_data[4] + cal_data[5];
//   sub = ["" + sub1];
//   //   console.log(hex_code);

//   subframe_binary_code = sub.reduce((sum, char) => {
//     let binary_char_code = get_binary_for_hex_char(char);
//     return sum + "" + binary_char_code;
//   }, "");
// };

// let sub1 = "8b0fdc545f2cff72308edc10fff42720ce8d1d9eb0931bf5ffa5d6681844";

// get_rawephema_data(sub1);
// console.log(subframe_binary_code);

// let bin =
//   "100010110000111111011100010101000101111000100100111111011101000000000000010001110000010001001010100100101010110000010111011010001111001111101101011010011100110011101011011010000011111101001000000000000000000000000110111100111111001101101011100010110000111111011100010101000101111010101001011010000000010001010101001100110101110000110011101101111000000111000100000000111100101100000101001011010011001110100101000011110101110110100001000011010101011010011100001111110100100001111100100010110000111111011100010101000101111100101100111111110111001000110000100011101101110000010000111111111111010000100111001000001100111010001101000111011001111010110000100100110001101111110101111111111010010111010110011010000001100001000100";
// console.log(bin[240]);
const LineByLineReader = require("line-by-line");
let res_split;
let geo_data;
let cal_data;

const read_file_data = () => {
  console.log("read file data");
  line_count = 0;
  let lr = new LineByLineReader("/home/shubham/mpj/SIH/routes/gagan_data.txt", {
    encoding: "utf8",
    skipEmptyLines: false,
    start: 0
  });

  lr.on("line", async function(line) {
    //   // pause emitting of lines...
    //   // console.log(line);

    line_count++;
    // let buff = await new Buffer(line);
    // buffer_size += parseInt(buff.length);
    // buffer_size += await parseInt(Buffer.byteLength(line, "utf8"));
    // console.log(buffer_size);

    let temp_str = "" + line;
    temp_str = temp_str.replace(
      /[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g,
      ""
    );
    const re = /\#W([^)]+)\*|\#RA([^)]+)\*/;
    let temp_result = temp_str.match(re);
    if (temp_result != null) {
      // temp_res = temp_result[0].slice(1, temp_result[0].length - 1);
      // res_split = temp_res.split(";");
      // geo_data = res_split[0].split(",");
      // cal_data = res_split[1] ? res_split[1].split(",") : "";
    }
    lr.pause();
    // ...do your asynchronous line processing..
    setTimeout(async function() {
      // ...and continue emitting lines.
      lr.resume();
    }, 1000);
    //   }
  });

  lr.on("end", function() {
    // console.log(line_count);
    // console.log("----------");
    // All lines are read, file is closed now.
  });

  lr.on("error", function(err) {
    return next(err);
  });
};
