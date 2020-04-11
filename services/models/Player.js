require('dotenv').config()
var mongoose = require('mongoose');
var User = require('./User.js')
let db = mongoose.connection;
db.once('open', () => console.log('connected to the database'));
// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const Schema = mongoose.Schema;

/**
 * Player Schema
 */
var playerSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        unique: false
    },
    playerName: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    team: {
        type: String,
        enum: ["fascist", "liberal"],
        default : "fascist"
    },
    isHitler:  {
        type: Boolean,
        default: false
    },
    // I don't know if this field is necessary
    currentAction: {
        type: String,
        enum: ["Idle",
         "Choosing Chancellor",
          "Discarding Policy",
           "Choosing Policy",
           "Requesting Veto",
           "Accepting Veto",
           "Revealing Top Cards",
           "Choosing Player to Kill"
        ],
        default: "Idle"
    },
    isAlive: {
        type: Boolean,
        default: true
    }
},
{ timestamps: true });

module.exports = mongoose.model('Player', playerSchema);
