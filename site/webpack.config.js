const path = require("path"),
config = require("./package.json"),
UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/js/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  optimization: {
    minimizer: [new UglifyJsPlugin({
        sourceMap: true
    })],
  },
  devServer: {
    contentBase: '.',
    compress: true,
    host: 'localhost',
    port: 8080
  },
  plugins: []
};