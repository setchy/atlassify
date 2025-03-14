import type webpack from 'webpack';

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
    extensions: ['.js', '.ts', '.tsx'],
  },

  node: {
    __dirname: false,
    __filename: false,
  },
};

export default configuration;
