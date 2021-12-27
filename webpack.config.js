const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    devServer: {
        static: './dist',
      },
    module: {

        rules: [
        { 
            test: /\.(gltf|glb|bin|fbx|obj)$/,
            use: 'file-loader',
        },
        {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader'],
        },
        {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: 'asset/resource',
        }
        ],
      },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            inject: 'body',
        })
    ],
    mode: 'development'
};