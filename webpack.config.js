const path = require('path');
const webpack = require('webpack');

const defineProduction = new webpack.DefinePlugin({__PRODUCTION__: 'true'});

const uglify = new webpack.optimize.UglifyJsPlugin({
  compress: {warnings: false},
  output: {comments: false}
});

const babel = {
  test: /scroll-y-stop\.js$/,
  include: [path.resolve(__dirname, 'src')],
  loader: 'babel-loader',
  query: {presets: ['es2015']}
};

var configs = {
  "production": {
    entry: {"lib/scroll-y-stop.js": './src/scroll-y-stop.js'},
    output: { filename: "[name]" },
    plugins: [ uglify, defineProduction ],
    module: { loaders: [ babel ] },
  },
  "develop":{
    entry: {"demo/scroll-y-stop.js": './src/index.js'},
    output: { filename: "[name]" },
    devtool: 'source-map',
    plugins: [ ],
    module: { loaders: [ babel ] },
  }
};

var env = process.env.NODE_ENV || 'develop';
console.log('build env:' + env);

module.exports = configs[env];
