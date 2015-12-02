var test = require('tape');
var index = require('../src/index');

test('Should return win object for a win input', function (t) {
  t.deepEqual(index.win({product: 'W', horse: '1', bet: 3}, 0, [3], {firstPlace: '2', secondPlace: '1', thirdPlace: '3'}), {sum: 3, winners: [3]});
  t.end();
});

test('Should return place object for a place input', function (t) {
  t.deepEqual(index.place({product: 'P', horse: '1', bet: 3}, 0, [], [], [], {firstPlace: '2', secondPlace: '1', thirdPlace: '3'}), {sum: 3, firstWinners: [], secondWinners: [3], thirdWinners: []});
  t.end();
});

test('Should return exacta object for an exacta input', function (t) {
  t.deepEqual(index.exacta({product: 'E', horse: '2,1', bet: 3}, 0, [], {firstPlace: '2', secondPlace: '1', thirdPlace: '3'}), {sum: 3, winners: [3]});
  t.deepEqual(index.exacta({product: 'E', horse: '2,3', bet: 5}, 0, [], {firstPlace: '2', secondPlace: '1', thirdPlace: '3'}), {sum: 5, winners: []});
  t.end();
});
