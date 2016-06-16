var dirtree = require('../');

console.log(JSON.stringify(dirtree.dirTojson(__dirname + '/testDir2'), null, 2));