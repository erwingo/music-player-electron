const path = require('path');
const webpack = require('webpack');
const commonConfig = require('./webpack.config.common');

module.exports = {
  target: 'electron-renderer',
  entry: commonConfig.entry,
  output: Object.assign(commonConfig.output, {
    // This is necessary for HMR in Electron. Also the `publicPath` in `devServer`
    // doesn't work. If we dont specify this or use '/' it will result in urls
    // referencing to the file System!
    publicPath: 'http://localhost:8080/'
  }),
  devtool: 'inline-source-map',
  resolve: commonConfig.resolve,
  module: commonConfig.module,
  externals: commonConfig.externals,
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  // externals: ['classnames', 'fs-extra', 'dot-prop', 'react', 'react-dom', 'lodash', 'react-input-range'],
  // externals: ['react'],
  // externals: {
  //   react: {
  //     commonjs: "React",
  //     commonjs2: "React",
  //     amd: "React",
  //     root: "_"
  //   }
  // },


  // webpack-dev-server
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    hot: true
  }
};
