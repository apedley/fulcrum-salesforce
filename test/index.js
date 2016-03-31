var objects = require('../index');
var expect = require('chai').expect;

describe('objects', function() {
  it('has student', function() {
    expect(objects.Student.name).to.equal('student');
    expect(objects.Connection.name).to.equal('connection');
  });
  it('has applicant', function() {
    expect(objects.Applicant.name).to.equal('Applicant');
    expect(objects.Connection.name).to.equal('connection');
  });
});