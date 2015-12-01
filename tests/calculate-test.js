var test = require('tape');
var calculate = require('../src/calculate');

test('Normalize number should round number to closest cents', function (t) {
  t.equal(calculate.normalizeNumber(28.3333), 28.33);
  t.equal(calculate.normalizeNumber(22.857165), 22.86);
  t.end();
});

test('Calculate percentage for company', function (t) {
  t.equal(calculate.companyPercentageSum(100, 15), 15.00);
  t.equal(calculate.companyPercentageSum(86, 15), 12.90);
  t.end();
});

test('Calculate amount of money in the pool', function (t) {
  t.equal(calculate.moneyInPool(100, 15), 85.00);
  t.equal(calculate.moneyInPool(86, 15), 73.10);
  t.end();
});

test('Calculate total sum of winners money in the pool for product', function (t) {
  t.equal(calculate.winnersTotalMoneyInput([1,2,3,4]), 10);
  t.end();
});

test('Calculate steak proportion for winners', function (t) {
  t.equal(calculate.stakeProportion(100, 15, 60), 1.42);
  t.equal(calculate.stakeProportion(86, 15, 60), 1.22);
  t.end();
});

test('Calculate sum for each place in Place product', function (t) {
  t.equal(calculate.sumForPlace(85.00), 28.33);
  t.equal(calculate.sumForPlace(68.56), 22.85);
  t.end();
});
