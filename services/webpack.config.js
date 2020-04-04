const path = require('path');

module.exports = {
    context: path.join(__dirname, '/application/src'),
    entry: [
        './index.js',
    ],
    output: {
        path: path.join(__dirname, '/application/public'),
        filename: 'bundle.js',
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
                loader: "style-loader!css-loader" 
            }
        ],
    },
    resolve: {
        modules: [
            path.join(__dirname, 'node_modules'),
        ],
    },
}; 