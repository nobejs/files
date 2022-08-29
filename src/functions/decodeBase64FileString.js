var fs = require("fs");

module.exports = async (fileName, base64String) => {
  return new Promise(async (resolve, reject) => {
    try {
      const dir = "./base64DecodedFiles";
      const destination = `base64DecodedFiles/${fileName}`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      fs.writeFile(`${destination}`, base64String, "base64", function (err) {
        console.log(err);
        reject(err);
      });
      resolve("done");
    } catch (error) {
      reject(error);
    }
  });
};
