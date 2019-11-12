const cheerio = require("cheerio");
const request = require("request");
const download = require("download-file");
const base_url = "https://sih.isro.gov.in/samples/P2/";
const read_file_data = require("./read_file");
let extracted_link = "";
const download_gps_correctional_data = () => {
  let options = {
    directory: "/home/shubham/mpj/SIH-download-1/routes/",
    filename: "gagan_data_1.txt"
  };

  request(base_url, (err, resp, body) => {
    if (err) console.log(err);
    $ = cheerio.load(body);
    links = $("a");
    extracted_link = links["6"].attribs.href;
    url = "https://sih.isro.gov.in" + extracted_link;
    // console.log(url);
    download(url, options, async function(err) {
      if (err) throw err;
      await console.log("Downloaded");
      await read_file_data();
      // await console.log("data read");
    });
  });
};

module.exports = download_gps_correctional_data;
