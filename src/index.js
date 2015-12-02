var fs = require('fs');
var data = require('./data');
var calculate = require('./calculate');
var config = require('../config.json');

var myData = fs.readFileSync(process.argv[2] || './betsInput.txt', 'utf-8').split('\n');


function processInput(bets, result) {

  return bets.reduce(function (out, bet) {

    if (bet.product === config.win) {
      out.win = win(bet, out.win.sum, out.win.winners, result);
      return out;
    }

    if (bet.product === config.place) {

      out.place = place(bet, out.place.sum, out.place.firstWinners, out.place.secondWinners, out.place.thirdWinners, result);
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
  var horse = bet.horse.split(",");

  return {
    sum: sum + bet.bet,
    winners: (horse[0] === result.firstPlace && horse[1] === result.secondPlace)
      ? winners.concat([bet.bet]) : winners
  };
}

function place(bet, sum, fWinners, sWinners, tWinners, result) {

  return {
    sum: sum + bet.bet,
    firstWinners: (bet.horse === result.firstPlace) ? fWinners.concat([bet.bet]) : fWinners,
    secondWinners: (bet.horse === result.secondPlace) ? sWinners.concat([bet.bet]) : sWinners,
    thirdWinners: (bet.horse === result.thirdPlace) ? tWinners.concat([bet.bet]) : tWinners
  };
}

function win(bet, sum, winners, result) {

  return {
    sum: sum + bet.bet,
    winners: (bet.horse === result.firstPlace) ? winners.concat([bet.bet]) : winners
  };
}

function formatWin(winStake, result) {
  return 'Win:' + result.firstPlace + ':$' + winStake;
}

function formatPlace(placeStake, result) {
  return 'Place:' + result + ':$' + placeStake;
}

function formatExacta(exactaStake, result) {
  return 'Exacta:' + result.firstPlace + ',' + result.secondPlace + ':$' + exactaStake;
}

function bettingHost(myInput) {
  var bets = data.getBets(myInput);
  var result = data.getResult(myInput);
  var out = processInput(bets, result);
  //console.log(out);

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

exports.win = win;
exports.place = place;
exports.exacta = exacta;
exports.processInput = processInput;
