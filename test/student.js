var expect = require('chai').expect;
var Student = require('../objects/student');
var Connection = require('../objects/connection');
var testConfig = require('./config');
var studentProperties = require('./fixtures').studentProperties;
var timeout = 10000;

describe('Student', function() {
  var _student;
  var contactId;
  var conn;

  before(function(done){
    var connection = new Connection(testConfig.url, testConfig.username, testConfig.password, testConfig.userSecurityToken)
    .then(function(jsforceConnection) {
      expect(jsforceConnection.accessToken.length).to.be.gt(0);
      conn = jsforceConnection;
      done();
    });
  });

  describe('constructor', function() {
    it('is a function', function() {
      expect(Student).to.be.a('function');
    });

    it('creates a new student when not given a ContactID', function(done) {
      this.timeout(timeout);
      new Student(conn, null, studentProperties)
      .then(function(student) {
        // TODO: Set AccountID to constant if it is a generic account
        expect(student.AccountId.length).to.be.gt(0);
        expect(student.Id.length).to.be.gt(0);
        contactId = student.Id;
        _student = student;
        done();
      });
    });

    // TODO: Update with new default properties
    it('creates a student with defaults for properties that are not set', function(done) {
      this.timeout(timeout);
      var phone = studentProperties.MobilePhone;
      delete studentProperties.MobilePhone;

      new Student(conn, null, studentProperties)
      .then(function(student) {
        expect(student.MobilePhone).to.be.eq('0');

        studentProperties.MobilePhone = phone;
        done();
      });
    });

    it('does not create a student when properties are not set', function() {
      this.timeout(timeout);
      var createFunction = function() {
        student = new Student(conn, null, {});
      }
      expect(createFunction).to.throw(Error);
    });

    it('looks up a student when given a ContactID', function(done) {
      this.timeout(timeout);
      new Student(conn, contactId)
      .then(function(student) {
        expect(student.Id.length).to.be.gt(0);
        _student = student;
        done();
      });
    });
  });

  describe('update', function() {
    it('should update when values are valid', function(done) {
      this.timeout(timeout);
      _student.update({FirstName: 'Kyle'})
      .then(function(res) {
        expect(res.success).to.be.true;
        done();
      });
    });
  });

  // WARN Cannot delete accounts, or records.
  // describe('delete', function() {
  //   this.timeout(timeout);
  //   it('should delete the account and record of a student', function(done) {
  //     _student.delete()
  //     .then(function(res) {
  //       expect(res.success).to.be.true;
  //       done();
  //     });
  //   });
  // });

  it('should give a list of all ids', function(done) {
    new Student(conn).all()
    .then(function(records) {
      expect(records).to.be.instanceof(Array);
      done();
    });
  });

  after(function (done) {
    conn.logout(done)
  });
});