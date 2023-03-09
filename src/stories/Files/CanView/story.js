const getBase64FileString = requireFunction("getBase64FileString");
const deleteFile = requireFunction("deleteFile");
const findKeysFromRequest = requireUtil("findKeysFromRequest");
const filesRepo = requireRepo("files");
const fileSerializer = requireSerializer("file");
var uuid = require("uuid");
const getCDNConfigs = requireFunction("getCDNConfigs");

const prepare = async ({ req }) => {
  const payload = findKeysFromRequest(req, ["file_uuid", "file_format"]);
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
    const respondResult = await filesRepo.first({
      uuid: prepareResult.file_uuid,
    });
    return { ...respondResult, fileFormat: prepareResult.file_format };
  } catch (error) {
    throw error;
  }
};

const respond = async ({ handleResult }) => {
  try {
    const fileObject = await fileSerializer.single(handleResult);
    if (handleResult.fileFormat === "base64") {
      let fileName = `${
        Date.now() * 1000 + "-" + uuid.v4() + "-" + fileObject.file_name
      }`;

      let downloadUrl = fileObject.download_url;
      if (fileObject.imgix_url) {
        downloadUrl = `${fileObject.imgix_url}`;
        const cdnConfigs = await getCDNConfigs();
        if (cdnConfigs) {
          downloadUrl = `${fileObject.imgix_url}?${cdnConfigs}`;
        }
      }

      const base64String = await getBase64FileString(fileName, downloadUrl);
      deleteFile(`downloadedFiles/${fileName}`);
      return { ...fileObject, base64String: base64String };
    }
    return fileObject;
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
