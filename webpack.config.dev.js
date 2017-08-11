const path = require('path');
const webpack = require('webpack');
const commonConfig = require('./webpack.config.common');

const port = process.env.PORT || 8080;

module.exports = {
  target: 'electron-renderer',
  entry: commonConfig.entry,
  output: Object.assign(commonConfig.output, {
    // This is necessary for HMR in Electron. Also the `publicPath` in `devServer`
    // doesn't work. If we dont specify this or use '/' it will result in urls
    // referencing to the file System!
    // TODO: Port should be configurable
    publicPath: `http://localhost:${port}/`
  }),
  devtool: 'inline-source-map',
  resolve: commonConfig.resolve,
  module: commonConfig.module,
  externals: commonConfig.externals,
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],

  // webpack-dev-server
  devServer: {
    hotOnly: true,
    contentBase: path.join(__dirname, 'dist')
  }
};
