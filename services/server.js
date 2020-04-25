require('dotenv').config();

// server
const path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

// bundler
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const compiler = webpack(webpackConfig);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: true} ));
mongoose.Promise = global.Promise;

// The main instance of HTTP server
var server = require('http').Server(app);


app.use(express.static(path.join(__dirname, '/application/public')));
app.use(webpackDevMiddleware(compiler, {
    hot: true,
    filename: 'bundle.js',
    publicPath: '/',
    stats: {
        colors: true,
    },
    historyApiFallback: true,
}));

// Added for exposing our server instance to the test suite
module.exports = server;

// this is our MongoDB database
const dbRoute = process.env.DB_HOST;

// connects our back end code with the database
mongoose.connect(dbRoute, { useNewUrlParser: true, useUnifiedTopology: true}).catch(function (reason) {
    console.log('Unable to connect to the mongodb instance. Error: ', reason);
});

var hostname = 'localhost';
var port = 8080;

// APIs go here
const player = require('./apis/player.js')(app);
const user = require('./apis/users.js')(app);
const game = require('./apis/game.js')(app);
const withAuth = require('./apis/middleware');

// Common Routes

/**
 * ROUTE TEMPLATE
 * 
 * app.<route>('/<endpoint>', withAuth, (req, res) => {
 *      res.status(<status code>).json({ msg:<data> });
 * });
 * 
 */

// helpers


app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'application/public', 'index.html'), (err) => {
        if (err) res.status(500).send(err);
    });
});


// Start listening for requests
server.listen(process.env.PORT || port, function () {
    console.log(`Server running at http://${hostname}:${port}/`);
});