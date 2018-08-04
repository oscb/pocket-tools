const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HappyPack = require('happypack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  entry: ['./src/index.tsx'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
    publicPath: '/'
  },
  devtool: false,
  devServer: {
    contentBase: './dist',
    hot: true,
    historyApiFallback: true
  },
  
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
      react: path.resolve(path.join(__dirname, './node_modules/react')),
      'babel-core': path.resolve(
        path.join(__dirname, './node_modules/@babel/core'),
      ),
    },
  },

  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    // TODO: Add DllPlugin for vendor stuff (react, lodash, office fabric, materalui,etc)
    // TODO: HappyPack seems to be slightly faster for TS, but might need to tweakit to make it work fine 
    // new HappyPack({
    //   id: 'ts',
    //   threads: 2,
    //   loaders: [
    //     {
    //       loader: 'babel-loader',
    //         options: {
    //         babelrc: false,
    //         plugins: ['react-hot-loader/babel'],
    //       },
    //     },
    //     {
    //       path: 'ts-loader',
    //       query: { happyPackMode: true }
    //     }
    //   ]
    // }),
    // new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true })
  ],
  
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        // loader: 'happypack/loader?id=ts'
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              plugins: ['react-hot-loader/babel'],
            },
          },
          'awesome-typescript-loader'
        ],
      },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
      
      // TODO: Remove Sass dependency eventually, maybe switch to aphrodite? or just css
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader'
          }, 
          {
            loader: 'css-loader', 
            options: {
              sourceMap: true
            }
          }, 
          {
            loader: 'sass-loader', 
            options: {
              sourceMap: true,
              includePaths: [path.resolve(process.cwd(), 'src')]
            }
          }
        ]
      },
    ]
  },

  optimization: {
    splitChunks : {
      chunks: 'all'
    }
  }
};