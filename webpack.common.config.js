const path = require("path");
const fs = require("fs");
const htmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const content = require("./content.json");

const distPath = path.resolve(__dirname, "./dist");
const srcPath = path.resolve(__dirname, "./src");
const entriesPath = path.resolve(__dirname, "./src/pages");

const entry = { images: path.resolve(srcPath, "img/index.js") };

const pages = fs
  .readdirSync(entriesPath, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

pages.forEach(page => {
  entry[page] = path.resolve(entriesPath, `${page}/${page}.js`);
});

module.exports = {
  config: {
    context: srcPath,
    entry,
    output: {
      filename: "scripts/[name].[contenthash].js",
      path: distPath,
      publicPath: "/"
    },
    module: {
      rules: [
        {
          test: /\.pug$/,
          use: [
            {
              loader: "pug-loader",
              options: {
                self: true,
                globals: true
              }
            }
          ]
        },
        {
          test: /[\\/]content[\\/].*\.(png|jpe?g)$/i,
          loader: "responsive-loader",
          options: {
            name: "[path][name]-[width].[hash].[ext]",
            quality: 0
          }
        },
        {
          test: /[\\/]content[\\/].*\.(gif|svg)$/i,
          loader: "file-loader",
          options: {
            name: "[path][name].[ext]"
          }
        },
        {
          test: /[\\/]favicons[\\/].*\.(png|jpe?g)$/i,
          loader: "responsive-loader",
          options: {
            name: "[path][name]-[width].[ext]",
            sizes: [16, 32, 180, 192]
          }
        },
        {
          test: /[\\/]favicons[\\/].*\.(gif|ico|svg)$/i,
          loader: "file-loader",
          options: {
            name: "[path][name].[ext]"
          }
        },
        {
          test: /[\\/](background|icons)[\\/].*\.(png|jpe?g|gif|ico|svg)$/i,
          loader: "file-loader",
          options: {
            name: "[path][name].[ext]"
          }
        },
        {
          test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
                emitFile: false
              }
            }
          ]
        }
      ]
    },
    optimization: {
      runtimeChunk: "single",
      splitChunks: {
        chunks: "all",
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const match = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              );
              const packageName = match ? match[1] : "vendors";

              // npm package names are URL-safe, but some servers don't like @ symbols
              return `npm.${packageName.replace("@", "")}`;
            }
          }
        }
      }
    },
    plugins: [
      ...pages.map(
        page =>
          new htmlWebpackPlugin({
            template: path.resolve(srcPath, `pages/${page}/${page}.pug`),
            filename: path.join("pages", `${page}.html`),
            excludeChunks: [...pages.filter(p => p != page), "images"],
            minify: {
              collapseWhitespace: true,
              collapseInlineTagWhitespace: true,
              removeComments: true
            },
            ...content
          })
      ),
      new CopyWebpackPlugin([
        {
          from: path.join(srcPath, "fonts"),
          to: `fonts`
        },
        {
          from: path.join(srcPath, "manifest.json"),
          to: ``
        }
      ])
    ]
  },
  vars: { distPath, srcPath }
};
