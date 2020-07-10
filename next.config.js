const css = require('@zeit/next-css');
const sass = require('@zeit/next-sass');
const images = require('next-images');
const withPlugins = require('next-compose-plugins');
const fonts = require('next-fonts');

const imageConfig = {
  webpack: (config, options) => {
    config.module.rules.push({
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use: ['url-loader']
      });
    return config;
  }
};

const sassConfig = {
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: "[local]___[hash:base64:5]",
  }
}

module.exports = withPlugins([
  css,
  [sass, sassConfig],
  [images, imageConfig],
  [fonts, imageConfig]
]);