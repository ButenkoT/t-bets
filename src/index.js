var fs = require('fs');
var data = require('./data');
var calculate = require('./calculate');
var config = require('../config.json');

var myData = fs.readFileSync('./betsInput.txt', 'utf-8').split('\n');


function processInput(inputData) {

  var bets = data.getBets(inputData);
  var result = data.getResult(inputData);

  return bets.reduce(function (out, bet) {

    if (bet.product === config.win) {
      out.win = win(bet, out.win.sum, out.win.winners, result);
      return out;
    }

    if (bet.product === config.place) {

      out.place.sum = out.place.sum + bet.bet;

      if (bet.horse === result.firstPlace) {
        out.place.firstWinners.push(bet.bet)
      }
      if (bet.horse === result.secondPlace) {
        out.place.secondWinners.push(bet.bet)
      }
      if (bet.horse === result.thirdPlace) {
        out.place.thirdWinners.push(bet.bet)
      }

      return out;
    }

    if (bet.product === config.exacta) {
      out.exacta = exacta(bet, out.exacta.sum, out.exacta.winners, result);
      return out;
    }
  }, {
    win: {sum: 0, winners: []},
    place: {sum: 0, firstWinners: [], secondWinners: [], thirdWinners: []},
    exacta: {sum: 0, winners: []}
  });
}

function exacta(bet, sum, winners, result) {

  return {
    sum: sum + bet.bet,
    winners: (bet.horse[0] === result.firstPlace || bet.horse[1] === result.secondPlace)
      ? winners.concat([bet.bet]) : winners
  };
}

function win(bet, sum, winners, result) {

  return {
    sum: sum + bet.bet,
    winners: (bet.horse === result.firstPlace) ? winners.concat([bet.bet]) : winners
  };
}

function formatWin(winNum, result) {
  return 'Win:' + result.firstPlace + ':$' + winNum;
}

function formatPlace(placeNum, result) {
  return 'Place:' + result + ':$' + placeNum;
}

function formatExacta(exactaNum, result) {
  return 'Exacta:' + result.firstPlace + ',' + result.secondPlace + ':$' + exactaNum;
}

function bettingHost(myInput) {
  var out = processInput(myInput);
  console.log(out);
  var result = data.getResult(myInput);

  var winSumSteak = calculate.winnersTotalMoneyInput(out.win.winners);
  var exactaSumSteak = calculate.winnersTotalMoneyInput(out.exacta.winners);
  var place1SumSteak = calculate.winnersTotalMoneyInput(out.place.firstWinners);
  var place2SumSteak = calculate.winnersTotalMoneyInput(out.place.secondWinners);
  var place3SumSteak = calculate.winnersTotalMoneyInput(out.place.thirdWinners);

  var win = calculate.stakeProportion(out.win.sum, config.winPercent, winSumSteak);
  var exacta = calculate.stakeProportion(out.exacta.sum, config.exactaPercent, exactaSumSteak);
  var place1 = calculate.stakeProportion(calculate.sumForPlace(out.place.sum), config.placePercent, place1SumSteak);
  var place2 = calculate.stakeProportion(calculate.sumForPlace(out.place.sum), config.placePercent, place2SumSteak);
  var place3 = calculate.stakeProportion(calculate.sumForPlace(out.place.sum), config.placePercent, place3SumSteak);

  console.log(formatWin(win, result));
  console.log(formatPlace(place1, result.firstPlace));
  console.log(formatPlace(place2, result.secondPlace));
  console.log(formatPlace(place3, result.thirdPlace));
  console.log(formatExacta(exacta, result));

}

bettingHost(myData);
