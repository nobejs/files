module.exports = function (inputString) {
  const nonAlphanumericRegex = /[^a-zA-Z0-9](?=.*\.)/g;
  const alphanumericString = inputString.replace(nonAlphanumericRegex, "");
  return alphanumericString;
};
