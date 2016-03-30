
function curry (fn) {
  var args = [];
  return function _instantCurry (varidic) {
    var moreArgs = Array.prototype.slice.call(arguments);
    args = args.concat(moreArgs);
    if (args.length >= fn.length) {
      fn.apply(this, args);
    }
  }
}

function client(connection, opts) {
  this._conn = connection;

  return {
    Student: curry(require('./fulcrumStudent.js')(this)),
  }
}

module.exports = client