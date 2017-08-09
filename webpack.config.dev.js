const path = require('path');
const webpack = require('webpack');

module.exports = {
  target: 'electron-renderer',
  entry: {
    index: './src/index.tsx'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),

    // This is necessary for HMR in Electron. Also the `publicPath` in `devServer`
    // doesn't work. If we dont specify this or use '/' it will result in urls
    // referencing to the file System!
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
        use: ['style-loader', 'css-loader', 'webfonts-loader']
      },

      // Typescript
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: ['ts-loader']
      },

      // SCSS
      {
        test: /\.s?css$/,

        // Only exclude node_modules if you are NOT referencing any s?css file
        // inside it in your project
        // exclude: /node_modules/,

        use: ['style-loader', 'css-loader', 'sass-loader']
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
