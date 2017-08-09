const path = require('path');

module.exports = {
  target: 'electron-renderer',
  entry: {
    index: './src/index.tsx'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx']
  },
  devtool: 'source-map',
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
  }
};
