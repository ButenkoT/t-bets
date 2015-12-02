var calculate = require('./calculate');
var config = require('../config.json');

function betFromLine(line) {
  var arrayLine = line.split(':');
  return {
    product: arrayLine[1],
    horse: arrayLine[2],
    bet: parseInt(arrayLine[3], 10)
  }
}

function readBets(line) {
  if (RegExp(/^(Bet)/).test(line)) {
    return betFromLine(line);
  }
  return false;
}

function getBets(input) {
  return input.slice(0, input.length - 1).map(readBets);
}

function resultFromLine(line) {
  var arrayLine = line.split(':');
  return {
    firstPlace: arrayLine[1],
    secondPlace: arrayLine[2],
    thirdPlace: arrayLine[3]
  }
}

function readResult(line) {
  if (RegExp(/^(Result)/).test(line)) {
    return resultFromLine(line);
  }
  return false;
}

function getResult(input) {
  return input.slice(-1).map(readResult)[0];
}

function win(bet, sum, winners, result) {

  return {
    sum: sum + bet.bet,
    winners: (bet.horse === result.firstPlace) ? winners.concat([bet.bet]) : winners
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

function exacta(bet, sum, winners, result) {
  var horse = bet.horse.split(",");

  return {
    sum: sum + bet.bet,
    winners: (horse[0] === result.firstPlace && horse[1] === result.secondPlace)
      ? winners.concat([bet.bet]) : winners
  };
}

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
  var bets = getBets(myInput);
  var result = getResult(myInput);
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

  return {
    win: formatWin(win, result),
    place1: formatPlace(place1, result.firstPlace),
    place2: formatPlace(place2, result.secondPlace),
    place3: formatPlace(place3, result.thirdPlace),
    exacta: formatExacta(exacta, result)
  };
}


exports.betFromLine = betFromLine;
exports.readBets = readBets;
exports.getBets = getBets;
exports.resultFromLine = resultFromLine;
exports.readResult = readResult;
exports.getResult = getResult;
exports.win = win;
exports.place = place;
exports.exacta = exacta;
exports.processInput = processInput;
exports.formatWin = formatWin;
exports.formatPlace = formatPlace;
exports.formatExacta = formatExacta;
exports.bettingHost = bettingHost;
