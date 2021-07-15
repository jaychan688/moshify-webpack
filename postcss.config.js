module.exports = {
	plugins: [
		// Must set mixins plugin before postcss-simple-vars and postcss-nested.
		require('postcss-import'),
		require('postcss-mixins'),
		require('postcss-simple-vars'),
		require('postcss-nested'),
		// postcss-hexrgba: Adds shorthand hex methods to rgba() values.
		require('postcss-hexrgba'),
		require('autoprefixer'),
		// require('cssnano'),
	],
}
