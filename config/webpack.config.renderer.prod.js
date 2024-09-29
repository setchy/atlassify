const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.config.renderer.base');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

/**
 * @type {webpack.Configuration}
 */
const configuration = {
  devtool: 'source-map',

  mode: 'production',

  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};

module.exports = merge(baseConfig, configuration);
