
const path = require("path");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const nodeExternals = require('webpack-node-externals');

const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: './src/app.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'app.js'
    },
    plugins: [
        new NodePolyfillPlugin(),
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
            //   { from: "./src/css", to: "css" },
              { from: "./src", to: "" },
            ],
          }),
    ],
    target: 'node', // ignore built-in modules like path, fs, etc.
    externals: [nodeExternals()], // ignore all modules in node_modules folder    
    resolve: {
        extensions: ['.ts', '.js'],
      }
}