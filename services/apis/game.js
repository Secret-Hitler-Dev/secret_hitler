require('dotenv').config()
var mongoose = require('mongoose');
var Player = require("../models/Player");
var Game = require("../models/Game");
var shortid = require('shortid');

module.exports = {
    // app.post('/api/createGame', function(req, res) {
    //     var gameCode = shortid.generate();
    //     var players = [new mongoose.mongo.ObjectId(req.body.playerId)];

    //     var newGame = new Game({
    //         code: gameCode,
    //         players: players,
    //         numPlayers: 1
    //     });
    //     newGame.save(function(err, game) {
    //         if (err) {
    //             res.status(400)
    //             .json({
    //                 status: 'error',
    //                 data: {},
    //                 message: err
    //             });
    //         } else {
    //             res.status(202)
    //             .json({
    //                 status: 'success',
    //                 data: game._id,
    //                 message: "Game code is " + game.code
    //             });
    //         }
    //     });
    //     console.log("created")
    // });

    joinGameAPI: (gameCode, joiningPlayerID, socket, io) => {      
        var payload = null;
        var game = null
        Game.findOne({code: gameCode}, function(err, retrievedGame) {
            if (err) {
                payload = {
                    status: 'error',
                    data: {},
                    message: err
                };
                socket.emit("joinResult", payload);

            } else {
                game = retrievedGame;
                console.log(retrievedGame);
                // game must have space for the player


                // console.log(req.body._id);
                if (retrievedGame.players.includes(joiningPlayerID)) {
                    payload = {
                        status: 'success',
                        data: game.code,
                        message: "Player already in, rejoined game: " + game.code
                    };
                    socket.join(gameCode, () => {
                        console.log('sdsdsdsdsdsdsdsd')
                        console.log(gameCode);
                        io.in(gameCode).emit("joinResult", payload);
                        console.log('sdsdpart2sdsdsdsdsdsd')
                        
                    });
                } else {
                    if (game.numPlayers < 10) {
                        game.players.push(joiningPlayerID);
                        game.numPlayers += 1;
                        game.save(function(err, update) {
                            if (err) {
                                payload = {
                                    status: 'error',
                                    data: {},
                                    message: err
                                };
                            } else {
                                payload = {
                                    status: 'success',
                                    data: update.code,
                                    message: "Player joined" + update.code
                                };
                                socket.join(gameCode, () => {
                                    console.log('sdsdsdsdsdsdsdsdj')
                                    console.log(gameCode)
                                    io.in(gameCode).emit("joinResult", payload);
                                    console.log('sdsdsdsdpart2jsdsdsdsd')

                                });
                            }                            
                        });
                    } else {
                        payload = {
                            status: 'error',
                            data: {},
                            message: "this party is full"
                        };
                        socket.emit("joinResult", payload);
                    }
                }
            }
        });
    }
};
