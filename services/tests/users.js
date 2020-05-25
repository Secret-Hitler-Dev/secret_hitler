//Require the dev-dependencies
let setup = require('./config/setup');

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let app = require('../server');

var mongoose = require('mongoose');
const dbHandler = require('./controllers/db-handler.js');

//Importing our todo model for our unit testing.
var User = require('../models/User.js');
var userData = require('./data/UsersData.js');

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
                'playerTag': 'robo'
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
                'playerTag': 'robo'
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.should.have.property('msg').eql('Missing fields.');
                done();
            });
    });
    
    // it("should not sign up a User with too few characters in the playerTag", (done) => {
    //     chai.request(app)
    //         .post('/api/signup')
    //         .send({
    //             'email': 'rob@dummy.com',
    //             'password': 'helloguy',
    //             'playerTag': 'rob'
    //         })
    //         .end((err, res) => {
    //             res.should.have.status(400);
    //             res.body.should.be.a('object');
    //             res.body.should.have.property('error');
    //             res.body.should.have.property('msg').to.eql('Player tag needs to be atleast 4 characters long.');
    //             done();
    //         });
    // });

    // it("should not sign up a User with special characters in player tag", (done) => {
    //     chai.request(app)
    //         .post('/api/signup')
    //         .send({
    //             'email': 'rob@dummy.com',
    //             'password': 'helloguy',
    //             'playerTag': 'rob*'
    //         })
    //         .end((err, res) => {
    //             res.should.have.status(400);
    //             res.body.should.be.a('object');
    //             res.body.should.have.property('error');
    //             res.body.should.have.property('msg').to.deep.equal('Player tag cannot contain any special symbols other than _ or -.');
    //             done();
    //         });
    // });

    it("should sign up a new User", (done) => {
        chai.request(app)
            .post('/api/signup')
            .send({
                'email': 'rob@dummy.com',
                'password': '1234',
                'playerTag': 'robo'
            })
            .end((err, res) => {
                
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('playerTag').eql('robo');
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
                'email': 'bobo@dummy.com',
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
                'email': 'bobo@dummy.com',
                'password': '1234'
            })
            .end((err, res) => {
                
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('playerTag').eql('bobo');
                res.body.should.have.property('isGuest').eql(false);
                
                // check cookie
                res.should.have.property('header');
                res.header.should.have.property("set-cookie");
                res.header['set-cookie'].length.should.be.above(0);
                done();
            });
    });        
});

describe("POST /api/signout", () => {

    it("should sign out a User", (done) => {
        chai.request(app)
            .post('/api/signout')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('success').eql(true);
                done();
            });
    });                    
});

describe("POST /api/playAsGuest", () => {

    it('should deny taken playerTag', (done) => {
        chai.request(app)
            .post('/api/playAsGuest')
            .send({
                'playerName' : 'bobo' 
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.a('object');
                res.body.should.have.property('status');
                res.body.should.have.property('message').eql('Player Tag bobo exists, try another name')
                done();
            });
    });

    it('should create create session', (done) => {
        chai.request(app)
        .post('/api/playAsGuest')
        .send({
            'playerName': 'totallyUnique'
        })
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.a('object');
            res.body.should.have.property('playerTag').eql('totallyUnique');
            res.body.should.have.property('isGuest').eql(true);

            // check cookie
            res.should.have.property('header');
            res.header.should.have.property("set-cookie");
            res.header['set-cookie'].length.should.be.above(0);
            done();
        });
    });
});
