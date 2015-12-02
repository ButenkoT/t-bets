var test = require('tape');
var index = require('../src/index');

test('Should return win object for a win input', function (t) {
  t.deepEqual(index.win({product: 'W', horse: '1', bet: 3}, 0, [], {
    firstPlace: '2',
    secondPlace: '1',
    thirdPlace: '3'
  }), {sum: 3, winners: []}, 'win: case loose');
  t.deepEqual(index.win({product: 'W', horse: '2', bet: 5}, 0, [], {
    firstPlace: '2',
    secondPlace: '1',
    thirdPlace: '3'
  }), {sum: 5, winners: [5]}, 'win: case wins');
  t.end();
});

test('Should return place object for a place input', function (t) {
  t.deepEqual(index.place({product: 'P', horse: '1', bet: 3}, 0, [], [], [], {
    firstPlace: '2',
    secondPlace: '1',
    thirdPlace: '3'
  }), {
    sum: 3,
    firstWinners: [],
    secondWinners: [3],
    thirdWinners: []
  }, 'pool: case second place wins');
  t.deepEqual(index.place({product: 'P', horse: '2', bet: 10}, 0, [], [], [], {
    firstPlace: '2',
    secondPlace: '1',
    thirdPlace: '3'
  }), {
    sum: 10,
    firstWinners: [10],
    secondWinners: [],
    thirdWinners: []
  }, 'pool: case first place wins');
  t.deepEqual(index.place({product: 'P', horse: '4', bet: 5}, 0, [], [], [], {
    firstPlace: '2',
    secondPlace: '1',
    thirdPlace: '3'
  }), {
    sum: 5,
    firstWinners: [],
    secondWinners: [],
    thirdWinners: []
  }, 'pool: case loose');
  t.end();
});

test('Should return exacta object for an exacta input', function (t) {
  t.deepEqual(index.exacta({product: 'E', horse: '2,1', bet: 3}, 0, [], {
    firstPlace: '2',
    secondPlace: '1',
    thirdPlace: '3'
  }), {sum: 3, winners: [3]}, 'exacta: case wins');
  t.deepEqual(index.exacta({product: 'E', horse: '2,3', bet: 5}, 0, [], {
    firstPlace: '2',
    secondPlace: '1',
    thirdPlace: '3'
  }), {sum: 5, winners: []}, 'exacta: case loose');
  t.end();
});

test('Should return right product win sums and winners', function (t) {
  t.deepEqual(index.processInput(([
      {product: 'W', horse: '1', bet: 3},
      {product: 'W', horse: '2', bet: 4},
      {product: 'W', horse: '2', bet: 5},
      {product: 'W', horse: '4', bet: 5},
      {product: 'P', horse: '1', bet: 2},
      {product: 'P', horse: '2', bet: 3},
      {product: 'P', horse: '3', bet: 4},
      {product: 'P', horse: '4', bet: 5},
      {product: 'E', horse: '1,2', bet: 5},
      {product: 'E', horse: '2,3', bet: 5}
    ]), {
      firstPlace: '2',
      secondPlace: '1',
      thirdPlace: '3'
    }), {
      win: {sum: 17, winners: [4, 5]},
      place: {
        sum: 14,
        firstWinners: [3],
        secondWinners: [2],
        thirdWinners: [4]
      },
      exacta: {
        sum: 10, winners: []
      }
    }
  );
  t.end();
});
