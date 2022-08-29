const getBase64FileString = requireFunction("getBase64FileString");
const deleteFile = requireFunction("deleteFile");
const findKeysFromRequest = requireUtil("findKeysFromRequest");
const filesRepo = requireRepo("files");
const fileSerializer = requireSerializer("file");
var uuid = require("uuid");

const prepare = async ({ req }) => {
  const payload = findKeysFromRequest(req, ["file_uuid"]);
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
    return await filesRepo.first({ uuid: prepareResult.file_uuid });
  } catch (error) {
    throw error;
  }
};

const respond = async ({ handleResult }) => {
  try {
    const fileObject = await fileSerializer.single(handleResult);
    let fileName = uuid.v4().concat(fileObject.file_name);
    let downloadUrl = fileObject.download_url;
    const base64String = await getBase64FileString(fileName, downloadUrl);
    deleteFile(`downloadedFiles/${fileName}`);
    return { ...fileObject, base64String: base64String };
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
