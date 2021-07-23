const path = require('path')
// Remove/clean your build folder(s).
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// Extracts CSS into separate files.
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
//  Simplifies creation of HTML files to serve your bundles
const HtmlWebpackPlugin = require('html-webpack-plugin')
// Replacement for native fs
const fse = require('fs-extra')

const isProduction = process.env.NODE_ENV || false
// DevServer bug: Temporary workaround for 'browserslist'
// that is bing patched in near futtue
const target = isProduction ? 'browserslist' : 'web'
const devtool = isProduction ? false : 'source-map'
const mode = isProduction || 'development'

class RunAfterCompile {
	apply(compiler) {
		compiler.hooks.done.tap('Copy images', () => {
			fse.copySync('./src/images', './dist/images')
		})
	}
}

/*********** COMMON  ************/
const cssConfig = {
	test: /\.css$/i,
	use: ['css-loader', 'postcss-loader'],
}

const generateEntries = (pageArray, folder) => {
	return pageArray.reduce((entry, page) => {
		let filename = page.slice(0, page.indexOf('.'))

		entry[filename] = `./src/${folder}/${filename}.js`
		return entry
	}, {})
}

const generateHtmlPlugin = (page, folder) => {
	// Factory pattern
	return new HtmlWebpackPlugin({
		template: `./src/${folder}/${page}`,
		filename: page,
		minify: false,
		inject: true,
		chunks: [page.slice(0, page.indexOf('.'))],
	})
}

const populateHtmlPlugins = (pageArray, folder) => {
	return pageArray.map(page => generateHtmlPlugin(page, folder))
}

// Return an Array including the file name of html
const blockHtml = fse.readdirSync('./src/blocks').filter(file => {
	return file.endsWith('.html')
})

const componentHtml = fse.readdirSync('./src/components').filter(file => {
	return file.endsWith('.html')
})
// An object of entry config
const blockEntries = generateEntries(blockHtml, 'blocks')
const componentEntries = generateEntries(componentHtml, 'components')

// An array of HtmlWebpackPlugin
const blockPlugins = populateHtmlPlugins(blockHtml, 'blocks')
const componentPlugins = populateHtmlPlugins(componentHtml, 'components')

const config = {
	entry: { ...blockEntries, ...componentEntries },
	plugins: [
		new CleanWebpackPlugin(),
		new RunAfterCompile(),
		...componentPlugins,
		...blockPlugins,
	],
	// default to 'web', but add browserslist, live reload won't work,  so set to 'web' only required for web-dev-server bugs"
	target,
	mode,
	devtool,
	module: {
		rules: [
			cssConfig,
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: ['babel-loader'],
			},
			// Webpack build in asset modules - is type not use loader
			{
				// For Images
				test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
				type: 'asset/resource',
			},
			{
				// For Fonts and SVGs
				test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
				type: 'asset/inline',
			},
		],
	},
}

/*********** DEVELOPMENT  ************/
if (!isProduction) {
	cssConfig.use.unshift('style-loader')

	config.output = {
		// multi-page seeting: [name] to output different js to match html.
		filename: '[name].js',
		// output the bundle.js to the public folder, must match devServer contentBase
		path: path.resolve(__dirname, 'dist'),
	}

	config.devServer = {
		// Middleware:  html auto reload - full page reload
		before: (app, server) => {
			server._watch('./src/components/**/*.html')
			server._watch('./src/blocks/**/*.html')
		},
		contentBase: path.join(__dirname, 'dist'),
		hot: true,
		port: 3000,
		historyApiFallback: true,
		host: '0.0.0.0',
	}
}

/*********** PRODUCTION  ************/
// Copy images folder

if (isProduction) {
	cssConfig.use.unshift(MiniCssExtractPlugin.loader)

	config.output = {
		filename: '[name].[chunkhash].js',
		chunkFilename: '[name].[chunkhash].js',
		path: path.resolve(__dirname, 'dist'),
	}

	config.optimization = {
		splitChunks: { chunks: 'all' },
	}

	config.plugins.push(
		new MiniCssExtractPlugin({ filename: '[name].[chunkhash].css' })
	)
}

module.exports = config
