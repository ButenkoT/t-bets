var data = require('./data');
var calculate = require('./calculate');
var config = require('../config.json');

function processInput(inputData) {

  var bets = data.getBets(inputData);
  var result = data.getResult(inputData);

  var poolWin = 0;
  var poolPlace = 0;
  var poolExacta = 0;

  return bets.reduce(function (out, bet) {

    if (bet.product === config.win) {
      poolWin = poolWin + bet.bet;
      out.win.sum = poolWin;

      if (bet.horse === result.firstPlace) {
        out.win.winners.push(bet.bet)
      }

      return out;
    }

    if (bet.product === config.place) {
      poolPlace = poolPlace + bet.bet;
      out.place.sum = poolPlace;

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
      poolExacta = poolExacta + bet.bet;
      out.exacta.sum = poolExacta;

      if (bet.horse[0] === result.firstPlace || bet.horse[1] === result.secondPlace) {
        out.exacta.winners.push(bet.bet)
      }

      return out;
    }
  }, {
    win: {sum: 0, winners: []},
    place: {sum: 0, firstWinners: [], secondWinners: [], thirdWinners: []},
    exacta: {sum: 0, winners: []}
  });
}

var dataInput = [
  'Bet:W:1:3',
  'Bet:W:2:4',
  'Bet:W:3:5',
  'Bet:W:4:5',
  'Bet:W:1:16',
  'Bet:W:2:8',
  'Bet:W:3:22',
  'Bet:W:4:57',
  'Bet:W:1:42',
  'Bet:W:2:98',
  'Bet:W:3:63',
  'Bet:W:4:15',
  'Bet:P:1:31',
  'Bet:P:2:89',
  'Bet:P:3:28',
  'Bet:P:4:72',
  'Bet:P:1:40',
  'Bet:P:2:16',
  'Bet:P:3:82',
  'Bet:P:4:52',
  'Bet:P:1:18',
  'Bet:P:2:74',
  'Bet:P:3:39',
  'Bet:P:4:105',
  'Bet:E:1,2:13',
  'Bet:E:2,3:98',
  'Bet:E:1,3:82',
  'Bet:E:3,2:27',
  'Bet:E:1,2:5',
  'Bet:E:2,3:61',
  'Bet:E:1,3:28',
  'Bet:E:3,2:25',
  'Bet:E:1,2:81',
  'Bet:E:2,3:47',
  'Bet:E:1,3:93',
  'Bet:E:3,2:51',
  'Result:2:3:1'
];

function printWin(winNum, result) {
  return console.log('Win:' + result.firstPlace + ':$' + winNum);
}

function printPlace(placeNum, result){
  return console.log('Place:' + result + ':$' + placeNum);
}

function printExacta(exactaNum, result) {
  return console.log('Exacta:' + result.firstPlace + ',' + result.secondPlace + ':$' + exactaNum);
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

  printWin(win, result);
  printPlace(place1, result.firstPlace);
  printPlace(place2, result.secondPlace);
  printPlace(place3, result.thirdPlace);
  printExacta(exacta, result);

}

bettingHost(dataInput);
