var expect = require('chai').expect
var Applicant = require('../objects/applicant')
var Connection = require('../objects/connection')
var testConfig = require('./config')
var applicantProperties = require('./fixtures').applicantProperties
var timeout = 10000;

describe('Applicant', function() {
  var _applicant
  var contactId
  var conn

  // Login before anything else
  before(function(done){
    this.timeout(timeout)      
  
    var connection = new Connection(testConfig.url, testConfig.username, testConfig.password, testConfig.userSecurityToken)
    .then(function(jsforceConnection) {
      expect(jsforceConnection.accessToken.length).to.be.gt(0)
      conn = jsforceConnection
      done()
    })
  })
  after(function (done) {
    this.timeout(timeout)      

    conn.logout(done)
  })

  describe('constructor', function() {
    it('is a function', function() {
      expect(Applicant).to.be.a('function')
    })

    it('creates a new applicant when not given a ContactID', function(done) {
      this.timeout(timeout)
      new Applicant(conn, null, applicantProperties)
        .then(function(applicant) {
          // TODO: Set AccountID to constant if it is a generic account
          expect(applicant.AccountId.length).to.be.gt(0)
          expect(applicant.Id.length).to.be.gt(0)
          expect(applicant.MobilePhone).to.equal(''+applicantProperties.MobilePhone)
          expect(applicant.FirstName).to.equal(applicantProperties.FirstName)
          expect(applicant.LastName).to.equal(applicantProperties.LastName)
          expect(applicant.LastName).to.equal(applicantProperties.LastName)
          expect(applicant.HROS_Application_Status__c).to.equal("New")
          expect(applicant.MKS_LA_Application_Status__c).to.equal("New")
          contactId = applicant.Id
          _applicant = applicant
          done()
        })
    })

    it('creates a applicant with defaults for properties that are not set', function(done) {
      this.timeout(timeout)
      var phone = applicantProperties.MobilePhone
      delete applicantProperties.MobilePhone

      new Applicant(conn, null, applicantProperties)
        .then(function(applicant) {
          expect(applicant.MobilePhone).to.be.eq('0')

          applicantProperties.MobilePhone = phone
          done()
        })
    })

    it('does not create an application when not interested in any schools', function() {
      this.timeout(timeout)
      
      var newApplicant = applicantProperties
      var schools = newApplicant.Schools
      delete newApplicant.Schools
      var createFunction = function() {
        applicant = new Applicant(conn, null, newApplicant)
      }
      expect(createFunction).to.throw(Error)
      applicantProperties.Schools = schools
    })

    it('does not create a applicant when properties are not set', function() {
      var createFunction = function() {
        applicant = new Applicant(conn, null, {})
      }
      expect(createFunction).to.throw(Error)
    })

    it('looks up a applicant when given a ContactID', function(done) {
      this.timeout(timeout)
      
      new Applicant(conn, contactId)
      .then(function(applicant) {
        expect(applicant.Id.length).to.be.gt(0)
        _applicant = applicant
        done()
      })
    })
  })
  describe('getIdByEmail', function() {
    it('should find the contacy by email', function(done) {
      this.timeout(timeout);
      _applicant.getIdByEmail('cowboy@gmail.com')
        .then(function(res) {
          _applicant.find(res[0].Id)
            .then(function(result){
              expect(result.Email).to.equal('cowboy@gmail.com')
              done();
            })
        })
    })
  })

  describe('update', function() {
    it('should update when values are valid', function(done) {
      this.timeout(timeout)      
      _applicant.update({FirstName: 'Kyle'})
      .then(function(res) {
        expect(res.success).to.be.true
        done()
      })
    })
    it('should add new schools without overwriting existing schools', function (done) {
      this.timeout(timeout)      
      
      _applicant.update({Schools: ['MKS_SF']})
        .then(function(res) {
         expect(res.success).to.be.true
          _applicant.find(res.id).then(function(found) {
            expect(found.HROS_Application_Status__c).to.equal('New')
            expect(found.MKS_LA_Application_Status__c).to.equal('New')
            done()
          })
      })
    })
    it('should not change the value of schools on irrelevant updates', function (done) {
      this.timeout(timeout)      
      _applicant.update({FirstName: 'Kyle'})
        .then(function(res) {
         expect(res.success).to.be.true
          _applicant.find(res.id).then(function(found) {
            expect(found.HROS_Application_Status__c).to.equal('New')
            done()
          })
      })
    })
  })

  it('should give a list of all ids', function(done) {
    this.timeout(timeout)      
    new Applicant(conn).all()
    .then(function(records) {
      expect(records).to.be.instanceof(Array)
      done()
    })
  })

})