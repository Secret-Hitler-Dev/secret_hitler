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

chai.use(chaiHttp);

before(async () => {  
    await dbHandler.connect();
});

beforeEach(async () => {  
    userData.forEach(user => {
        User.create(user, (err, data) => {
            should.equal(err, null);
        });
    });
});

afterEach(async () => {  
    await dbHandler.clearDatabase();
});

after(async () => {  
    await dbHandler.closeDatabase();
});


describe("POST /api/signup", () => {

    it("should not sign up a new User without email", (done) => {
        chai.request(app)
            .post('/api/signup')
            .send({
                'password': '1234',
                'playerTag': 'rob'
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.should.have.property('msg').eql('Missing fields.');
                done();
            });
    });        

    it("should not sign up a new User without playerTag", (done) => {
        chai.request(app)
            .post('/api/signup')
            .send({
                'password': '1234',
                'email': 'rob@dummy.com'
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.should.have.property('msg').eql('Missing fields.');
                done();
            });
    });        

    it("should not sign up a new User without password", (done) => {
        chai.request(app)
            .post('/api/signup')
            .send({
                'email': 'rob@dummy.com',
                'playerTag': 'rob'
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.should.have.property('msg').eql('Missing fields.');
                done();
            });
    });     

    it("should sign up a new User", (done) => {
        chai.request(app)
            .post('/api/signup')
            .send({
                'email': 'rob@dummy.com',
                'password': '1234',
                'playerTag': 'rob'
            })
            .end((err, res) => {
                
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('playerTag').eql('rob');
                res.body.should.have.property('isGuest').eql(false);
                
                // check cookie
                res.should.have.property('header');
                res.header.should.have.property("set-cookie");
                res.header['set-cookie'].length.should.be.above(0);
                done();
            });
    });        
});

describe("POST /api/signin", () => {

    it("should not sign in a User without email", (done) => {
        chai.request(app)
            .post('/api/signin')
            .send({
                'password': '1234',
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.should.have.property('msg').eql('Missing fields.');
                done();
            });
    });             

    it("should not sign in a User without password", (done) => {
        chai.request(app)
            .post('/api/signin')
            .send({
                'email': 'rob@dummy.com',
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.should.have.property('msg').eql('Missing fields.');
                done();
            });
    });     

    it("should not sign in a User with invalid email", (done) => {
        chai.request(app)
            .post('/api/signin')
            .send({
                'email': 'bob1234@dummy.com',
                'password': '1234'
            })
            .end((err, res) => {
                console.log("RES", res);
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.should.have.property('msg').eql('Email does not exists');
                done();
            });
    });        

    it("should sign in a User with invalid password", (done) => {
        chai.request(app)
            .post('/api/signin')
            .send({
                'email': 'bob@dummy.com',
                'password': '12345678'
            })
            .end((err, res) => {
                
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.should.have.property('msg').eql('Incorrect Password');
                done();
            });
    });        

    it("should sign in a User", (done) => {
        chai.request(app)
            .post('/api/signin')
            .send({
                'email': 'bob@dummy.com',
                'password': '1234'
            })
            .end((err, res) => {
                
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('playerTag').eql('rob');
                res.body.should.have.property('isGuest').eql(false);
                
                // check cookie
                res.should.have.property('header');
                res.header.should.have.property("set-cookie");
                res.header['set-cookie'].length.should.be.above(0);
                done();
            });
    });        
});