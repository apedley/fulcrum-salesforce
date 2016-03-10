var Student = require('../objects/student');
var Connection = require('../objects/connection');
var testConfig = require('../test/config')
var _ = require('underscore');


var connection = new Connection(testConfig.url, testConfig.username, testConfig.password, testConfig.userSecurityToken)
.then(function(conn) {
  Student.all(conn)
  .then(function(records) {
    var ids = _.map(records, function(record) {
      return record.Id;
    });
    _.each(ids, function(id) {
      new Student(connection, id)
      .then(function(student){
        student.delete();
      });
    });
  });
});