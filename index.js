'use strict';

var PATH = require('path');
var FS = require('fs');

var dirtree2json = module.exports = {};

/* Convert a @path_ to json with the fields setted in @options_
 *
 * path_: the absolute path of the folder
 * options_: flags that enable and diable options. The options are:
 *              includeAbsolutePath: include the absolute path to the json. Default is false
 *              includeSize: include the size(bytes) of the files and folders. Default is false
 *              includeCreationTime: include the creation time of the file. Default is false
 *              includeModificationTime: include the last modification time. Default is false
 * return: a json with the representation of the folder
 */
dirtree2json.dirTojson = function(path_, options_) {
    if (!path_) {
        throw new Error("The path cannot be empty!");
    }

    // check if the path_ exists
    if (!FS.existsSync(path_)) {
        throw new Error(path_ + ' doesn\'t exist!')
    }

    // Check if the path_ is a directory
    if (!FS.statSync(path_).isDirectory()) {
        throw new Error(path_ + ' is not a directory!')
    }

    return folderToJson(path_, options_);
}

/* Convert @v value to boolean
 * 
 * v: the value to convert
 * return a boolean value from v. Return false if @v is not boolean or is not a "true" string 
 */
function convertToBoolean(v) {
    if (typeof v === "boolean") {
        return v;
    } else if (typeof v === "string" && v.toLowerCase() === "true") {
        return true;
    } else {
        return false;
    }
}

/* Given a @path_ return the file structure repesentation with the fields setted in @options_
 *
 * path_: the same of the dirTojson function
 * options_: the same of the dirTojson function
 * return: a json with the representation of the folder
 */
function folderToJson(path_, options_) {
    // Check options and set default values if empty
    var options = options_ || {};
    options.includeAbsolutePath = convertToBoolean(options.includeAbsolutePath);
    options.includeSize = convertToBoolean(options.includeSize);
    options.includeCreationTime = convertToBoolean(options.includeCreationTime);
    options.includeModificationTime = convertToBoolean(options.includeModificationTime);

    var folder = {};
    var stat = FS.statSync(path_);

    if (options.includeAbsolutePath) {
        folder.absolutePath = path_;
    }

    if (options.includeCreationTime) {
        folder.creationTime = stat.birthtime;
    }

    if (options.includeModificationTime) {
        folder.modificationTime = stat.mtime;
    }

    folder.path = PATH.basename(path_);
    folder.name = PATH.basename(path_);
    folder.ext = PATH.extname(path_);
    folder.isDir = !!stat.isDirectory();
    folder.child = listFolder(path_, PATH.basename(path_), options);

    if (options.includeSize) {
        folder.size = getSize(folder.child);
    }

    return folder;
}

function listFolder(path_, basePath_, options_) {
    var nodes = [];
    var foldersArray = [];
    var filesArray = [];

    // Read files and folders inside the dir
    var files = FS.readdirSync(path_);

    for (var i = 0; i < files.length; ++i) {
        var node = {};
        var path = path_ + '/' + files[i];
        var stat = FS.statSync(path);

        if (options_.includeAbsolutePath) {
            node.absolutePath = path;
        }

        if (options_.includeCreationTime) {
            node.creationTime = stat.birthtime;
        }

        if (options_.includeModificationTime) {
            node.modificationTime = stat.mtime;
        }

        node.path = basePath_ + '/' + files[i];

        node.name = files[i];
        node.ext = PATH.extname(path).replace('.', '');

        if (stat.isDirectory()) {
            node.isDir = true;
            node.child = listFolder(path, node.path, options_);
            if (options_.includeSize) {
                node.size = getSize(node.child);
            }
            foldersArray.push(node);
        } else {
            node.isDir = false;
            if (options_.includeSize) {
                node.size = stat.size;
            }
            filesArray.push(node);
        }

    }

    nodes = nodes.concat(foldersArray);
    nodes = nodes.concat(filesArray);

    return nodes;
}

/* Get the size of the folder
 *
 * child: the list of childrens of the folder
 * return: the size(bytes) of the sum of all childrens  
 */
function getSize(child) {
    var size = 0;

    for (var j = 0; j < child.length; ++j)
        size += child[j].size;

    return size;
}