var test = require('tape');
var data = require('../src/data');

test('Should return bet object for a line', function (t) {
  t.deepEqual(data.betFromLine("Bet:W:1:3"), {product: 'W', horse: '1', bet: 3});
  t.end();
});

test('Should return object if line is a bet line', function (t) {
  t.deepEqual(data.readBets("Bet:W:1:3"), {product: 'W', horse: '1', bet: 3});
  t.notOk(data.readBets("Result:2:1:3"), false);
  t.end();
});

test('Should return array of bets from the input', function (t) {
  t.deepEqual(data.getBets(["Bet:W:1:3", "Bet:W:2:10", "Result:2:1:3"]), [{
    product: 'W',
    horse: '1',
    bet: 3
  }, {
    product: 'W',
    horse: '2',
    bet: 10
  }]);
  t.end();
});

test('Should return result object for a line', function (t) {
  t.deepEqual(data.resultFromLine("Result:2:1:3"), {
    firstPlace: '2',
    secondPlace: '1',
    thirdPlace: '3'
  });
  t.end();
});

test('Should return object if line is a result line', function (t) {
  t.deepEqual(data.readResult("Result:2:1:3"), {
    firstPlace: '2',
    secondPlace: '1',
    thirdPlace: '3'
  });
  t.notOk(data.readResult("Bet:W:1:3"), false);
  t.end();
});

test('Should return result object from the input', function (t) {
  t.deepEqual(data.getResult(["Bet:W:1:3", "Bet:W:2:10", "Result:2:1:3"]), {
    firstPlace: '2',
    secondPlace: '1',
    thirdPlace: '3'
  });
  t.end();
});

test('Should return win object for a win input', function (t) {
  t.deepEqual(data.win({product: 'W', horse: '1', bet: 3}, 0, [], {
    firstPlace: '2',
    secondPlace: '1',
    thirdPlace: '3'
  }), {sum: 3, winners: []}, 'win: case loose');
  t.deepEqual(data.win({product: 'W', horse: '2', bet: 5}, 0, [], {
    firstPlace: '2',
    secondPlace: '1',
    thirdPlace: '3'
  }), {sum: 5, winners: [5]}, 'win: case wins');
  t.end();
});

test('Should return place object for a place input', function (t) {
  t.deepEqual(data.place({product: 'P', horse: '1', bet: 3}, 0, [], [], [], {
    firstPlace: '2',
    secondPlace: '1',
    thirdPlace: '3'
  }), {
    sum: 3,
    firstWinners: [],
    secondWinners: [3],
    thirdWinners: []
  }, 'pool: case second place wins');
  t.deepEqual(data.place({product: 'P', horse: '2', bet: 10}, 0, [], [], [], {
    firstPlace: '2',
    secondPlace: '1',
    thirdPlace: '3'
  }), {
    sum: 10,
    firstWinners: [10],
    secondWinners: [],
    thirdWinners: []
  }, 'pool: case first place wins');
  t.deepEqual(data.place({product: 'P', horse: '4', bet: 5}, 0, [], [], [], {
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
  t.deepEqual(data.exacta({product: 'E', horse: '2,1', bet: 3}, 0, [], {
    firstPlace: '2',
    secondPlace: '1',
    thirdPlace: '3'
  }), {sum: 3, winners: [3]}, 'exacta: case wins');
  t.deepEqual(data.exacta({product: 'E', horse: '2,3', bet: 5}, 0, [], {
    firstPlace: '2',
    secondPlace: '1',
    thirdPlace: '3'
  }), {sum: 5, winners: []}, 'exacta: case loose');
  t.end();
});

test('Should return right product win sums and winners', function (t) {
  t.deepEqual(data.processInput(([
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

test('Should return right dividents output for all types of bets and winners', function (t) {
  t.deepEqual(data.bettingHost([
      'Bet:W:1:3',
      'Bet:W:2:4',
      'Bet:W:3:5',
      'Bet:W:4:5',
      'Bet:P:1:3',
      'Bet:P:2:8',
      'Bet:P:3:2',
      'Bet:P:4:2',
      'Bet:P:1:4',
      'Bet:E:1,2:1',
      'Bet:E:2,3:9',
      'Bet:E:1,3:8',
      'Result:2:3:1'
    ]), {
      win: 'Win:2:$3.61',
      place1: 'Place:2:$0.7',
      place2: 'Place:3:$2.79',
      place3: 'Place:1:$0.8',
      exacta: 'Exacta:2,3:$1.64'
    }
  );
  t.end();
});
