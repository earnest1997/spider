const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const merge = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const baseWebpackConfig = require('./webpack.base.conf.js');
const config = require('./config');

const webpackConfig = merge(baseWebpackConfig, {
  mode: config.build.mode,
  devtool: config.build.sourceMap,
  output: {
    path: config.build.assetsRoot,
    filename: path.join(
      config.build.assetsSubDirectory,
      'js/[name].[chunkhash:8].js'
    ),
    chunkFilename: path.join(
      config.build.assetsSubDirectory,
      'js/[name].[chunkhash:8].chunk.js'
    ),
    publicPath: config.build.assetsPublicPath,
  },
  optimization: {
    minimize: true,
    splitChunks: {
      cacheGroups: {
        common: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
    runtimeChunk: true,
  },
  plugins: [
    // 清除之前build过的文件 root选项不再需要
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../src/client/static'),
        to: 'assets/img',
        ignore: ['.*'],
        force:true
      }
    ]),
    new MiniCssExtractPlugin({
      filename: path.join(
        config.build.assetsSubDirectory,
        'css/[name].[contenthash:8].css'
      ),
      chunkFilename: path.join(
        config.build.assetsSubDirectory,
        'css/[name].[contenthash:8].chunk.css'
      ),
    }),
    new OptimizeCssAssetsPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.tpl.html',
      favicon: path.resolve(__dirname, '../src/client/static/favicon.ico'),
      minify: {
        removeComments: true, // 移除注释
        collapseWhitespace: true, // 去除空格
        removeEmptyAttributes: true, // 去除空属性
      },
    }),
  ],
});

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin =
    require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;
