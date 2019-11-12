// let text_version = require("textversionjs");
// var request = require("request");
// var cheerio = require("cheerio");
// ���k��V�A�HF =��?n��V��; @Z��=B��F��

// buf = Buffer.from(
//   "#WAAS2A,COM1,0,38.5,SATTIME,2039,259572.000,00a00000,e194,7103;123,2,0,-11,0,0,0,0,-10,-3,0,-13,-12,0,5,5,5,14,14,14,14,5,5,14,5,6,14,5,8*e6859936"
// );
var fs = require("fs");
// var lineReader = require("line-reader");
// var readStream = fs.createReadStream(
//   "/home/shubham/mpj/SIH/routes/test1_data.txt",
//   { start: 1, end: 7 }
// );
// lineReader.eachLine(readStream, function(line, last) {
//   console.log(line);
// });

// var reader = new FileReader();
// var fileByteArray = [];
// reader.readAsArrayBuffer(myFile);
// reader.onloadend = function(evt) {
//   if (evt.target.readyState == FileReader.DONE) {
//     var arrayBuffer = evt.target.result,
//       array = new Uint8Array(arrayBuffer);
//     for (var i = 0; i < array.length; i++) {
//       fileByteArray.push(array[i]);
//     }
//   }
// };
// for (x of buf.values()) {
//   console.log(x);
// }
// console.log(buf.length);
// let buffer_size = Buffer.byteLength("", "utf8");
// console.log(buffer_size);
// lineReader.eachLine(
//   "/home/shubham/mpj/SIH/routes/gagan_data.txt",
//   { encoding: "utf8" },
//   function(line, last) {
//     // console.log(line);
//     counter++;

//     if (last) {
//       console.log(`counter val -> ${counter}`); // stop reading
//     }
//   }
// ); // request(
//   {
//     uri: "https://sih.isro.gov.in/samples/P2/214_19FEB23_000002.GPS"
//   },
//   function(error, response, body) {
//     var $ = cheerio.load(body);

//     // $("div").each(function() {
//     //   var link = $(this);
//     //   var text = link.text();
//     //   //   var href = link.attr("href");

//     //   console.log(text);
//     // });
//     let z = $("body");
//     let y = z.text();
//     // let x = y.replace(/\s/g, " ");
//     console.log(y);
//   }
// );
// #WAAS25A, COM1, 0, 40.0, SATTIME, 2041, 543301.000, 00a00000, b8ff, 7103; 128, 1, 14, 33, -25, -1, 17, 12, 0, 0, -1, -3, -1, -2, 1546, 3, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 * 9825c7a6
// request.get(
//   "https://stackoverflow.com/questions/14552638/read-remote-file-with-node-js-http-get",
//   function(error, response, body) {
//     if (!error && response.statusCode == 200) {
//       var csv = body;
//       let text = text_version(csv);
//       console.log(text);
//       // Continue with your processing here.
//     }
//   }
// );
// const fetch = require("node-fetch");

// fetch(
//   "https://stackoverflow.com/questions/14552638/read-remote-file-with-node-js-http-get"
// )
//   .then(res => res.text())
//   .then(body => console.log(body));
// const fs = require("fs");
// fetch(
//   "https://stackoverflow.com/questions/14552638/read-remote-file-with-node-js-http-get"
// )
//   .then(res => {
//     let res_body = res.body;
//     const dest = fs.createWriteStream("test_file.txt");
//     res.body.pipe(dest);

//     return res.text();
//   })
//   .then(body => {
//     var rex = /(<([^>]+)>)/gi;
//     let final = body.replace(rex, "");
//     let z = final.replace(/\s/g, "");

//     console.log(z);
//   });

// let http = require("https");
// http.get(
//   "https://stackoverflow.com/questions/14552638/read-remote-file-with-node-js-http-get",
//   function(res) {
//     res.setEncoding("utf8");
//     res.on("data", function(chunk) {
//       console.log(chunk);
//     });
//   }
// );
