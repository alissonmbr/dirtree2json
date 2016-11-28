var dirtree = require('../');

console.log(JSON.stringify(dirtree.dirTojson(__dirname + '/testDir', {includeAbsolutePath: false}), null, 2));
console.log(JSON.stringify(dirtree.dirTojson(__dirname + '/testDir'), null, 2));