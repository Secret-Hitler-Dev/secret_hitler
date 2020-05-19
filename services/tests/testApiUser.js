//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let app = require('../server');

var mongoose = require('mongoose');
const dbHandler = require('./controllers/db-handler.js');

//Importing our todo model for our unit testing.
var User = require('../models/User.js');
var userData = require('./data/Users.js');

before(async () => {  
    await dbHandler.connect();
});

beforeEach(async () => {  
    userData.forEach(user => {
        User.create(user, (err) => {
            done();
        });
    });
});

afterEach(async () => {  
    await dbHandler.clearDatabase();
});

after(async () => {  
    await dbHandler.closeDatabase();
});


describe("GET /", () => {
    // Test fail sign up a new User
    it("should sign up a new User", (done) => {
        chai.request(app)
            .post('/signup')
            .send({
                'password': '1234',
                'playerTag': 'rob'
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('email');
                res.body.errors.pages.should.have.property('kind').eql('required');
                done();
            });
    });        
});