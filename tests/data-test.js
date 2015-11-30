var test = require('tape');
var data = require('../src/data');

test('Should return bet object for a line', function(t){
  t.deepEqual(data.betFromLine("Bet:W:1:3"), {product: 'W', horse: '1', bet: 3} );
  t.end();
});

test('Should return object if line is a bet line', function(t){
  t.deepEqual(data.readBets("Bet:W:1:3"), {product: 'W', horse: '1', bet: 3} );
  t.notOk(data.readBets("Result:2:1:3"), false);
  t.end();
});

test('Should return result object for a line', function(t){
  t.deepEqual(data.resultFromLine("Result:2:1:3"), {firstPlace: '2', secondPlace: '1', thirdPlace: '3'} );
  t.end();
});

test('Should return object if line is a result line', function(t){
  t.deepEqual(data.readResult("Result:2:1:3"), {firstPlace: '2', secondPlace: '1', thirdPlace: '3'} );
  t.notOk(data.readResult("Bet:W:1:3"), false);
  t.end();
});
