const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const sourcePath = path.join(__dirname, './src');
const outPath = path.join(__dirname, './dist');

module.exports = (env) => {
  const isDevBuild = !(env && env.prod);
  return [{
    entry: [
      './src/index.tsx'
    ],
    output: {
      path: outPath,
      filename: '[name].bundle.js',
      chunkFilename: '[name].chunk.js',
      publicPath: '/',
    },
    devtool: 'source-map',
    devServer: {
      contentBase: sourcePath,
      hot: true,
      inline: true,
      historyApiFallback: {
        disableDotRule: true
      },
      stats: 'minimal',
      clientLogLevel: 'warning'
    },

    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    },
    
    module: {
      rules: [
        {
          test: /\.(js|jsx|mjs)$/,
          loader: require.resolve('source-map-loader'),
          enforce: 'pre',
          include: sourcePath,
        },
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
          loader: require.resolve('url-loader'),
          options: {
            limit: 10000,
            name: 'dist/media/[name].[hash:8].[ext]',
          },
        },
        // TODO: I need to add Babel to make HMR work better
        {
          test: /\.(ts|tsx)$/,
          include: sourcePath,
          use: [
            {
              loader: require.resolve('ts-loader'),
              options: {
                // disable type checker - we will use it in fork plugin
                transpileOnly: true,
              },
            },
          ],
        },
        {
          test: /\.(js|jsx|mjs)$/,
          include: sourcePath,
          loader: require.resolve('babel-loader'),
          options: {
            compact: true,
          },
        },
        // TODO: Remove All Sass dependency eventually
        {
          test: /\.scss$/,
          use: isDevBuild? [
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
                includePaths: [sourcePath]
              }
            }
          ] :
          [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader', 
              options: {
                sourceMap: true,
                minimize: true
              }
            }, 
            {
              loader: 'sass-loader', 
              options: {
                sourceMap: true,
                includePaths: [sourcePath]
              }
            }
          ]
        },
        { 
          test: /\.css$/, 
          use: isDevBuild ? 
            [
              {
                loader: 'style-loader'
              }, 
              {
                loader: 'css-loader', 
                options: {
                  sourceMap: true
                }
              }
            ] : 
            [
              {
                loader: MiniCssExtractPlugin.loader,
              },
              {
                loader: 'css-loader', 
                options: {
                  sourceMap: true,
                  minimize: true
                }
              },
            ] 
      },
      // {
      //   exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
      //   loader: require.resolve('file-loader'),
      //   options: {
      //     name: 'dist/media/[name].[hash:8].[ext]',
      //   },
      // },
      ]
    },

    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({ 
        inject: true,
        title: '📖 Pocket Tools',
        template: 'src/index.html'
       }),
  
      new webpack.NamedModulesPlugin(),
      new Dotenv(),
      new ForkTsCheckerWebpackPlugin({
        async: false,
        watch: sourcePath,
        tsconfig: "./tsconfig.json",
        tslint: "./tslint.json",
      }),
    ].concat(isDevBuild ? [
      new webpack.HotModuleReplacementPlugin(),
    ] : [
      new MiniCssExtractPlugin(),
    ]),

    optimization: {
      splitChunks : {
        chunks: 'all'
      },
      // TODO: For Prod, minimize
    },
    node: {
      fs: 'empty'
    }
  }]
}