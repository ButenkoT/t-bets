var data = require('./data');


var stdin = process.stdin;
var stdout = process.stdout;
var inputChunks = [];

stdin.resume();
stdin.setEncoding('utf8');

stdin.on('data', function (chunk) {
  inputChunks.push(chunk);
});

stdin.on('end', function () {
  var inputData = inputChunks.join('').split('\n');
  var myOutput = data.bettingHost(inputData);
  stdout.write(myOutput.win);
  stdout.write('\n');
  stdout.write(myOutput.place1);
  stdout.write('\n');
  stdout.write(myOutput.place2);
  stdout.write('\n');
  stdout.write(myOutput.place3);
  stdout.write('\n');
  stdout.write(myOutput.exacta);
  stdout.write('\n');
});
