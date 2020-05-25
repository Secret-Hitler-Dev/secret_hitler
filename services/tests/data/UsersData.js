const bcrypt = require('bcryptjs');
require('dotenv').config({path:__dirname+'/./../../.env'});

console.log(process.env);

function newUser(email, playerTag, password) {
    var salt = bcrypt.genSaltSync(15);
    var pass = bcrypt.hashSync(password, salt);
    return {
        email: email,
        playerTag: playerTag,
        playerNickName: playerTag,
        password: pass
    };
}

const Users = [
    newUser("bobo@dummy.com", "bobo", "1234"),
    newUser("tomo@dummy.com", "tomo", "4567"),
    newUser("jane@dummy.com", "jane", "2345"),
    newUser("mary@dummy.com", "mary", "6789"),
    newUser("alice@dummy.com", "alice", "1357")
];
 
module.exports = Users;