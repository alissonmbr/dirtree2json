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
 *              attributeName: override the attribute names, the attributes name are: path, child, 
 *                  absolutePath, fileName, extension, dirFlag, creationTime, modificationTime, size
 * return: a json with the representation of the folder
 */
dirtree2json.dirTojson = function (path_, options_) {
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
function convertToBoolean(v, defaultValue) {
    if (typeof v === "boolean") {
        return v;
    } else if (typeof v === "string" && v.toLowerCase() === "true") {
        return true;
    } else {
        return defaultValue;
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
    options.attributeName = options.attributeName || {};
    options.filter = options.filter || {};
    
    // Include/exclude attributes
    options.includeAbsolutePath = convertToBoolean(options.includeAbsolutePath, false);
    options.includeSize = convertToBoolean(options.includeSize, false);
    options.includeCreationTime = convertToBoolean(options.includeCreationTime, false);
    options.includeModificationTime = convertToBoolean(options.includeModificationTime, false);
    options.includeDirFlag = convertToBoolean(options.includeDirFlag, true);
    options.includeExtension = convertToBoolean(options.includeExtension, true);

    // General configs
    options.rootPath = options.rootPath || PATH.basename(path_);
    options.rootName = options.rootName || PATH.basename(path_);
    options.excludeEmptyFolders = convertToBoolean(options.excludeEmptyFolders, false);
    options.filter.fileName = options.filter.fileName || null;
    options.filter.fileExtension = options.filter.fileExtension || null;
    options.filter.folderName = options.filter.folderName || null;

    // Set attribute names
    options.attributeName.path = options.attributeName.path || "path";
    options.attributeName.child = options.attributeName.child || "child";
    options.attributeName.absolutePath = options.attributeName.absolutePath || "absolutePath";
    options.attributeName.fileName = options.attributeName.fileName || "name";
    options.attributeName.extension = options.attributeName.extension || "ext";
    options.attributeName.dirFlag = options.attributeName.dirFlag || "isDir";
    options.attributeName.creationTime = options.attributeName.creationTime || "creationTime";
    options.attributeName.modificationTime = options.attributeName.modificationTime || "modificationTime";
    options.attributeName.size = options.attributeName.size || "size";

    var folder = {};
    var stat = FS.statSync(path_);

    if (options.includeAbsolutePath) {
        folder[options.attributeName.absolutePath] = path_;
    }

    if (options.includeCreationTime) {
        folder[options.attributeName.creationTime] = stat.birthtime;
    }

    if (options.includeModificationTime) {
        folder[options.attributeName.modificationTime] = stat.mtime;
    }

    if (options.includeExtension) {
        folder[options.attributeName.extension] = PATH.extname(path_);
    }

    if (options.includeDirFlag) {
        folder[options.attributeName.dirFlag] = !!stat.isDirectory();
    }

    folder[options.attributeName.path] = options.rootPath;
    folder[options.attributeName.fileName] = options.rootName;
    folder[options.attributeName.child] = listFolder(path_, folder[options.attributeName.path], options);

    if (options.includeSize) {
        folder[options.attributeName.size] = getSize(folder[options.attributeName.child], options.attributeName.size);
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
            node[options_.attributeName.absolutePath] = path;
        }

        if (options_.includeCreationTime) {
            node[options_.attributeName.creationTime] = stat.birthtime;
        }

        if (options_.includeModificationTime) {
            node[options_.attributeName.modificationTime] = stat.mtime;
        }

        if (options_.includeExtension) {
            node[options_.attributeName.extension] = PATH.extname(path).replace('.', '');
        }

        node[options_.attributeName.path] = basePath_ + '/' + files[i];
        node[options_.attributeName.fileName] = files[i];

        if (stat.isDirectory()) {
            if (options_.filter.folderName && node[options_.attributeName.fileName].search(options_.filter.folderName) === -1) {
                continue;
            }

            if (options_.includeDirFlag) {
                node[options_.attributeName.dirFlag] = true;
            }
            
            node[options_.attributeName.child] = listFolder(path, node[options_.attributeName.path], options_);
            
            if (options_.includeSize) {
                node[options_.attributeName.size] = getSize(node[options_.attributeName.child], options_.attributeName.size);
            }

            if (options_.excludeEmptyFolders && node[options_.attributeName.child].length === 0) {
                continue;
            }
            
            foldersArray.push(node);
        } else {
            if (options_.filter.fileExtension && PATH.extname(path).replace('.', '').search(options_.filter.fileExtension) === -1) {
                continue;
            }

            if (options_.filter.fileName && node[options_.attributeName.fileName].search(options_.filter.fileName) === -1) {
                continue;
            }

            if (options_.includeDirFlag) {
                node[options_.attributeName.dirFlag] = false;
            }

            if (options_.includeSize) {
                node[options_.attributeName.size] = stat.size;
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
function getSize(child, sizeName) {
    var size = 0;

    for (var j = 0; j < child.length; ++j)
        size += child[j][sizeName];

    return size;
}