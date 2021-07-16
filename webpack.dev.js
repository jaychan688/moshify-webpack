const path = require('path')
// Depend on npm scripts we define: npm_lifecycle_event:
const currentTask = process.env.npm_lifecycle_event
// Remove/clean your build folder(s).
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// Extracts CSS into separate files.
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
//  Plugin that simplifies creation of HTML files to serve your bundles
const HtmlWebpackPlugin = require('html-webpack-plugin')
// Replacement for native fs
const fse = require('fs-extra')

const cssConfig = {
	test: /\.(pc|c)ss$/i,
	use: ['css-loader', 'postcss-loader'],
}

// Return an Array including the file name of html
const blocks = fse.readdirSync('./src/blocks').filter(file => {
	return file.endsWith('.html')
})
// entries object: key value pair
const blockEntries = blocks.reduce((entry, page) => {
	let filename = page.slice(0, page.indexOf('.'))
	entry[filename] = `./src/blocks/${filename}.js`
	return entry
}, {})
// An array of HtmlWebpackPlugin
const blockPages = blocks.map(page => {
	return new HtmlWebpackPlugin({
		inject: true,
		filename: page,
		template: `./src/blocks/${page}`,
		// entry 要搭配  chunks
		chunks: [page.slice(0, page.indexOf('.'))],
	})
})

const components = fse.readdirSync('./src/components').filter(file => {
	return file.endsWith('.html')
})

const entries = components.reduce((entry, page) => {
	let filename = page.slice(0, page.indexOf('.'))
	entry[filename] = `./src/components/${filename}.js`
	return entry
}, {})

const pages = components.map(page => {
	return new HtmlWebpackPlugin({
		inject: true,
		filename: page,
		template: `./src/components/${page}`,
		// entry 要搭配  chunks
		chunks: [page.slice(0, page.indexOf('.'))],
	})
})

const config = {
	entry: { ...blockEntries, ...entries },
	module: {
		rules: [
			cssConfig,
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: ['babel-loader'],
			},
			// Webpack build in asset modules - is type not use loader
			// For Images
			{
				test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
				type: 'asset/resource',
			},
			// For Fonts and SVGs
			{
				test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
				type: 'asset/inline',
			},
		],
	},
	plugins: [...pages, ...blockPages],
}

if (currentTask === 'dev') {
	cssConfig.use.unshift('style-loader')

	config.output = {
		// multi-page seeting: [name] to output different js to match html.
		filename: '[name].js',
		// output the bundle.js to the src folder,
		// side by side by the index.html, using absolute path.
		path: path.resolve(__dirname, 'public'),
	}

	config.devServer = {
		// Middleware: modify html file and auto reload, full page reload
		// before: (app, server) => {
		// 	server._watch('./src/components/**/*.html')
		// },
		contentBase: path.join(__dirname, 'public'),
		watchContentBase: true,
		hot: true,
		open: true,
		port: 3000,
		historyApiFallback: true,
		host: '0.0.0.0',
	}

	config.mode = 'development'
	config.devtool = 'source-map'
}

// Copy images folder
class RunAfterCompile {
	apply(compiler) {
		compiler.hooks.done.tap('Copy images', () => {
			fse.copySync('./src/images', './dist/images')
		})
	}
}

if (currentTask === 'multibuild') {
	cssConfig.use.unshift(MiniCssExtractPlugin.loader)

	config.output = {
		filename: '[name].[chunkhash].js',
		chunkFilename: '[name].[chunkhash].js',
		path: path.resolve(__dirname, 'dist'),
	}

	config.mode = 'production'
	config.optimization = {
		splitChunks: { chunks: 'all' },
	}

	config.plugins.push(
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({ filename: 'style.[chunkhash].css' }),
		new RunAfterCompile()
	)
}

module.exports = config
