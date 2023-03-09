module.exports = async function () {
  try {
    let defaultCDNImageOptimizationConfigs = process.env.CDN_OPTIMIZATIONS;

    if (
      defaultCDNImageOptimizationConfigs &&
      typeof defaultCDNImageOptimizationConfigs === "string"
    ) {
      defaultCDNImageOptimizationConfigs = JSON.parse(
        defaultCDNImageOptimizationConfigs
      );
      // **Note: thumbnail is the default configuration we are passing to the imgix url
      thumbnailConfig = defaultCDNImageOptimizationConfigs.thumbnail;
    }
    return thumbnailConfig;
  } catch (error) {
    return false;
  }
};
