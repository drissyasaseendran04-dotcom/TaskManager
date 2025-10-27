const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  entry: './src/index.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),

    // Load .env automatically
    new Dotenv(),

    // Custom API base depending on environment
    new webpack.DefinePlugin({
      'process.env.REACT_APP_API_BASE': JSON.stringify(
        isProd
          ? process.env.REACT_APP_API_BASE_PROD
          : process.env.REACT_APP_API_BASE_DEV
      ),
    }),
  ],
  mode: isProd ? 'production' : 'development',
  devServer: {
    port: 3000,
    historyApiFallback: true,
  },
};
