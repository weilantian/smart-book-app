const withPWA = require("next-pwa")({
  dest: "public",
});

module.exports = withPWA({
  reactStrictMode: true,
  transpilePackages: [
    "ui",
    "@douyinfe/semi-ui",
    "@douyinfe/semi-icons",
    "@douyinfe/semi-illustrations",
  ],
});
