const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

// css
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");

// img
const tinyPngWebpackPlugin = require("tinypng-webpack-plugin");
const ImageminPlugin = require("imagemin-webpack");
const imageminSvgo = require("imagemin-svgo");
const imageminGifsicle = require("imagemin-gifsicle");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminOptipng = require("imagemin-optipng");

const { config } = require("./webpack.common.config");

const plugins = [
  new CleanWebpackPlugin(),
  new webpack.HashedModuleIdsPlugin(),
  new MiniCssExtractPlugin({
    filename: path.join("styles", "[name].[contenthash].css")
  })
];
process.env.tinyPngApiKey
  ? plugins.push(
      new tinyPngWebpackPlugin({
        key: process.env.tinyPngApiKey
      }),
      new ImageminPlugin({
        imageminOptions: {
          plugins: [
            imageminGifsicle({
              optimizationLevel: 3
            }),
            imageminSvgo({
              removeTitle: true,
              convertPathData: false
            })
          ]
        }
      })
    )
  : plugins.push(
      new ImageminPlugin({
        imageminOptions: {
          plugins: [
            imageminGifsicle({
              optimizationLevel: 3
            }),
            imageminSvgo({
              removeTitle: true,
              convertPathData: false
            }),
            imageminJpegtran({
              progressive: true
            }),
            imageminOptipng({
              optimizationLevel: 7
            })
          ]
        }
      })
    );

module.exports = merge(config, {
  mode: "production",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{ loader: "babel-loader" }]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: "css-loader" },
          {
            loader: "postcss-loader",
            options: {
              plugins: [
                autoprefixer,
                cssnano({
                  preset: ["default", { discardComments: { removeAll: true } }]
                })
              ]
            }
          },
          { loader: "sass-loader" }
        ]
      }
    ]
  },
  plugins
});
