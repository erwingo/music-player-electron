const path = require('path');
const webpack = require('webpack');

module.exports = {
  target: 'electron',
  entry: {
    index: './src/index.tsx',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),

    // This is necessary for HMR in Electron, the one inside devServer: doesn't work
    // using '/' will result in urls using the file System!
    publicPath: 'http://localhost:8080/'
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx']
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      // SVG Fonts
      {
        test: /\/_fonts\/.*\/font\.js$/,
        use: [
          'style-loader',
          'css-loader',
          'webfonts-loader'
        ]
      },

      // Typescript
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          'ts-loader'
        ]
      },

      // SCSS
      {
        test: /\.s?css$/,
        // exclude: /node_modules/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],

  // webpack-dev-server
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    hot: true
  }
};
