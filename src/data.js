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


exports.betFromLine = betFromLine;
exports.readBets = readBets;
exports.getBets = getBets;
exports.resultFromLine = resultFromLine;
exports.readResult = readResult;
exports.getResult = getResult;
