require('dotenv').config()
var mongoose = require('mongoose');
var Player = require("./Player.js")
let db = mongoose.connection;
db.once('open', () => console.log('connected to the database'));
// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const Schema = mongoose.Schema;

/**
 * Game Schema
 */
var gameSchema = new Schema({
    // a small readable code that non-hosting players an use to join the game.
    code: {
        type: String,
        unique: true,
        required: true
    },
    players:  [{
        type: Schema.Types.ObjectId,
        ref: 'Player'}],
    numPlayers: {
        type: Number,
        min: 1,
        max: 10,
        default: 1
    },
    liberalPoliciesEnacted: {
        type: Number,
        default: 0
    },
    fascistPoliciesEnacted: {
        type: Number,
        default: 0
    },
    electionFailureCount: {
        type: Number,
        min: 0,
        max: 3,
        default: 0
    },
    president: {
        type: Schema.Types.ObjectId,
        ref: 'Player'
    },
    chancellor: {
        type: Schema.Types.ObjectId,
        ref: 'Player'
    },
    currentPlayer: {
        type: Schema.Types.ObjectId,
        ref: 'Player'
    },
    presidentPower: {
        type: String,
        enum: ["None", "Investigate", "Inspect Cards", "Kill", "Veto"],
        default: "None"
    }
},
{ timestamps: true });

module.exports = mongoose.model('Game', gameSchema);