import type webpack from 'webpack';

const configuration: webpack.Configuration = {
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

export default configuration;
