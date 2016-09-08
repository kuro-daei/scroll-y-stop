const path = require('path');
const webpack = require('webpack');

const developProduction = new webpack.DefinePlugin({__DEVELOP__: 'true'});

const uglify = new webpack.optimize.UglifyJsPlugin({
  compress: {warnings: false},
  output: {comments: false}
});

var config = {
  entry: {'./demo/index.compiled.js': './demo/index.js'},
  output: {filename: '[name]'},
  devtool: 'source-map',
  plugins: [developProduction],
  module: {}
};

module.exports = config;
