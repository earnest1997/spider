

const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const config = require('./config')
const SwPlugin = require('./sw-plugin.js')
const NODE_ENV = process.env.NODE_ENV
// style files regexes
const preRegex = /\.(scss|sass)$/

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

// common function to get style loaders
const getStyleLoaders = () => {
  const preProcessor = 'sass-loader'
  const loaders = [
    NODE_ENV === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader'
    },
    preProcessor
  ]

  return loaders
}

module.exports = {
  entry: resolve('src/index.js'),
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.css', '.scss'],
    alias: {
      'util': resolve('src/util/'),
      'server':resolve('src/server/'),
      '@':resolve('src/client')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          NODE_ENV === 'development'
            ? 'style-loader'
            : MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: preRegex,
        use: getStyleLoaders(),
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: `${config.build.assetsSubDirectory}/img/[name].[hash:8].[ext]`
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: `${config.build.assetsSubDirectory}/media/[name].[hash:8].[ext]`
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: `${config.build.assetsSubDirectory}/fonts/[name].[hash:8].[ext]`
        }
      }
    ]
  }
  // plugins:[new SwPlugin()]
}
