var expect = require('chai').expect;
var Student = require('../objects/student');
var Login = require('../objects/login');
var testConfig = require('./config');

describe('Student', function() {
  var student;

  describe('constructor', function() {
    var accountProperties = {
      FirstName: 'Cowboy',
      LastName: 'Texas',
      Partnership_Status__c: 'None',
      Remote__c: true,
      Phone: 8008675309,
      Github__c: 'cowboy123',
      Email: 'cowboy@gmail.com',
      Pace__c: 'Relaxed',
      Overall_Substatus__c: 'Started',
      // fulcrumTuition
      // fulcrum discount amount
      Fulcrum_Status__c: 'Active',
      Sponsorship__c: 'Not Sponsored'
    }

    it('is a function', function() {
      expect(Student).to.be.a('function');
    });
    
    it('does not create a new account and contact if properties are missing', function() {
      accountProperties.Remote__c = null;
      var createFunction = function() {
        var student = new Student(accountProperties);
      }
      expect(createFunction).to.throw(Error);
      accountProperties.Remote__c = true;
    });

    it('creates a new account and contact on creation', function(done) {
      this.timeout(5000);
      Login.login(testConfig)
      .then(function() {
        student = new Student(accountProperties, function(accountId, contactId) {
          expect(accountId.length).to.be.gt(0);
          expect(contactId.length).to.be.gt(0);
          done();
        });
      });
    });

  });

  // describe('update', function() {
  //   it('should not update with invalid properties', function(done) {
  //     var updateFunction = function() {
  //       student.update({Module_X__c: 'Nothing'});
  //     };
  //     expect(updateFunction).to.throw(Error);
  //   });
  // });
});