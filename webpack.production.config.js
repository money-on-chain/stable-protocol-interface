const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const webpack = require('webpack'); //to access built-in plugins

module.exports = {
  entry: './src/index.js',
  plugins: [
    new HtmlWebpackPlugin()
  ]
};
