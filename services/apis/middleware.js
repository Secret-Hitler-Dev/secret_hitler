require('dotenv').config()
const jwt = require('jsonwebtoken');

const secret = process.env.SECRET;

const withAuth = function(req, res, next) {
    const token =
        req.body.token ||
        req.query.token ||
        req.headers['x-access-token'] ||
        req.cookies.token;

    if (!token) {
        res.status(401).json({error: 'Unauthorized: Invalid token'});
    } else {
        jwt.verify(token, secret, function(err, decoded) {
            if (err) {
                res.status(401).json({error: 'Unauthorized: Invalid token'});
            } else {
                req.hashedID = decoded.hashedID;
                next();
            }
        });
    }
}
module.exports = withAuth;