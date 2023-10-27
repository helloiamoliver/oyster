const eleventySass = require("@11tyrocks/eleventy-plugin-sass-lightningcss");
const browserSyncConfig = require('./src/_11ty/utils/browser-sync-config');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventySass);
  eleventyConfig.setBrowserSyncConfig(browserSyncConfig);

  return {
    dir: {
      input: "src",
      output: "public",
    },
  };
};
