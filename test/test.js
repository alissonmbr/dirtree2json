var dirtree = require('../');

console.log(
    JSON.stringify(
        dirtree.dirTojson(__dirname + '/testDir', {
            includeAbsolutePath: true,
            includeSize: true,
            includeCreationTime: true,
            includeModificationTime: true,
            attributeName: {
                "absolutePath": "absolutePath2",
                "creationTime": "creationTime2",
                "modificationTime": "modificationTime2",
                "path": "path2",
                "fileName": "name2",
                "extension": "ext2",
                "dirFlag": "isDir2",
                "size": "size2"
            }
        }),
        null,
        2
    )
);
