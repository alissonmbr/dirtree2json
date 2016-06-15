'use strict';

var PATH = require('path');
var FS = require('fs');

var dirtree2json = module.exports = {};

dirtree2json.dirTojson = function (path_, options_) {
    if (!path_) {
        console.log('error');
    }

    // TODO - Test if the path exists
    // TODO - Test if the paht is a file

    console.log(path_);

    return folderToJson(path_, options_);
}

function folderToJson(path_, options_) {
	var folder = {};
	folder.path = PATH.basename(path_);
	folder.name = PATH.basename(path_);
	folder.ext = PATH.extname(path_);
	folder.isDir = !!FS.statSync(path_).isDirectory();
	folder.child = listFolder(path_, PATH.basename(path_), options_);
	folder.size = getSize(folder.child);
	return folder;
}

function listFolder(path_, basePath_, options_) {
    var options = options_ || {};
    var includePath = typeof options.includePath === 'undefined' ? true : options.includePath;

    var nodes = [];
    var foldersArray = [];
    var filesArray = [];

    var files = FS.readdirSync(path_);

    for (var i = 0; i < files.length; ++i) {
        var node = {};
        var path = path_ + '/' + files[i];

        if (includePath)
            node.path = basePath_ + '/' + files[i];

        node.name = files[i];
        node.ext = PATH.extname(path);

        if (FS.statSync(path).isDirectory()) {
            node.isDir = true;
            node.child = listFolder(path, node.path, options);
            node.size = getSize(node.child);
            foldersArray.push(node);
        } else {
            node.isDir = false;
            node.size = FS.statSync(path).size;
            filesArray.push(node);
        }

    }

    nodes = nodes.concat(foldersArray);
    nodes = nodes.concat(filesArray);

    return nodes;
}

function getSize(child) {
	var size = 0;
	
	for (var j = 0; j < child.length; ++j) 
		size += child[j].size;

	return size;
}