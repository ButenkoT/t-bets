function betFromLine(line) {
  var arrayLine = line.split(':');
  return {
    product: arrayLine[1],
    horse: arrayLine[2],
    bet: parseInt(arrayLine[3])
  }
}

function readBets(line){
  if (RegExp(/^(Bet)/).test(line)) {
    return betFromLine(line);
  }
  return false;
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

exports.betFromLine = betFromLine;
exports.readBets = readBets;
exports.resultFromLine = resultFromLine;
exports.readResult = readResult;
