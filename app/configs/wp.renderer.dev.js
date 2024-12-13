const path = require('path');
const webpack = require('webpack');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const merge = require('webpack-merge');
const base = require('./wp.renderer.base');

module.exports = merge.smart(base, {
  mode: 'development',
  entry: './client/index.js',
  target: 'electron-renderer',
  output: {
    path: path.join(process.cwd(), 'build'),
    publicPath: '/',
    filename: 'renderer-bundle.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin({
      multiStep: true
    }),
    new ErrorOverlayPlugin()
  ],
  optimization: {
    moduleIds: 'named'
  },
  devtool: 'cheap-module-source-map',
  devServer: {
    port: 1666,
    static: './',
    hot: true,
    historyApiFallback: true
  }
});
