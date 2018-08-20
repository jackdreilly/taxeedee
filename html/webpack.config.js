const path = require('path');

module.exports = {
  entry: {
    main: './src/index.js',
    guestbook: './src/guestbook.js',
    about: './src/about.js',
  },
  output: {filename: '[name].js', path: path.resolve(__dirname, 'dist')},
  mode: 'development'
};