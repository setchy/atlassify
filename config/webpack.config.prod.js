const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.config.common');
const webpack = require('webpack');

/**
 * @type {webpack.Configuration}
 */
const configuration = {
  devtool: 'source-map',

  mode: 'production',
};

module.exports = merge(commonConfig, configuration);
