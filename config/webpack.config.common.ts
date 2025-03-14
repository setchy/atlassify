import type webpack from 'webpack';

import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

const configuration: webpack.Configuration = {
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [new TsconfigPathsPlugin()],
  },

  node: {
    __dirname: false,
    __filename: false,
  },
};

export default configuration;
