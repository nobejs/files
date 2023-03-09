module.exports = async function ({ cdnOptimizationAttribute = "thumbnail" }) {
  try {
    let defaultCDNImageOptimizationConfigs = process.env.CDN_OPTIMIZATIONS;

    if (
      defaultCDNImageOptimizationConfigs &&
      typeof defaultCDNImageOptimizationConfigs === "string"
    ) {
      defaultCDNImageOptimizationConfigs = JSON.parse(
        defaultCDNImageOptimizationConfigs
      );

      const validCDNConfigAttributes = ["thumbnail", "reduced_quality"];

      if (cdnOptimizationAttribute) {
        const cdnImageOptimizationAttributeValue =
          validCDNConfigAttributes.find((validCDNConfigAttribute) => {
            return validCDNConfigAttribute === cdnOptimizationAttribute;
          });

        if (cdnImageOptimizationAttributeValue) {
          // **Note: thumbnail is the default configuration we are passing to the imgix url
          defaultCdnImageConfig =
            defaultCDNImageOptimizationConfigs[
              `${cdnImageOptimizationAttributeValue}`
            ];
        }
      }
    }
    return defaultCdnImageConfig;
  } catch (error) {
    return false;
  }
};
