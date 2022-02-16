const path = require("path");
module.exports = {
  i18n: {
    locales: ["en-US", "de", "es-ES", "ar", "he", "zh"],
    defaultLocale: "en-US",
    localeDetection: false,
  },
  localePath: path.resolve("./public/locales"),
};
