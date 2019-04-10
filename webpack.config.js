const path = require("path")
const config = require("./package.json")
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/js/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  optimization: {
    minimizer: [new UglifyJsPlugin({
        sourceMap: true
    })],
  },
  devServer: {
    compress: true,
    port: 8080
  },
  plugins: []
};