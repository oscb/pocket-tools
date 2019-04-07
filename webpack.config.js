const path = require('path');
const webpack = require('webpack');
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
        }
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
      
    ]),

    optimization: {
      splitChunks : {
        chunks: 'all'
      },
    },
    node: {
      fs: 'empty'
    }
  }]
}