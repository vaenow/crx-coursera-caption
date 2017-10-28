var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  context: __dirname,
  devtool: debug ? "inline-sourcemap" : null,
  entry: {
    app: "./js/app.js",
  },
  output: {
    path: __dirname + "/dist",
    filename: "js/[name].min.js"
  },
  plugins: debug ? [
    new CopyWebpackPlugin([
      {from: 'popup.html'},
      {from: 'manifest.json'},
      {from: 'img', to: 'img'},
      {from: 'css', to: 'css'},
      {from: 'js', to: 'js'}
    ], {ignore: [
      'app.js',
      '*.gif',
      '.DS_Store',
    ]}),
    new CleanWebpackPlugin(['dist'])
  ] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ],
};