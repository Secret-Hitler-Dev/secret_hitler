require('dotenv').config()
var mongoose = require('mongoose');
var Player = require("../models/Player");
var Game = require("../models/Game");
var shortid = require('shortid');

module.exports = {

    joinGameAPI: (gameCode, joiningPlayerTag, socket, io) => {      
        var payload = null;
        var game = null;
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
                // game must have space for the player
                if (retrievedGame.players.includes(joiningPlayerTag)) {
                    payload = {
                        status: 'success',
                        data: game.code,
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
                                        payload = {
                                            status: 'success',
                                            data: update.code,
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
