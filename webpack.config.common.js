const fs = require('fs');
const path = require('path');

exports.entry = {
  index: './src/app/index.tsx'
};

exports.output = {
  filename: '[name].bundle.js',

  // Adapt the file to a commonJS (node) environment.
  // Since we are in a nodejs/browser environment provided by electron,
  // calls like require('xxx') will work.
  // https://webpack.js.org/configuration/output/#output-librarytarget
  // https://github.com/webpack/webpack/issues/1114
  libraryTarget: 'commonjs2'
};

exports.resolve = {
  extensions: ['.js', '.ts', '.tsx']
};

exports.module = {
  rules: [
    {
      test: /\/_fonts\/.*\/font\.js$/,
      use: ['style-loader', 'css-loader', 'webfonts-loader']
    },
    {
      test: /\.tsx?$/,
      include: path.resolve(__dirname, 'src'),
      use: ['ts-loader']
    },
    {
      test: /\.s?css$/,
      use: ['style-loader', 'css-loader', 'sass-loader']
    }
  ]
};

// Ignore all node_modules
// Some modules are in es6 and won't be able to be parsed
// by webpack production optimizations (uglifyJS), so we
// ignore all of the node_modules.
exports.externals = fs.readdirSync('node_modules');
