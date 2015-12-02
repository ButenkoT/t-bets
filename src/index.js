var fs = require('fs');
var data = require('./data');


var myData = fs.readFileSync(process.argv[2] || './betsInput.txt', 'utf-8').split('\n');

//process.stdin.setEncoding("utf8"); // convert bytes to utf8 characters
//
//process.stdin
//  .on('data', bettingHost)
//  .pipe(process.stdout);

var output = data.bettingHost(myData);

console.log(output.win);
console.log(output.place1);
console.log(output.place2);
console.log(output.place3);
console.log(output.exacta);
