const currentTask = process.env.NODE_ENV || 'development'
// plugins 的順序很重要，
const config = {
	plugins: [
		require('postcss-import'),
		require('postcss-simple-vars'),
		require('postcss-css-variables'),
		require('postcss-hexrgba'),
		require('postcss-color-function'),
		require('postcss-mixins'),
		require('postcss-nested'),
		require('autoprefixer'),
	],
}

if (currentTask === 'production') config.plugins.push(require('cssnano'))

module.exports = config
