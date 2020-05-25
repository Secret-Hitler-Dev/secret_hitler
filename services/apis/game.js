require('dotenv').config()
var mongoose = require('mongoose');
var Player = require("../models/Player");
var Game = require("../models/Game");
var shortid = require('shortid');

module.exports = {

    createGameAPI: (host, socket, io) => {
        var payload = null;
        var gameCode = shortid.generate();
        var players = [host];
        var newGame = new Game({
            code: gameCode,
            players: players,
            numPlayers: 1
        });
        /*
         [s1, s2, s3, ]
        */
        newGame.save((err, game) => {
            if (err || !game) {
                payload = {
                    status: 'error',
                    data: {},
                    message: err
                }
                socket.emit("createResult", payload);
            } else {
                payload = {
                    status: 'success',
                    data: game.code,
                    message: 'Created game, game code is ' + game.code
                }
                
                socket.join(game.code, () => {
                    io.in(game.code).emit('createResult', payload);
                });
            }
        });
    },

    joinGameAPI: (gameCode, joiningPlayerTag, playerNickName, socket, io) => {      
        var payload = null;
        var game = null;
        Game.findOne({code: gameCode}, function(err, retrievedGame) {
            if (err || !retrievedGame) {
                payload = {
                    status: 'error',
                    data: {},
                    message: err
                };
                socket.emit("joinResult", payload);

            } else {
                game = retrievedGame;

                
                // game must have space for the player
                if (retrievedGame.players.includes(joiningPlayerTag)) {
                    var players = [];
                    // here we go
                    Object.keys(io.sockets.adapter.rooms[retrievedGame.code].sockets).forEach((key) => {
                        players.push({
                            playerTag: io.sockets.connected[key].playerInfo.playerTag,
                            playerNickName: io.sockets.connected[key].playerInfo.playerNickName
                        })
                    });
                    payload = {
                        status: 'success',
                        data: {
                            joiningPlayerTag: joiningPlayerTag,
                            playerNickName: playerNickName,
                            code: game.code,
                            players: players
                        },
                        message: "Player already in, rejoined game: " + game.code
                    };
                    
                    socket.join(gameCode, () => {
                        io.in(gameCode).emit("joinResult", payload);
                    });
                } else {
                    if (game.numPlayers < 10) {
                        // create a player

                        var newPlayer = new Player({
                            playerTag: joiningPlayerTag,
                            playerNickName: joiningPlayerTag,
                            playerRoom: gameCode,
                        });
                        
                        newPlayer.save((err, player) => {
                            if (err || !player) {
                                payload = {
                                    status: 'error',
                                    data: err,
                                    message: "Error occured"
                                };
                                socket.emit("joinResult", payload);
                            } else {

                                game.players.push(joiningPlayerTag);
                                game.numPlayers += 1;
                                game.save(function(err, update) {
                                    if (err) {
                                        payload = {
                                            status: 'error',
                                            data: {},
                                            message: err
                                        };
                                    } else {
                                        var players = [];
                                        Object.keys(io.sockets.adapter.rooms[update.code].sockets).forEach((key) => {
                                            players.push({
                                                playerTag: io.sockets.connected[key].playerInfo.playerTag,
                                                playerNickName: io.sockets.connected[key].playerInfo.playerNickName
                                            })
                                        });
                                        payload = {
                                            status: 'success',
                                            data: {
                                                joiningPlayerTag: joiningPlayerTag,
                                                playerNickName: playerNickName,
                                                code: update.code,
                                                players: players
                                            },
                                            message: "Player joined " + update.code
                                        };
                                        
                                        socket.join(update.code, () => {
                                            io.in(update.code).emit("joinResult", payload);
                                        });
                                    }                            
                                });
                            }
                        });
                    } else {
                        payload = {
                            status: 'error',
                            data: {},
                            message: "This party is full"
                        };
                        socket.emit("joinResult", payload);
                    }
                }
            }
        });
    }
};
