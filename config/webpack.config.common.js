const webpack = require('webpack');

/**
 * @type {webpack.Configuration}
 */
const configuration = {
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
