require('dotenv').config()

var Users = require("../models/User");
var Player = require("../models/Player");
var General = require("../models/User");
const withAuth = require('./middleware');
const utils = require("../server-utils");
const bcrypt = require('bcryptjs');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.SECRET);
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
var cookie = require('cookie');

function encode(email) {
    if (!email) return "";
    return cryptr.encrypt(email);
}

function getAll(callback) {
    Users.find({}, callback);
}

function collectStats(callback) {
    getAll(callback);
}

function decode(email) {
    if (!email) return "";
    return cryptr.decrypt(email);
}

function createSession(req, res, data) {
    var payload = {
        // hashedID: encode(identifier),
        isGuest: encode(data.isGuest),
        hashedID: encode(data.playerTag),
        emailHash: encode(data.email),
        // hashedPlayerNickName: encode(data.playerNickName),
        // hashedVerified: encode(data.verified),
        // hashedPassword: data.isGuest ? encode(data.password) : null
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
    return res.clearCookie("token").status(200).json({success:true});;
}

function login(err, data, password, req, res) {
    if (!err && data) {
        var user = {
            playerTag: data.playerTag,
            isGuest: false,
            email: data.email
            // playerNickName: data.playerNickName,
            // verified: data.verified
        };
        if (verifyPass(data, password)) return createSession(req, res, user);
        else res.status(400).json({ error: 0, msg: "Incorrect Password" });
    } 
    else return res.status(400).json({ error: 1, msg: "Email does not exists" });
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

function sendEmail(email, token, req, res) {
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
        if (err) { console.log(err); }
    });
}

function createUser(data, callback) {
    var salt = bcrypt.genSaltSync(15);
    var pass = bcrypt.hashSync(data.password, salt);
    var user = {
        email: data.email,
        playerTag: data.playerTag,
        playerNickName: data.playerTag,
        password: pass
    };
    Users.create(user, callback);
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
    app.post('/api/signup', (req, res) => {
        var formData = req.body;
        if (!formData.email || !formData.playerTag || !formData.password) {
            return res.status(400).json({ error: 1, msg: "Missing fields." });
        }
        else {
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
                                    var userData = {
                                        playerTag: data.playerTag,
                                        isGuest: false,
                                        email: data.email
                                        // playerNickName: data.playerNickName,
                                        // verified: data.verified
                                    }
                                    return createSession(req, res, userData);
                                }
                            });
                        } 
                        else {
                            return res.status(400).json({ error: 1, msg: "Player Tag exists" });
                        }
                    });
                } 
                else {
                    return res.status(400).json({ error: 1, msg: "Email exists" });
                }
                
            });
        }
        
    });

    app.post('/api/playAsGuest', function(req, res) {
        // var salt = bcrypt.genSaltSync(15);
        var newPlayer = {
            playerTag: req.body.playerName,
            isGuest: true,
        };

        Users.findOne({playerTag: newPlayer.playerTag}, (err, player) => {
            if (player) {
                res.status(406)
                .json({
                    status: 'error',
                    data: {},
                    message: "Player Tag " + newPlayer.playerTag + " exists, try another name"
                })
            } else {
                return createSession(req, res, newPlayer);
            }
        }) 
    });

    app.post('/api/playAsGuest', function(req, res) {
        // var salt = bcrypt.genSaltSync(15);
        var newPlayer = {
            playerTag: req.body.playerName,
            isGuest: true,
        };

        Users.findOne({playerTag: newPlayer.playerTag}, (err, player) => {
            if (player) {
                res.status(400)
                .json({
                    status: 'error',
                    data: {},
                    message: "Player Tag " + newPlayer.playerTag + " exists, try another name"
                })
            } else {
                return createSession(req, res, newPlayer);
            }
        }) 
    });

    app.post('/api/signout', (req, res) => {
        // delete player associated with this user
        return killSession(req, res);
    });

    app.post('/api/signin', (req, res) => {
        const formData = req.body;
        if (!formData.email || !formData.password) {
            return res.status(400).json({ error: 1, msg: "Missing fields." });
        }
        else {
            findByEmail(formData.email, (err, data) => {
                return login(err, data, formData.password, req, res);
            });
        }
    });

    app.get('/api/checkToken', withAuth, function(req, res) {
        var cookies = cookie.parse(req.headers.cookie);
        var token = cookies.token;
        var decoded = jwt.verify(token, process.env.SECRET);

        var payload = {
            identifier: decode(decoded.hashedID), // not used in guest case
            isGuest: decode(decoded.isGuest),
            // playerName: decode(decoded.hashedPlayerName),
            // playerNickName: decode(decoded.hashedPlayerNickName),
            // verified: decode(decoded.hashedVerfied),
        }        
        if (payload.isGuest) {
            collectStats((err, data) => {
                return res.status(200).json({
                    playerTag: payload.identifier,
                    playerNickName: payload.identifier,
                    verified: true,
                    totalUsers: data.length,
                    guest: payload.isGuest
                });
            });
        } 
        else {

            findByTag(payload.identifier, function(err, data) {

                collectStats((err, stats) => {
                    return res.status(200).json({
                        playerTag: data.playerTag,
                        playerNickName: data.playerNickName,
                        verified: data.verified,
                        totalUsers: stats.length,
                        guest: false
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
        var cookies = cookie.parse(req.headers.cookie);
        var token = cookies.token;
        var decoded = jwt.verify(token, process.env.SECRET);
        var email = decode(decoded.emailHash);

        var formData = req.body;

        updateUserInfo(email, formData, (err, data) => {
            if (err || !data) {
                return res.status(500).json({ error: 1, msg: "Could not update user!" });
            }
            else {
                return res.status(200).json({  playerTag: formData.playerTag });
            }
        });
    });

    app.post('/api/sendVerification', (req, res) => {
        var cookies = cookie.parse(req.headers.cookie);
        var token = cookies.token;
        var decoded = jwt.verify(token, process.env.SECRET);
        var email = decode(decoded.emailHash);

        sendEmail(email, generateVerificationToken(email), req, res);

        return res.status(200).json({ msg: 'success' });
    });

    app.post('/api/verifyEmail/:token', (req, res) => {

        if (!req.params.token) return res.status(400).json({ error: 1, msg: "Token expired or Invalid token!" });

        var data = Buffer(req.params.token, 'base64').toString('ascii').split("/");

        if (verificationTokenValid(data[1], req.params.token)) {
            verifyEmail(data[1], (err, data) => {
                if (err) {
                    return res.status(500).json({ error: 1, msg: "Could not verify email!" });
                }
                else {
                    return res.status(200).json({ msg: data.msg }); 
                }
            });
        }
        else {

            return res.status(400).json({ error: 1, msg: "Token expired or Invalid token!" });
        }
    });

};