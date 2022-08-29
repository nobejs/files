const fs = require("fs");

module.exports = function (fileName) {
  fs.stat(`${fileName}`, function (err) {
    if (err) {
      return console.error(err);
    }

    fs.unlink(`${fileName}`, function (err) {
      if (err) return console.log(err);
      console.log("file deleted successfully");
    });
  });
};
