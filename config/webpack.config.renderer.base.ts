import path from 'node:path';
import { CompiledExtractPlugin } from '@compiled/webpack-loader';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import type webpack from 'webpack';
import { merge } from 'webpack-merge';
import baseConfig from './webpack.config.common';
import webpackPaths from './webpack.paths';

import { ALL_EMOJI_SVG_FILENAMES } from '../src/renderer/utils/emojis';

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

  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: [
          { loader: 'babel-loader' },
          {
            // ↓↓ Compiled should run last ↓↓
            loader: '@compiled/webpack-loader',
            options: {
              transformerBabelPlugins: ['@atlaskit/tokens/babel-plugin'],
              extract: true,
              inlineCss: true,
            },
          },
        ],
      },
      {
        test: /compiled-css\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /(?<!compiled-css)(?<!\.compiled)\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // Extract CSS into a separate file
          'css-loader', // Translates CSS into CommonJS
          'postcss-loader', // Automatically uses the postcss.config.js file
        ],
      },
    ],
  },

  plugins: [
    // Extract CSS into a separate file
    new MiniCssExtractPlugin({
      filename: 'styles.css', // Output file for the CSS
    }),

    new CompiledExtractPlugin({ sortShorthand: true }),

    // Generate HTML file with script and link tags injected
    new HtmlWebpackPlugin({
      filename: path.join('index.html'),
      template: path.join(webpackPaths.srcRendererPath, 'index.html'),
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
      },
      isBrowser: false,
    }),

    // Twemoji SVGs for Emoji parsing
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(
            webpackPaths.nodeModulesPath,
            '@discordapp/twemoji',
            'dist',
            'svg',
          ),
          to: 'images/twemoji',
          // Only copy the SVGs for the emojis we use
          filter: (resourcePath) => {
            return ALL_EMOJI_SVG_FILENAMES.some((filename) =>
              resourcePath.endsWith(`/${filename}`),
            );
          },
        },
      ],
    }),
  ],
};

export default merge(baseConfig, configuration);
