var through = require('through2');
var format = require('util').format;
var buildArray = require('build-array');

var header = function(row) {
  var names = Object.keys(row).map(function(key) {
    return format('| %s ', key);
  });

  var line = names.map(function(name) {
    var line = buildArray(name.length).map(function() {
      return '-';
    });

    line[0] = '|';
    line[1] = ':';
    line[line.length - 1] = ':'

    return line.join('');
  });

  names.push('|');
  line.push('|');

  return [names.join(''), line.join('')].join('\n').concat('\n');
};

var line = function(row) {
  var line = Object.keys(row).map(function(key) {
    return format('| %s ', row[key]);
  });

  line.push('|');

  return line.join('').concat('\n');
};

module.exports = function() {
  var first = true;

  return through.obj(function(row, enc, fn) {
    if (first) {
      first = false;
      this.push(header(row));
    }

    fn(null, line(row));
  });
};

module.exports.thunk = function(row) {
  return header(row).concat(line(row));
};