// ! SPA setting
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const fse = require('fs-extra')

const isProduction = process.env.NODE_ENV || false
const target = isProduction ? 'browserslist' : 'web'
const devtool = isProduction ? false : 'source-map'
const mode = isProduction || 'development'

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
	mode,
	target,
	devtool,
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

if (!isProduction) {
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
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({ filename: 'style.[chunkhash].css' }),
		new RunAfterCompile()
	)
}

module.exports = config
