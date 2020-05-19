var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;

var mongoose = require('mongoose');
require('sinon-mongoose');

//Importing our todo model for our unit testing.
var User = require('../models/User.js');

describe("Get all Users", function(){
    // Test will pass if we get all Users
    it("should return all Users", function(done){
        var UserMock = sinon.mock(User);
        var expectedResult = {status: true, user: []};
        UserMock.expects('find').yields(null, expectedResult);
        User.find(function (err, result) {
            UserMock.verify();
            UserMock.restore();
            expect(result.status).to.be.true;
            done();
        });
    });

    // Test will pass if we fail to get a todo
    it("should return error", function(done){
        var UserMock = sinon.mock(User);
        var expectedResult = {status: false, error: "Something went wrong"};
        UserMock.expects('find').yields(expectedResult, null);
        User.find(function (err, result) {
            UserMock.verify();
            UserMock.restore();
            expect(err.status).to.not.be.true;
            done();
        });
    });
});