var fs = require("fs");
var axios = require("axios");

module.exports = async (fileName, downloadUrl) => {
  return new Promise(async (resolve, reject) => {
    try {
      const dir = "./downloadedFiles";
      const destination = `downloadedFiles/${fileName}`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }

      const response = await axios({
        url: downloadUrl,
        method: "GET",
        responseType: "stream",
      });

      const file = fs.createWriteStream(destination);

      response.data.pipe(file);

      file.on("finish", function () {
        file.close();
        const base64String = fs.readFileSync(`${destination}`, {
          encoding: "base64",
        });

        resolve(base64String);
      });

      file.on("error", function () {
        console.log("ERROR");
        file.close();
        reject(error); // delete file here?
      });
    } catch (error) {
      reject(error);
    }
  });
};
