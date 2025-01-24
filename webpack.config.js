const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development', // Set the mode to 'development' or 'production'
  entry: './js/chat.js', // Ensure the entry point is correct
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  resolve: {
    fallback: {
      "fs": false,
      "path": require.resolve("path-browserify"),
      "stream": require.resolve("stream-browserify"),
      "zlib": require.resolve("browserify-zlib"),
      "os": require.resolve("os-browserify/browser"),
      "buffer": require.resolve("buffer/"),
      "net": false,
      "tls": false,
      "crypto": require.resolve("crypto-browserify"),
      "https": require.resolve("https-browserify"),
      "http": require.resolve("stream-http"),
      "url": require.resolve("url/"),
      "assert": require.resolve("assert/"),
      "util": require.resolve("util/"),
      "vm": require.resolve("vm-browserify"),
    },
    modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
};