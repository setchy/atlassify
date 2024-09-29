import path from 'node:path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import type webpack from 'webpack';
import { merge } from 'webpack-merge';
import baseConfig from './webpack.config.common';
import webpackPaths from './webpack.paths';

const configuration: webpack.Configuration = {
  devtool: 'inline-source-map',

  mode: 'development',

  target: 'electron-renderer',

  entry: [path.join(webpackPaths.srcRendererPath, 'index.tsx')],

  output: {
    path: webpackPaths.buildPath,
    filename: 'renderer.js',
    library: {
      type: 'umd',
    },
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: path.join('index.html'),
      template: path.join(webpackPaths.srcRendererPath, 'index.ejs'),
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
      },
      isBrowser: false,
    }),
  ],
};

export default merge(baseConfig, configuration);
