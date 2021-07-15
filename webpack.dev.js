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
	test: /\.css$/i,
	use: ['css-loader', 'postcss-loader'],
}

const pages = fse
	.readdirSync('./src/components')
	.filter(file => {
		return file.endsWith('.html')
	})
	.map(page => {
		return new HtmlWebpackPlugin({
			filename: page,
			template: `./src/components/${page}`,
			// entry 要搭配  chunks
			chunks: [page.slice(0, page.indexOf('.'))],
		})
	})

const config = {
	entry: {
		'block-domain': './src/components/block-domain.js',
		'block-feature': './src/components/block-feature.js',
		'block-footer': './src/components/block-footer.js',
		'block-hero': './src/components/block-hero.js',
		'block-plan': './src/components/block-plan.js',
		'block-showcase': './src/components/block-showcase.js',
		'block-testimonial': './src/components/block-testimonial.js',
		badge: './src/components/badge.js',
		blocks: './src/components/blocks.js',
		blocks: './src/components/blocks.js',
		button: './src/components/button.js',
		callouts: './src/components/callouts.js',
		card: './src/components/card.js',
		collapsible: './src/components/collapsible.js',
		grid: './src/components/grid.js',
		icon: './src/components/icon.js',
		input: './src/components/input.js',
		link: './src/components/link.js',
		lists: './src/components/lists.js',
		media: './src/components/media.js',
		navbar: './src/components/navbar.js',
		plan: './src/components/plan.js',
		quote: './src/components/quote.js',
		Testimonials: './src/components/Testimonials.js',
	},
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
	plugins: pages,
}

if (currentTask === 'dev') {
	cssConfig.use.unshift('style-loader')

	config.output = {
		// multi-page seeting: [name] to output different js to match html.
		filename: '[name].js',
		// output the bundle.js to the src folder,
		// side by side by the index.html, using absolute path.
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

// Copy images folder
class RunAfterCompile {
	apply(compiler) {
		compiler.hooks.done.tap('Copy images', () => {
			fse.copySync('./src/images', './dist/images')
		})
	}
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
