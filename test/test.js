var dirtree = require('../lib');
var assert = require('assert');

function walk(dirTree, fn, param) {

    if (dirTree.isDir) {
        for (var i = 0; i < dirTree.child.length; ++i) {
            if (!walk(dirTree.child[i], fn, param)) {
                return false;
            }
        }
    }

    return fn(dirTree, param);
}

function extensionChecker(node, extension) {
    return node.isDir || !node.isDir && node.ext === extension;
}

function fileNameChecker(node, regex) {
    return node.isDir || !node.isDir && node.name.search(regex) > -1;
}

function folderNameChecker(node, regex) {
    return !node.isDir || node.name === "testDir" || node.isDir && node.name.search(regex) > -1;
}

function emptyFolderChecker(node) {
    return !node.isDir || node.isDir && node.child.length > 0;
}

describe('path', function() {
    describe('empty path', function() {
        it('should throw an exception', function() {
            try {
                dirtree.dirTojson("");
            } catch (err) {
                assert.strictEqual(err.message, "The path cannot be empty!");
            }
        });
    });

    describe('wrong path', function() {
        it('should throw an exception', function() {
            var path = __dirname + '/testDir2';
            try {
                dirtree.dirTojson(path);
            } catch (err) {
                assert.strictEqual(err.message, path + ' doesn\'t exist!');
            }
        });
    });

    describe('path is not a directory', function() {
        it('should throw an exception', function() {
            var path = __dirname + '/testDir/file1.txt';
            try {
                dirtree.dirTojson(path);
            } catch (err) {
                assert.strictEqual(err.message, path + ' is not a directory!');
            }
        });
    });
});

describe('options', function () {
    describe('default options', function () {
        it('should be equal to the json', function () {
            assert.deepStrictEqual(dirtree.dirTojson(__dirname + '/testDir'), { "ext": "", "isDir": true, "path": "testDir", "name": "testDir", "child": [{ "ext": "", "path": "testDir/dir1", "name": "dir1", "isDir": true, "child": [{ "ext": "css", "path": "testDir/dir1/css1.css", "name": "css1.css", "isDir": false }, { "ext": "txt", "path": "testDir/dir1/file1.txt", "name": "file1.txt", "isDir": false }, { "ext": "txt", "path": "testDir/dir1/file2.txt", "name": "file2.txt", "isDir": false }, { "ext": "html", "path": "testDir/dir1/index.html", "name": "index.html", "isDir": false }, { "ext": "js", "path": "testDir/dir1/js1.js", "name": "js1.js", "isDir": false }] }, { "ext": "", "path": "testDir/dir2", "name": "dir2", "isDir": true, "child": [{ "ext": "txt", "path": "testDir/dir2/file1.txt", "name": "file1.txt", "isDir": false }, { "ext": "txt", "path": "testDir/dir2/file2.txt", "name": "file2.txt", "isDir": false }] }, { "ext": "", "path": "testDir/dir3", "name": "dir3", "isDir": true, "child": [] }, { "ext": "txt", "path": "testDir/file1.txt", "name": "file1.txt", "isDir": false }] });
        });
    });

    describe('include/exclude options', function () {
        describe('includeAbsolutePath', function () {
            it('should include', function () {
                assert.ok(!!dirtree.dirTojson(__dirname + '/testDir', { includeAbsolutePath: "true" }).absolutePath);
            });
            it('should exclude', function () {
                assert.ok(!dirtree.dirTojson(__dirname + '/testDir', { includeAbsolutePath: false }).absolutePath);
            });
        });

        describe('includeSize', function () {
            it('should include', function () {
                assert.ok(!!dirtree.dirTojson(__dirname + '/testDir', { includeSize: true }).size);
            });
            it('should exclude', function () {
                assert.ok(!dirtree.dirTojson(__dirname + '/testDir', { includeSize: false }).size);
            });
        });

        describe('includeCreationTime', function () {
            it('should include', function () {
                assert.ok(!!dirtree.dirTojson(__dirname + '/testDir', { includeCreationTime: true }).creationTime);
            });
            it('should exclude', function () {
                assert.ok(!dirtree.dirTojson(__dirname + '/testDir', { includeCreationTime: false }).creationTime);
            });
        });

        describe('includeModificationTime', function () {
            it('should include', function () {
                assert.ok(!!dirtree.dirTojson(__dirname + '/testDir', { includeModificationTime: true }).modificationTime);
            });
            it('should exclude', function () {
                assert.ok(!dirtree.dirTojson(__dirname + '/testDir', { includeModificationTime: false }).modificationTime);
            });
        });

        describe('includeDirFlag', function () {
            it('should include', function () {
                assert.ok(!!dirtree.dirTojson(__dirname + '/testDir', { includeDirFlag: true }).isDir);
            });
            it('should exclude', function () {
                assert.ok(!dirtree.dirTojson(__dirname + '/testDir', { includeDirFlag: false }).isDir);
            });
        });

        describe('includeExtension', function () {
            it('should include', function () {
                assert.ok(dirtree.dirTojson(__dirname + '/testDir', { includeExtension: true }).ext !== undefined);
            });
            it('should exclude', function () {
                assert.ok(dirtree.dirTojson(__dirname + '/testDir', { includeExtension: false }).ext === undefined);
            });
        });

    });

    describe('root override', function () {
        it('should override root path', function () {
            assert.strictEqual(dirtree.dirTojson(__dirname + '/testDir', { rootPath: "." }).path, ".");
        });

        it('should override root name', function () {
            assert.strictEqual(dirtree.dirTojson(__dirname + '/testDir', { rootName: "root" }).name, "root");
        });
    });

    describe('attribute names override', function () {
        var overrideTest = dirtree.dirTojson(__dirname + '/testDir', {
            includeAbsolutePath: true,
            includeSize: true,
            includeCreationTime: true,
            includeModificationTime: true,
            includeDirFlag: true,
            includeExtension: true,
            attributeName: {
                path: "path2",
                child: "child2",
                absolutePath: "absolutepath2",
                fileName: "name2",
                extension: "ext2",
                dirFlag: "isdir2",
                creationTime: "creationtime2",
                modificationTime: "modificationtime2",
                size: "size2"
            }
        });

        it('should override path attribute', function () {
            assert.notStrictEqual(overrideTest.path2, undefined);
        });

        it('should override child attribute', function () {
            assert.notStrictEqual(overrideTest.child2, undefined);
        });

        it('should override absolutepath attribute', function () {
            assert.notStrictEqual(overrideTest.absolutepath2, undefined);
        });

        it('should override filename attribute', function () {
            assert.notStrictEqual(overrideTest.name2, undefined);
        });

        it('should override extension attribute', function () {
            assert.notStrictEqual(overrideTest.ext2, undefined);
        });

        it('should override dirflag attribute', function () {
            assert.notStrictEqual(overrideTest.isdir2, undefined);
        });

        it('should override creationtime attribute', function () {
            assert.notStrictEqual(overrideTest.creationtime2, undefined);
        });

        it('should override size attribute', function () {
            assert.notStrictEqual(overrideTest.size2, undefined);
        });

        it('should override modificationtime attribute', function () {
            assert.notStrictEqual(overrideTest.modificationtime2, undefined);
        });

    });

    describe('filter', function () {
        it('should list just html files', function () {
            assert.ok(walk(dirtree.dirTojson(__dirname + '/testDir', { filter: { fileExtension: "html" } }), extensionChecker, 'html'));
            assert.ok(!walk(dirtree.dirTojson(__dirname + '/testDir', { filter: { fileExtension: "js" } }), extensionChecker, 'html'));
        });

        it('should list just files with the name "/file.*/"', function () {
            assert.ok(walk(dirtree.dirTojson(__dirname + '/testDir', { filter: { fileName: /^file.*$/ } }), fileNameChecker, /^file.*$/));
            assert.ok(!walk(dirtree.dirTojson(__dirname + '/testDir', { filter: { fileName: /^css.*$/ } }), fileNameChecker, /^file.*$/));
        });

        it('should list just folders with the name "dir1"', function () {
            assert.ok(walk(dirtree.dirTojson(__dirname + '/testDir', { filter: { folderName: /^dir1$/ } }), folderNameChecker, /^dir1$/));
            assert.ok(!walk(dirtree.dirTojson(__dirname + '/testDir', { filter: { folderName: /^dir2$/ } }), folderNameChecker, /^dir1$/));
        });
    });

    describe('excludeEmptyFolders', function () {
        it('shoult exclude empty folders', function () {
            assert.ok(walk(dirtree.dirTojson(__dirname + '/testDir', { excludeEmptyFolders: true }), emptyFolderChecker));
        });
    });

});
