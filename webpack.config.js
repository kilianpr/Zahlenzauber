const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
let subHtmlPlugins = []

module.exports = {
    entry: {
        main: './src/main.js'
    },
    devServer: {
        static: './dist',
      },
    module: {

        rules: [
        { 
            test: /\.(gltf|glb|bin|fbx|obj|ttf)$/,
            type: 'asset/resource',
        },
        {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader'],
        },
        {
            test: /\.html$/i,
            loader: "html-loader",
            generator: {
                filename: '[name][ext]'
            }
          },
        {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: 'asset/resource',
            generator: {
                filename: 'img/[name][ext]'
            }
        }
        ],
      },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            inject: 'body',
            chunks: ['main']
        }),
    ],
    mode: 'development'
};