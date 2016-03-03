var expect = require('chai').expect;
var Student = require('../objects/student');
var Login = require('../objects/login');
var testConfig = require('./config');

describe('Student', function() {
  var student;

  describe('constructor', function() {
    var accountProperties = {
      firstName: 'Cowboy',
      lastName: 'Texas',
      partnershipStatus: 'None',
      remote: true,
      phone: 8008675309
    }

    it('is a function', function() {
      expect(Student).to.be.a('function');
    });
    
    it('does not create a new account and contact if properties are missing', function() {
      accountProperties.remote = null;
      var createFunction = function() {
        var student = new Student(accountProperties);
      }
      expect(createFunction).to.throw(Error);
      accountProperties.remote = true;
    });

    it('creates a new account and contact on creation', function(done) {
      this.timeout(5000);
      Login.login(testConfig)
      .then(function() {
        student = new Student(accountProperties, function(id) {
          expect(id.length).to.be.gt(0);
          done();
        });
      });
    });
  });
});