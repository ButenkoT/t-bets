var test = require('tape');
var calculate = require('../src/calculate');

test('Calculate percentage for company', function(t) {
  t.ok(calculate.percentage instanceof Function, 'should be function');
  t.end();
});
