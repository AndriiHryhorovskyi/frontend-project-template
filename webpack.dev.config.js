const path = require("path");
const merge = require("webpack-merge");
const webpack = require("webpack");
const { config, vars } = require("./webpack.common.config");

module.exports = merge(config, {
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          { loader: "style-loader", options: { sourceMap: true } },
          { loader: "css-loader", options: { sourceMap: true } },
          { loader: "sass-loader", options: { sourceMap: true } }
        ]
      }
    ]
  },
  devtool: "eval",
  devServer: {
    port: 4000,
    contentBase: vars.distPath,
    overlay: true,
    open: true,
    openPage: "pages"
  },
  plugins: [new webpack.NamedChunksPlugin()]
});
