function normalizeNumber(num) {
  return parseFloat((num).toFixed(2));
}

function companyPercentageSum(sum, percent) {
  return normalizeNumber((percent / 100) * sum);
}

function moneyInPool(sum, percent) {
  return sum - companyPercentageSum(sum, percent);
}

function winnersTotalMoneyInput(winners) {
  return winners.reduce(function (previousValue, currentValue) {
    return previousValue + currentValue;
  });
}

function stakeProportion(sum, percent, winnerSteak) {
  return normalizeNumber(moneyInPool(sum, percent) / winnerSteak);
}

function sumForPlace(sum) {
  return normalizeNumber(sum / 3);
}

exports.normalizeNumber = normalizeNumber;
exports.companyPercentageSum = companyPercentageSum;
exports.moneyInPool = moneyInPool;
exports.winnersTotalMoneyInput = winnersTotalMoneyInput;
exports.stakeProportion = stakeProportion;
exports.sumForPlace = sumForPlace;
