require('dotenv').config()

var Users = require("../models/User");
var Player = require("../models/Player");
var General = require("../models/User");
const withAuth = require('./middleware');
const bcrypt = require('bcryptjs');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.SECRET);
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");


function encode(email) {
    if (!email) return "";
    return cryptr.encrypt(email);
}

function decode(email) {
    if (!email) return "";
    return cryptr.decrypt(email);
}

function createSession(identifier, isGuest, req, res, data) {
    var payload = {
        hashedID: encode(identifier),
        isGuest: encode(isGuest),
        hashedPlayerId: encode(data.playerId),
        hashedPlayerName: encode(data.playerTag)
    }
    const token = jwt.sign(payload, process.env.SECRET, {
        expiresIn: 60*60*100
    });

    collectStats((err, d) => {
        data.totalUsers = d.length;
        return res.cookie('token', token, { httpOnly: true }).status(200).json(data);
    });
    
}

function killSession(req, res) {
    // kill session
    
    // const token = jwt.sign('invalid', process.env.SECRET, {
    //     expiresIn: 0*60*60*100
    // });
    return res.clearCookie("token").sendStatus(200);
}

function login(err, data, email, password, req, res) {
    if (!err && data) {
        if (verifyPass(data, password))  {
            findPlayerByTag(data.playerTag, (err, player) => {
                if (err || !player) {
                    // create a player for this users first
                    var userPlayer = new Player({
                        playerName: data.playerTag,
                        password: "doesntmatter"
                    })
                    // users first time playing a game
                    userPlayer.save(function(err, newPlayer) {
                        if (err) {
                            res.status(400)
                                .json({
                                    status: 'error',
                                    data: {},
                                    message: " your player tag is probably taken"
                                }); 
                        } else { 
                            return createSession(email, false, req, res, {playerId: newPlayer._id, playerTag: newPlayer.playerName, verified: data.verified});
                        }
                    });
                } else if (player) {
                    // not the first time playing a game
                    return createSession(email, false, req, res, {playerId: player._id, playerTag: player.playerName, verified: data.verified});

                }
            });

        } else {
            res.status(401).json({ error: 0, msg: "Incorrect Password" });
        } 
    } 
    else return res.status(401).json({ error: 1, msg: "Email does not exists" });
}


function verifyPass(data, password) {
    if (!data || !password) return false;
    return bcrypt.compareSync(password, data.password);;
}

function findByEmail(email, callback) {
    Users.findOne({email: email}, callback);
}

function findByTag(tag, callback) {
    Users.findOne({playerTag: tag}, callback);
}

function findPlayerByTag(tag, callback) {
    Player.findOne({playerName: tag}, callback);
}

function getAll(callback) {
    Users.find({}, callback);
}

function verifyEmail(email, callback) {
    Users.findOne({email: email}, (err, data) => {
        if (err | data) {
            callback(null, {msg: "Email not found!"});
        }
        else {
            if (data.verified){
                callback(null, {msg: "Email already verified!"});
            }
            else {
                Users.updateOne({ email: email }, { $set: { verified: true } }, callback);
            }
        }
    });
    
}

function generateVerificationToken(email) {
    var date = new Date();
    var toEncode = "verification/"+email+"/"+date;
    return Buffer(toEncode, 'ascii').toString('base64');
}

function verificationTokenValid(email, token) {
    if (!token) return false;

    var data = Buffer(token, 'base64').toString('ascii').split("/");
    if (data.length != 3) {
        return false;
    }
    else {
        return (email === data[1] && Math.ceil((new Date() - new Date(data[2])) / (1000*60*60)) <= 72);
    }
}

function sendEmail(email, token, req) {
    var transporter = nodemailer.createTransport({ 
        service: 'gmail', 
        auth: { 
            user: process.env.MAIL_USER, 
            pass: process.env.MAIL_PASS 
        } 
    });

    var mailOptions = { 
        from: 'no-reply@shgang.com', 
        to: email, 
        subject: 'Account Verification Token', 
        text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/verify\/?token=' + token + '\n\nBest,\nSecret Hitler Gang\n' 
    };

    transporter.sendMail(mailOptions, function (err) {
        if (err) { return res.status(500).send({ msg: err.message }); }
        res.status(200).send('A verification email has been sent to ' + email + '.');
    });
}

function createUser(data, callback) {
    var salt = bcrypt.genSaltSync(15);
    var pass = bcrypt.hashSync(data.password, salt);
    var user = {
        email: data.email,
        playerTag: data.playerTag,
        password: pass
    };
    Users.create(user, callback);
}

function collectStats(callback) {
    getAll(callback);
}

function updateUserInfo(email, data, callback) {
    var user = {playerTag: data.playerTag};
    if (data.password){
        var salt = bcrypt.genSaltSync(15);
        var pass = bcrypt.hashSync(data.password, salt);
        user.password = pass;
    }

    Users.updateOne({ email: email }, { $set: user }, callback);
}

module.exports = function(app) {

    // Authentication
    // app.post('/api/playAsGuest', (req, res) => {
    //     var formData = req.body;
    //     return createSession("guest."+formData.playerTag, req, res, {playerTag: formData.playerTag});
    // });

    app.post('/api/playAsGuest', function(req, res) {
        console.log(req.body);
        var salt = bcrypt.genSaltSync(15);
        var newPlayer = new Player({
            playerName: req.body.playerName,
            password: bcrypt.hashSync(req.body.password, salt)
        });

        newPlayer.save(function(err, player) {
            if (err) {
                console.log("player");
                console.log(player._id);
                res.status(400)
                    .json({
                        status: 'error',
                        data: {},
                        message: " your player tag is probably taken, lol"
                    }); 
            } else { 
                console.log("newplayer");
                return createSession(player.playerName, true, req, res, {playerId: player._id, playerTag: player.playerName});
            }
        });
    });

    app.post('/api/signup', (req, res) => {
        var formData = req.body;
        findByEmail(formData.email, (err, data) => {
            if (err || !data) {
                // email doesn't exist we are good
                findByTag(formData.playerTag, (err, data) => {
                    if (err || !data) {
                        // tag doesn't exist we are good
                        createUser(formData, (err, data) => {
                            if (err) {
                                return res.status(400).json({error: err, msg:"Failed to create user."});
                            } else {
                                // create a player for this user
                                var userPlayer = new Player({
                                    playerName: data.playerTag,
                                    password: "doesntmatter"
                                });
                                userPlayer.save((err, player) => {
                                    return createSession(formData.email, false, req, res, {playerId: player._id, playerTag: player.playerName});
                                });                           
                            }
                            });
                    } 
                    else {
                        return res.status(401).json({ error: 1, msg: "Player Tag exists" });
                    }
                });
            } 
            else {
                return res.status(401).json({ error: 1, msg: "Email exists" });
            }
            
        });
    });

    app.post('/api/signout', (req, res) => {
        // delete player associated with this user
        return killSession(req, res);
    });

    app.post('/api/signin', (req, res) => {
        const {email, password} = req.body;

        findByEmail(email, (err, data) => {
            return login(err, data, email, password, req, res);
        });
    });

    app.get('/api/checkToken', withAuth, function(req, res) {
        // console.log("cookie");
        // console.log(req.headers.cookie);
        var token = req.headers.cookie.split("=")[1];
        var decoded = jwt.verify(token, process.env.SECRET);
        // console.log("decoded");
        // console.log(decoded);
        var payload = {
            identifier: decode(decoded.hashedID), // not used in guest case
            isGuest: decode(decoded.isGuest),
            playerId: decode(decoded.hashedPlayerId),
            playerName: decode(decoded.hashedPlayerName)
        }        
        // console.log("payload");
        // console.log(payload);
        if (payload.isGuest) {
            collectStats((err, data) => {
                return res.status(200).json({
                    playerTag: payload.playerName,
                    verified: true,
                    totalUsers: data.length,
                    playerId: payload.playerId
                });
            });
        } 
        else {
        
            findByEmail(payload.identifier, function(err, data) {
                var verified = data.verified;
                collectStats((err, data) => {
                    return res.status(200).json({
                        playerTag: payload.playerName,
                        verified: verified,
                        totalUsers: data.length,
                        playerId: payload.playerId
                    });
                });
            });
        }
    });

    app.get('/api/users/:user', function(req, res) {
        var user = req.params.user;

        findByTag(user, (err, data) => {
            if (err || !data) {
                return res.status(404).json({ error: 1, msg: "Could not find user!" });
            }
            else {
                var result = {
                    playerTag: data.playerTag,
                    numberOfGames: data.numberOfGames,
                    numberOfWins: data.numberOfWins,
                    liberals: data.liberals,
                    facists: data.facists,
                    hitler: data.hitler
                };
                return res.status(200).json({ data: result });
            }
        });
    });

    app.post('/api/users/update', withAuth, function(req, res) {
        var token = req.headers.cookie.split("=")[1];
        var decoded = jwt.verify(token, process.env.SECRET);
        var email = decode(decoded.emailhash);

        var formData = req.body;

        updateUserInfo(email, formData, (err, data) => {
            if (err || !data) {
                return res.status(401).json({ error: 1, msg: "Could not update user!" });
            }
            else {
                return res.status(200).json({  playerTag: formData.playerTag });
            }
        });
    });

    app.post('/api/sendVerification', (req, res) => {
        var token = req.headers.cookie.split("=")[1];
        var decoded = jwt.verify(token, process.env.SECRET);
        var email = decode(decoded.emailhash);

        sendEmail(email, generateVerificationToken(email), req);

        return res.status(200).json({ msg: 'success' });
    });

    app.post('/api/verifyEmail/:token', (req, res) => {

        if (!req.params.token) return res.status(401).json({ error: 1, msg: "Token expired or Invalid token!" });

        var data = Buffer(req.params.token, 'base64').toString('ascii').split("/");

        if (verificationTokenValid(data[1], req.params.token)) {
            verifyEmail(data[1], (err, data) => {
                if (err) {
                    return res.status(401).json({ error: 1, msg: "Could not verify email!" });
                }
                else {
                    return res.status(200).json({ msg: data.msg }); 
                }
            });
        }
        else {

            return res.status(401).json({ error: 1, msg: "Token expired or Invalid token!" });
        }
    });

};