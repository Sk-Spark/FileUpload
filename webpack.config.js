
const path = require("path");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const nodeExternals = require('webpack-node-externals');

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
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
    module: {
        rules:[
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.html$/,
                use: [
                   {
                        loader: "html-loader",
                        options: { minimize : false }
                    }
                ]
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: [
                   {
                        loader: "file-loader",
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    //  "style-loader",
                     "css-loader",
                     "sass-loader"
                ]
            },
        ]
    },
}