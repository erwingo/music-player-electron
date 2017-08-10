const path = require('path');
const commonConfig = require('./webpack.config.common');

module.exports = {
  target: 'electron-renderer',
  entry: commonConfig.entry,
  output: Object.assign(commonConfig.output, {
    path: path.resolve(__dirname, 'dist')
  }),
  devtool: 'source-map',
  resolve: commonConfig.resolve,
  module: commonConfig.module,
  externals: commonConfig.externals
};
