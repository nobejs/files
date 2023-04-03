module.exports = async function ({ cdnOptimizationAttribute = "thumbnail" }) {
  try {
    const validCDNConfigAttributes = ["thumbnail", "reduced_quality"];
    let validCDNConfigAttributesConfigs = {};
    let defaultCDNImageOptimizationConfigs = process.env.CDN_OPTIMIZATIONS;
    let defaultCdnImageConfig = null;
    if (
      defaultCDNImageOptimizationConfigs &&
      typeof defaultCDNImageOptimizationConfigs === "string"
    ) {
      defaultCDNImageOptimizationConfigs = JSON.parse(
        defaultCDNImageOptimizationConfigs
      );

      if (cdnOptimizationAttribute) {
        const cdnImageOptimizationAttributeValue =
          validCDNConfigAttributes.find((validCDNConfigAttribute) => {
            return validCDNConfigAttribute === cdnOptimizationAttribute;
          });

        validCDNConfigAttributes.forEach((validCDNConfigAttribute) => {
          const configValue =
            defaultCDNImageOptimizationConfigs[`${validCDNConfigAttribute}`];
          validCDNConfigAttributesConfigs = {
            ...validCDNConfigAttributesConfigs,
            [`${validCDNConfigAttribute}`]: configValue,
          };
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

    return {
      defaultCdnImageConfig: defaultCdnImageConfig,
      validCDNConfigAttributes: validCDNConfigAttributes,
      validCDNConfigAttributesConfigs: validCDNConfigAttributesConfigs,
    };
  } catch (error) {
    console.log("error: ", error);
    return false;
  }
};
