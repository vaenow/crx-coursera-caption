var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  context: __dirname,
  devtool: debug ? "inline-sourcemap" : null,
  entry: {
    app: "./js/app.js",
    contentScript: "./js/contentscript.js",
  },
  output: {
    path: __dirname + "/dist",
    filename: "js/[name].min.js"
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: ['node_modules'],
      loader: 'babel-loader',
      query: {
        babelrc: false,
        presets: [
          ['es2015', {
            modules: false
          }]
        ],
      },
    }],
  },
  plugins: debug ? [
    new CopyWebpackPlugin([
      {from: 'index.html'},
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