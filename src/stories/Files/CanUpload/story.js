const uploadtoS3 = requireFunction("uploadToS3");
const findKeysFromRequest = requireUtil("findKeysFromRequest");
const pickKeysFromObject = requireUtil("pickKeysFromObject");
var uuid = require("uuid");
const filesRepo = requireRepo("files");
const fileSerializer = requireSerializer("file");

const prepare = async ({ reqQuery, reqBody, reqParams, req }) => {
  const payload = findKeysFromRequest(req, [
    "meta",
    "owner_service",
    "owner_identifier",
  ]);
  // console.log("payload", payload);
  payload.uploadedFile = await req.file();
  // const fileData = await payload.uploadedFile.toBuffer();
  // console.log("uploadedFile", payload.uploadedFile);
  return payload;
};

const authorize = async ({ prepareResult }) => {
  try {
    return true;
  } catch (error) {
    throw error;
  }
};

const handle = async ({ prepareResult, authorizeResult }) => {
  try {
    let fileName = uuid.v4();
    let uploadedFile = prepareResult.uploadedFile;

    let keys = ["owner_service", "owner_identifier", "meta"];
    let fileObject = {};

    try {
      const fileData = await uploadedFile.toBuffer();
      const fieldObjects = pickKeysFromObject(uploadedFile.fields, keys);

      for (let index = 0; index < keys.length; index++) {
        const element = keys[index];
        if (fieldObjects[element]) {
          if (element === "meta") {
            fileObject[element] = JSON.parse(fieldObjects[element]["value"]);
          } else {
            fileObject[element] = fieldObjects[element]["value"];
          }
        }
      }

      let result = await uploadtoS3(fileData, uploadedFile.mimetype, fileName);
      let file = await filesRepo.create({
        file_name: uploadedFile.filename,
        mime: uploadedFile.mimetype,
        path_to_file: result["Location"],
        ...fileObject,
      });
      return file;
    } catch (err) {
      throw err;
    }

    return {};
  } catch (error) {
    throw error;
  }
};

const respond = async ({ handleResult }) => {
  try {
    return await fileSerializer.single(handleResult);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  prepare,
  authorize,
  handle,
  respond,
};
