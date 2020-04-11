require('dotenv').config()
var mongoose = require('mongoose');
var Player = require("../models/Player");
var Game = require("../models/Game");
var shortid = require('shortid');

module.exports = function(app) {
    app.post('/api/createGame', function(req, res) {
        var gameCode = shortid.generate();
        var players = [new mongoose.mongo.ObjectId(req.body.playerId)];

        var newGame = new Game({
            code: gameCode,
            players: players,
            numPlayers: 1
        });
        newGame.save(function(err, game) {
            if (err) {
                res.status(400)
                .json({
                    status: 'error',
                    data: {},
                    message: err
                });
            } else {
                res.status(202)
                .json({
                    status: 'success',
                    data: game._id,
                    message: "Game code is " + game.code
                });
            }
        });
        console.log("created")
    });

    app.post('/api/joinGame', function(req, res) {        
        var gameCode = req.body.gameCode;
        var game = null;
        Game.findOne({code: gameCode}, function(err, retrievedGame) {
            if (err) {
                console.log("hellow")
                res.status(400)
                .json({
                    status: 'error',
                    data: {},
                    message: err
                });
            } else {
                game = retrievedGame;
                // game must have space for the player
                if (game.numPlayers < 10) {
                    console.log("hello");
                    console.log(game.players);
                    
                    if (game.players.includes(req.body._id)) {
                        res.status(202)
                        .json({
                            status: 'success',
                            data: update._id,
                            message: "Player already in, rejoined game: " + update.code
                        });
                    } else {
                        game.players.push(req.body._id);
                        game.numPlayers += 1;
                        game.save(function(err, update) {
                            if (err) {
                                res.status(400)
                                .json({
                                    status: 'error',
                                    data: {},
                                    message: err
                                });
                            } else {
                                res.status(200)
                                .json({
                                    status: 'success',
                                    data: update._id,
                                    message: "Player joined" + update.code
                                });
                            }                            
                        });
                    }
                } else {
                    res.status(400)
                    .json({
                        status: 'error',
                        data: {},
                        message: "this party is full"
                    });
                }
            }
        });
    });
};
