const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
require('dotenv').config(); // optional: loads .env file if present

module.exports = {
  entry: './src/index.jsx', // main entry file
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true, // clears dist folder on each build
  },
  mode: process.env.NODE_ENV || 'development',
  module: {
    rules: [
      {
        test: /\.jsx?$/, // handle .js and .jsx files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react'
            ]
          }
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'], // handle CSS imports
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i, // handle images
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], // allow imports without extensions
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new webpack.DefinePlugin({
      // Define environment variables for use in the browser
      'process.env': JSON.stringify({
        NODE_ENV: process.env.NODE_ENV || 'development',
        API_URL: process.env.API_URL || 'http://localhost:5000',
      }),
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 3000,
    open: true,
    hot: true,
    historyApiFallback: true, // enables React Router support
  },
  devtool: 'source-map', // helpful for debugging
};
