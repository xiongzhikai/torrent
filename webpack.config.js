var path = require('path');
var webpack = require('webpack');
module.exports = {
  entry: ['webpack-hot-middleware/client', path.resolve(__dirname, './js/index.js')],
  output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
      publicPath: '/dist/'
  },
  resolve: {
      modules: ['node_modules', path.join(__dirname, '../node_modules')],
      extensions: ['.js', '.web.js', '.json'],
  },
  node: {
    fs: 'empty'
  },
  module: {
      loaders: [{
          test: /\.js$/,
          loaders: ['babel-loader'],
          exclude: /node_modules/,
          include: __dirname
      }]
  },
  plugins: [
  	new webpack.optimize.OccurrenceOrderPlugin(),
  	new webpack.HotModuleReplacementPlugin()
  ]
}