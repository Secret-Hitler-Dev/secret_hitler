const request = require('request-promise');
var Users = require("./models/User");
const bcrypt = require('bcryptjs');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.SECRET);
const jwt = require('jsonwebtoken');


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

module.exports = {
    postRequest: async (endpoint, body) => {
        console.log(body);
        let options = {
            method: 'POST',
            uri: 'http://localhost:8080' + endpoint,
            body: body,
            json: true
        };
        console.log(options);
        var res;
        await request(options)
        .then(response => {
            res = response;
        })
        .catch(err => {
            res = err;
        });
        return res;
        
    },

    
    createSession: (identifier, req, res, data) => {
        console.log("identifier:")
        console.log(identifier);
        var hashedID = encode(identifier);
        console.log("data:")
        console.log(data);
        console.log("hashedID:")
        console.log(hashedID);
        const token = jwt.sign({hashedID}, process.env.SECRET, {
            expiresIn: 60*60*100
        });
    
        collectStats((err, d) => {
            console.log("HEREEE");
            data.totalUsers = d.length;
            return res.cookie('token', token, { httpOnly: true }).status(200).json(data);
        });
        
    },
    
    killSession: (req, res) => {
        return res.clearCookie("token").sendStatus(200);
    }
};