var expect = require('chai').expect;
var Student = require('../objects/student');
var Login = require('../objects/login');
var testConfig = require('./config');
var studentProperties = require('./fixtures').studentProperties;

describe('Student', function() {
  var student;
  // Login before anything else
  before(function(done){
    Login.login(testConfig)
    .then(function() {
      done();
    });
  });

  describe('constructor', function() {

    var CONTACT_ID = '003P000000hOGtQIAW';
    var contactId;

    it('is a function', function() {
      expect(Student).to.be.a('function');
    });

    it('does not create a new account and contact if properties are missing', function() {
      studentProperties.Remote__c = null;
      var createFunction = function() {
        var student = new Student(null, studentProperties, function(){});
      }
      expect(createFunction).to.throw(Error);
      studentProperties.Remote__c = true;
    });

    it('creates a new account and contact on creation', function(done) {
      this.timeout(5000);
      Login.login(testConfig)
      .then(function() {
        student = new Student(null, studentProperties, function(account, contact) {
          expect(account.length).to.be.gt(0);
          expect(contact.length).to.be.gt(0);
          contactId = contact;
          done();
        });
      });
    });
    it('looks up a student if an ID is given', function(done) {
      student = new Student(contactId, {}, function(error, student) {
        expect(error).to.be.null;
        expect(student.Email.length).to.be.gt(0);
        expect(student.Remote__c).to.not.be.null;
        done();
      });
    });
  });

  describe('delete', function() {
    it('should delete the account and record of a student', function(done) {
      
    });
  })

  xdescribe('update', function() {
    it('should not update with invalid properties', function(done) {
      var updateFunction = function() {
        student.update({Module_X__c: 'Nothing'});
      };
      expect(updateFunction).to.throw(Error);
    });
  });
});