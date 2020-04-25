const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");

const htmlWebpackPlugin = new HtmlWebPackPlugin({
    template: "../public/index.html",
    filename: "./index.html",
    favicon: '../public/favicon.ico'
});

module.exports = {
    context: path.join(__dirname, '/application/src'),
    entry: [
        './index.js',
    ],
    output: {
        path: path.join(__dirname, '/application/public'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.js|jsx$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                ],
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    }
                ]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
                exclude: /node_modules/,
                use: ['file-loader?name=[name].[ext]'] // ?name=[name].[ext] is only necessary to preserve the original file name
            }
        ],
    },
    resolve: {
        modules: [
            path.join(__dirname, 'node_modules'),
        ],
        alias: {
            Components: path.resolve(__dirname, 'application/src/components/'),
            Pages: path.resolve(__dirname, 'application/src/pages/'),
        }
    },
    
    devServer: {
        historyApiFallback: true,
        proxy: {
            '/': 'http://localhost:8080'
        }
    },
    plugins: [htmlWebpackPlugin]
}; 