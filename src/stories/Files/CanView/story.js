const getBase64FileString = require("../../../functions/getBase64FileString");
const decodeBase64FileString = require("../../../functions/decodeBase64FileString");
const findKeysFromRequest = requireUtil("findKeysFromRequest");
const filesRepo = requireRepo("files");
const fileSerializer = requireSerializer("file");

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
    let fileName = fileObject.file_name;
    let downloadUrl = fileObject.download_url;
    const base64String = await getBase64FileString(fileName, downloadUrl);
    await decodeBase64FileString(fileName, base64String);
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
