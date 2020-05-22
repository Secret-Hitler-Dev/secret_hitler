require('dotenv').config();

// server
const path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var socket = require('socket.io');
const cookieParser = require('cookie-parser');
var Game = require("./models/Game")
var shortid = require('shortid');
var morgan = require('morgan');

// bundler
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const compiler = webpack(webpackConfig);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: true} ));
mongoose.Promise = global.Promise;

// The main instance of HTTP server
var server = require('http').Server(app);
var io = socket(server);

app.use(express.static(path.join(__dirname, '/application/public')));
// app.use(webpackDevMiddleware(compiler, {
//     hot: true,
//     filename: 'bundle.js',
//     publicPath: '/',
//     stats: {
//         colors: true,
//     },
//     historyApiFallback: true,
// }));

// Added for exposing our server instance to the test suite
module.exports = server;

// this is our MongoDB database
const dbRoute = process.env.NODE_ENV === 'test' ? process.env.DB_HOST_TEST : process.env.DB_HOST;

if (process.env.NODE_ENV !== 'test') {
    // connects our back end code with the database
    mongoose.connect(dbRoute, { useNewUrlParser: true, useUnifiedTopology: true}).catch(function (reason) {
        console.log('Unable to connect to the mongodb instance. Error: ', reason);
    });
}

var hostname = 'localhost';
var port = 8080;

// APIs go here
const player = require('./apis/player.js')(app);
const user = require('./apis/users.js')(app);
const game = require('./apis/game.js');
const withAuth = require('./apis/middleware');

// Listeners
io.on('connection', socket => {
    socket.on('playerJoin', (playerTag, gameCode) => {
        // the listeners for these will be in the client code
        try{
            game.joinGameAPI(gameCode, playerTag, socket, io);
        } catch (err) {
            socket.emit('joinResult', 'error');
        }
    });

    socket.on("createGame", (playerTag) => {
        try {
            game.createGameAPI(playerTag, socket, io);
        } catch (err) {
            socket.emit("createResult", "error");
        }
    });

});

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

module.exports = app;