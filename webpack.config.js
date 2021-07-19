// ! SPA setting
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const fse = require('fs-extra')

const currentTask = process.env.NODE_ENV || 'development'
const target = process.env.NODE_ENV === 'product' ? 'browserslist' : 'web'

const cssConfig = {
	test: /\.(pc|c)ss$/i,
	use: ['css-loader', 'postcss-loader'],
}

const pages = fse
	.readdirSync('./src')
	.filter((file) => {
		return file.endsWith('.html')
	})
	.map((page) => {
		return new HtmlWebpackPlugin({
			filename: page,
			template: `./src/${page}`,
		})
	})

const config = {
	entry: './src/js/index.js',
	target,
	mode: currentTask,
	module: {
		rules: [
			cssConfig,
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: ['babel-loader'],
			},
			{
				test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
				type: 'asset/resource',
			},
			{
				test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
				type: 'asset/inline',
			},
		],
	},
	plugins: pages,
}

/*********** DEVELOPMENT  ************/

if (currentTask === 'development') {
	cssConfig.use.unshift('style-loader')

	config.output = {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
	}

	config.devServer = {
		before: (app, server) => {
			server._watch('./src/**/*.html')
		},
		contentBase: path.join(__dirname, 'dist'),
		hot: true,
		port: 3000,
		historyApiFallback: true,
		host: '0.0.0.0',
	}
	config.devtool = 'source-map'
}

/*********** PRODUCTION  ************/
class RunAfterCompile {
	apply(compiler) {
		compiler.hooks.done.tap('Copy images', () => {
			fse.copySync('./src/images', './dist/images')
		})
	}
}

if (currentTask === 'production') {
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
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({ filename: 'style.[chunkhash].css' }),
		new RunAfterCompile()
	)
}

module.exports = config
