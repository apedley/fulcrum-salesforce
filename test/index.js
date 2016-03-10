var objects = require('../index');
var expect = require('chai').expect;

describe('objects', function() {
  it('has student', function() {
    expect(objects[0].name).to.equal('student');
    expect(objects[1].name).to.equal('connection');
  });
});