const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
let subHtmlPlugins = []

module.exports = {
    entry: {
        main: './src/main.js',
        video: './src/subpages/video.js',
        background: './src/subpages/background.js',
        background: './src/subpages/background.js',
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
        new HtmlWebpackPlugin({
            template: './src/subpages/videos.html',
            filename: 'videos.html',
            chunks: ['background', 'video']
        }), 
        new HtmlWebpackPlugin({
            template: './src/subpages/exercises.html',
            filename: 'exercises.html',
            chunks: ['background']
        }),
        new HtmlWebpackPlugin({
            template: './src/subpages/about.html',
            filename: 'about.html',
            chunks: ['background']
        })
    ],
    mode: 'development'
};