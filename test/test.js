var dirtree = require('../');

console.log(JSON.stringify(dirtree.dirTojson(__dirname + '/testDir', {includeAbsolutePath: true, includeSize: true, includeCreationTime: true, includeModificationTime: true}), null, 2));
