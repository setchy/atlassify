const path = require('node:path');
const webpack = require('webpack');
const webpackPaths = require('./webpack.paths');

/**
 * @type {webpack.Configuration}
 */
const configuration = {
  devtool: 'inline-source-map',

  mode: 'development',

  target: 'electron-renderer',

  entry: [path.join(webpackPaths.srcRendererPath, 'index.tsx')],

  output: {
    path: webpackPaths.buildRendererPath,
    filename: 'renderer.js',
  },

  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },

  plugins: [],

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },

  node: {
    __dirname: false,
    __filename: false,
  },
};

module.exports = configuration;
