const currentTask = process.env.npm_lifecycle_event
const path = require('path')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const fse = require('fs-extra')

class RunAfterCompile {
	apply(compiler) {
		compiler.hooks.done.tap('Copy images', () => {
			fse.copySync('./src/images', './dist/images')
		})
	}
}

const cssConfig = {
	test: /\.css$/i,
	use: ['css-loader', 'postcss-loader'],
}

const pages = fse
	.readdirSync('./src')
	.filter(file => {
		return file.endsWith('.html')
	})
	.map(page => {
		return new HtmlWebpackPlugin({
			filename: page,
			template: `./src/${page}`,
		})
	})

const config = {
	entry: './src/js/index.js',
	plugins: pages,
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
}

if (currentTask === 'start') {
	cssConfig.use.unshift('style-loader')

	config.output = {
		filename: 'bundle.js',
		// output the bundle.js to the src folder,side by side by the index.html, using absolute path.
		path: path.resolve(__dirname, 'src'),
	}

	config.devServer = {
		// Middleware: modify html file and auto reload, full page reload
		before: (app, server) => {
			server._watch('./src/**/*.html')
		},
		contentBase: path.join(__dirname, 'src'),
		hot: true,
		open: true,
		port: 3000,
		historyApiFallback: true,
		// Let server to be accessible externally, allow mobile test
		// Modify package.json, scripts -> "start": "webpack serve --open  --host localhost"
		host: '0.0.0.0',
	}

	config.mode = 'development'
	config.devtool = 'source-map'
}

if (currentTask === 'build') {
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
