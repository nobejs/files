const AWS = require("aws-sdk");
const s3 = new AWS.S3({ region: "ap-south-1", signatureVersion: "v4" });

module.exports = function (fileData, mimeType, path, hasPublicAccess = false) {
  let params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: path,
    Body: fileData,
    ContentType: mimeType,
  };

  if (hasPublicAccess) {
    params.ACL = "public-read";
  }

  //   console.log("uploadtoS3", params);

  return s3
    .upload(params)
    .promise()
    .then((r) => {
      return r;
    })
    .catch((error) => {
      console.log("error", error);
      throw new Error(
        JSON.stringify({
          message: error.message,
          code: error.code,
        })
      );
    });
};
