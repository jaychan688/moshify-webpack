module.exports = {
	plugins: [
		require('postcss-import'),
		require('postcss-mixins'),
		require('postcss-preset-env'),
		require('postcss-simple-vars'),
		require('postcss-nested'),
		require('postcss-hexrgba'),
		require('autoprefixer'),
		require('cssnano'),
	],
}
