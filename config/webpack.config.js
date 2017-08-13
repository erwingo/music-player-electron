const path = require('path');
const fs = require('fs-extra');
// eslint-disable-next-line
const webpack = require('webpack');
// eslint-disable-next-line
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StringReplacer = require('./webpackPlugins/StringReplacer');

const isProduction = process.env.NODE_ENV === 'production';
const devPort = process.env.PORT || 8080;
const outputPath = path.resolve(__dirname, '../dist');
const publicPath = isProduction ? outputPath : '';

const output = {
  // Adapt the file to a commonJS (node) environment.
  // Since we are in a nodejs/browser environment provided by electron,
  // calls like require('xxx') will work.
  // https://webpack.js.org/configuration/output/#output-librarytarget
  // https://github.com/webpack/webpack/issues/1114
  libraryTarget: 'commonjs2',

  // The output directory as an absolute path.
  path: outputPath
};

const rules = [{
  test: /\.tsx?$/,
  include: path.resolve(__dirname, '../src/renderer'),
  use: ['ts-loader']
}];

const plugins = [
  new StringReplacer({
    input: path.resolve(__dirname, '../src/main/mainWindow/index.html'),
    output: 'index.html',
    replacements: [
      { pattern: new RegExp('#{PUBLIC_PATH}', 'g'), replacement: publicPath }
    ]
  }),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  })
];

if (isProduction) {
  // chunkhash is the chunk's checksum, useful for caching purposes
  output.filename = '[name].bundle.[chunkhash].js';

  // Base Absolute path for all the assets required inside the source code.
  // For example, if you have a .css file that has something like
  // background-image: url('a.png') <<NOTE: no absolute path>> and
  // your public path is set to http://cdn.example.com, the bundled,
  // file will have background-image: url(http://cdn.example.com/a.png).
  // Also works for file paths
  output.publicPath = publicPath;

  rules.push(
    {
      test: /\/_fonts\/.*\/font\.js$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'webfonts-loader']
      })
    },
    {
      test: /\.s?css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'sass-loader']
      })
    }
  );

  // contentash is the file's checksum, useful for caching purposes
  plugins.unshift(new ExtractTextPlugin('[name].[contenthash].css'));
  // TODO: Uglifier
  // plugins.push(uglifier);
} else {
  output.filename = '[name].bundle.js';
  output.publicPath = `http://localhost:${devPort}/`;

  rules.push(
    {
      test: /\/_fonts\/.*\/font\.js$/,
      use: ['style-loader', 'css-loader', 'webfonts-loader']
    },
    {
      test: /\.s?css$/,
      use: ['style-loader', 'css-loader', 'sass-loader']
    }
  );

  plugins.unshift(new webpack.HotModuleReplacementPlugin());
}

module.exports = {
  target: 'electron-renderer',
  entry: {
    index: path.resolve(__dirname, '../src/renderer/index.tsx')
  },
  output,
  devtool: isProduction ? 'source-map' : 'inline-source-map',
  resolve: { extensions: ['.js', '.ts', '.tsx'] },
  module: { rules },
  plugins,

  // Ignore all node_modules, since they are going to be
  // in node_modules directory in production, so we avoid
  // duplication
  externals: fs.readdirSync('node_modules'),

  // webpack-dev-server
  // Only used with webpack-dev-server
  devServer: {
    hotOnly: true,
    // TODO: What does this do
    contentBase: path.join(__dirname, 'dist')
  }
};
