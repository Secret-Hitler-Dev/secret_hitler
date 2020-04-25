require('dotenv').config()

var Users = require("../models/User");
const withAuth = require('./middleware');
const bcrypt = require('bcryptjs');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.SECRET);
const jwt = require('jsonwebtoken');


function encode(email) {
    if (!email) return "";
    return cryptr.encrypt(email);
}

function decode(email) {
    if (!email) return "";
    return cryptr.decrypt(email);
}

function createSession(email, req, res, data) {
    var emailhash = encode(email);
    
    const token = jwt.sign({emailhash}, process.env.SECRET, {
        expiresIn: 60*60*100
    });
    return res.cookie('token', token, { httpOnly: true }).status(200).json(data);
}


function killSession(req, res) {
    // kill session
    
    // const token = jwt.sign('invalid', process.env.SECRET, {
    //     expiresIn: 0*60*60*100
    // });
    return res.clearCookie("token").sendStatus(200);
}

function login(err, data, password, req, res) {
    if (!err && data) {
        var user = {
            playerTag: data.playerTag ,
            isAdmin: data.admin
        };
        if (verifyPass(data, password)) return createSession(data.email, req, res, user);
        else res.status(401).json({ error: 0, msg: "Incorrect Password" });
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

function getAll(callback) {
    Users.find({}, callback);
}

function createUser(data, callback) {
    var salt = bcrypt.genSaltSync(15);
    var pass = bcrypt.hashSync(data.password, salt);
    var user = {
        email: data.email,
        playerTag: data.playerTag,
        password: pass,
        admin:false
    };
    Users.create(user, callback);
}

module.exports = function(app) {

    // Authentication
    app.post('/api/signup', (req, res) => {
        var formData = req.body;
        findByEmail(formData.email, (err, data) => {
            if (err || !data) {
                // email doesn't exist we are good
                createUser(formData, (err, data) => {
                    if (err) return res.status(400).json({error: err, msg:"Failed to create user."});
                    else return createSession(formData.email, req, res, {playerTag: formData.playerTag, isAdmin: data.admin});
                });
            } 
            else {
                return res.status(401).json({ error: 0, msg: "Email exists" });
            }
        });
    });

    app.post('/api/signout', (req, res) => {
        return killSession(req, res);
    });

    app.post('/api/signin', (req, res) => {
        const {email, password} = req.body;

        findByEmail(email, (err, data) => {
            return login(err, data, password, req, res);
        });
    });

    app.get('/api/checkToken', withAuth, function(req, res) {
        var token = req.headers.cookie.split("=")[1];
        var decoded = jwt.verify(token, process.env.SECRET);
        var email = decode(decoded.emailhash);
        
        Users.findByEmail(email, function(err, data) {
            res.status(200).json({
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email,
                isAdmin: data.admin,
                id: data._id
            });
        });
    });
};