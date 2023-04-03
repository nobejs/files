const getBase64FileString = requireFunction("getBase64FileString");
const deleteFile = requireFunction("deleteFile");
const findKeysFromRequest = requireUtil("findKeysFromRequest");
const filesRepo = requireRepo("files");
const fileSerializer = requireSerializer("file");
var uuid = require("uuid");
const getCDNConfigs = requireFunction("getCDNConfigs");

const prepare = async ({ req }) => {
  const payload = findKeysFromRequest(req, [
    "file_uuid",
    "file_format",
    "cdn_optimization",
  ]);
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

const respond = async ({ prepareResult, handleResult }) => {
  try {
    const fileObject = await fileSerializer.single(handleResult);
    const fileContentType = fileObject.mime;
    const fileExtension = fileObject.mime && fileObject.mime.split("/").pop();
    const isImageTypeMatched =
      /^image\/(jpg|jpeg|png|gif|bmp|tif|tiff|webp|avif|svg|ico|psd)$/.test(
        fileContentType
      );
    console.log("fileContentType: ", fileContentType);
    console.log("fileExtension: ", fileExtension);
    console.log("isImageTypeMatched: ", isImageTypeMatched);
    if (handleResult.fileFormat === "base64") {
      let fileName = `${
        Date.now() * 1000 + "-" + uuid.v4() + "-" + fileObject.file_name
      }`;

      let downloadUrl = fileObject.download_url;
      let optimizedURLs = {};
      if (fileObject.imgix_url) {
        downloadUrl = `${fileObject.imgix_url}`;
        if (isImageTypeMatched) {
          let cdnOptimization = prepareResult.cdn_optimization;
          const cdnConfigs = await getCDNConfigs({
            cdnOptimizationAttribute: cdnOptimization,
          });
          if (cdnConfigs && cdnConfigs.defaultCdnImageConfig) {
            downloadUrl = `${fileObject.imgix_url}?${cdnConfigs.defaultCdnImageConfig}`;
          }
          if (cdnConfigs && cdnConfigs.validCDNConfigAttributes) {
            cdnConfigs.validCDNConfigAttributes.forEach((attribute) => {
              if (cdnConfigs.validCDNConfigAttributesConfigs) {
                optimizedURLs[
                  `${attribute}`
                ] = `${fileObject.imgix_url}?${cdnConfigs.validCDNConfigAttributesConfigs[attribute]}`;
              }
            });
          }
        }
      }

      const base64String = await getBase64FileString(fileName, downloadUrl);
      deleteFile(`downloadedFiles/${fileName}`);

      return {
        ...fileObject,
        optimizedUrls: { ...optimizedURLs },
        base64String: base64String,
      };
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
