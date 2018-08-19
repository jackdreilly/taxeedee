const path = require('path');

module.exports = {
	entry: {
		main: './src/index.js',
		guestbook: './src/guestbook.js',
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist')
	},
	mode: 'development'
};