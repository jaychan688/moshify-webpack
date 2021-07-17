const currentTask = process.env.NODE_ENV || 'development'

const config = {
	plugins: [
		// Must set mixins plugin before postcss-simple-vars and postcss-nested.
		require('postcss-import'),
		// ! simple vars won't work in import (demo: btn)
		require('postcss-simple-vars'),
		require('postcss-mixins'),
		// Transform CSS Custom Properties (CSS variables) syntax into a static representation.
		require('postcss-css-variables'),
		require('postcss-nested'),
		// postcss-hexrgba: Adds shorthand hex methods to rgba() values.
		require('postcss-hexrgba'),
		require('postcss-color-function'),
		require('autoprefixer'),
	],
}

if (currentTask === 'production') config.plugins.push(require('cssnano'))

module.exports = config
