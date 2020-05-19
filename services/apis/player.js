require('dotenv').config()

var Player = require("../models/Player");
var User = require("../models/User");
const utils = require("../server-utils");
// const salt = bcrypt.genSaltSync(15);
const jwt = require('jsonwebtoken');
const withAuth = require('./middleware');


function encode(email) {
    if (!email) return "";
    return utils.cryptr.encrypt(email);
}

function getAll(callback) {
    User.find({}, callback);
}

function collectStats(callback) {
    getAll(callback);
}

function createSession(identifier, req, res, data) {
    var payload = {
        hashedID: encode(identifier),
        isGuest: encode(data.isGuest),
        hashedPlayerName: encode(data.playerTag),
        hashedPlayerNickName: encode(data.playerNickName),
        hashedVerified: encode(data.verified),
        hashedPassword: data.isGuest ? encode(data.password) : null
    }
    const token = jwt.sign(payload, process.env.SECRET, {
        expiresIn: 60*60*100
    });
    collectStats((err, d) => {
        data.totalUsers = d.length;
        return res.cookie('token', token, { httpOnly: true }).status(200).json(data);
    });
}


module.exports = function(app) {

    app.get('/api/getPlayerList', function(req, res) {
        Player.find({}, function(err, players) {
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
                    data: players,
                    message: "Successfully retrieved all players"
                });
            }
        });
    });

    app.post('/api/createPlayer', function(req, res) {
        var newPlayer;
        if (req.body.userId) {
            newPlayer = new Player({
                userId: req.body.userId,
                playerName: req.body.playerName,
                // password: bcrypt.hashSync(req.body.password, salt)
            });
        } else {
            newPlayer = new Player({
                playerName: req.body.playerName,
                // password: bcrypt.hashSync(req.body.password, salt)
            });
        }
        newPlayer.save(function(err, player) {
            if (err) {
                console.log("stuff");
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
                        data: player._id,
                        message: "Player " + player.playerName + " added"
                    });
            }
        });
    });

    app.post('/api/updatePlayer', function(req, res) {
        var filter = {_id: req.body.id};
        var updateValues = req.body.values;
        Player.findOneAndUpdate(filter, JSON.parse(updateValues),  function(err, player) {
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
                    data: player,
                    message: "Successfully updated "
                });
            }
        });
    });

    app.delete('/api/deletePlayer', function(req, res) {
        Player.findOneAndDelete({_id : req.body._id}, function(err, player) {
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
                    data: player,
                    message: "Successfully deleted " + player.playerName
                });
            }
        });
    });
};