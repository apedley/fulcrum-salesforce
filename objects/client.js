var _ = require('underscore')

function client(connection, opts) {
  this._conn = connection;

  return {
    Student: _.partial(require('./fulcrumStudent.js'), this._conn),
  }
}

module.exports = client