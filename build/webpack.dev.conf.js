

const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const baseWebpackConfig = require('./webpack.base.conf.js')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const SwPlugin = require('./sw-plugin.js')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const config = require('./config')

module.exports = merge(baseWebpackConfig, {
  mode: config.dev.mode,
  devtool: config.dev.sourceMap,
  output: {
    path: config.dev.assetsRoot,
    filename: path.join(config.dev.assetsSubDirectory, 'js/[name].js'),
    chunkFilename: path.join(config.dev.assetsSubDirectory, 'js/[name].chunk.js'),
    publicPath: config.dev.assetsPublicPath
  },
  devServer: {
    contentBase: config.dev.assetsRoot,
    ...config.dev.devServer,
    watchContentBase:true,
    inline: true,
    hot: true,
    quiet: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
  }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../src/client/scripts/sw.js'),
        to: config.dev.assetsRoot,
        // copyUnmodified: true,
        cache:true,
        force:true
      }
    ]),
    new HtmlWebpackPlugin({
      template: './src/index.tpl.html',
      favicon:path.resolve(__dirname,'../src/client/static/favicon.ico')
    }),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [`You application is running here ${config.dev.devServer.https ? 'https' : 'http'}://localhost:${config.dev.devServer.port}`]
      }
    }),
    new SwPlugin()
  ]
})


