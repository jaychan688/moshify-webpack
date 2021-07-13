module.exports = {
	plugins: [
		require('postcss-import'),
		require('postcss-mixins'),
		require('postcss-simple-vars'),
		require('postcss-nested'),
		require('autoprefixer'),
		require('postcss-hexrgba'),
		require('cssnano'),
	],
}
