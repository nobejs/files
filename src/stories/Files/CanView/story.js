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
