const { i18n } = require("./next-i18next.config");
const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");
module.exports = withPWA({
  pwa: {
    disable: process.env.NODE_ENV !== "production",
    dest: "public",
    runtimeCaching,
    buildExcludes: [/middleware-manifest\.json$/],
  },
  images: {
    domains: ["images.contentstack.io"],
  },
  i18n,
  typescript: {
    ignoreBuildErrors: true,
  },
});
