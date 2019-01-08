var commandLineUsage = require('command-line-usage');

var jsonOptions =
    "{bold attributeName.absolutePath} (string) overwrites the name of the 'absolute path' attribute. Default is: \"absolutePath\"\n" +
    "{bold attributeName.child} (string) overwrites the name of the 'children' attribute. Default is:  \"child\"\n" +
    "{bold attributeName.creationTime} (string)overwrites the name of the 'creation time' attribute. Default is: \"creationTime\"\n" +
    "{bold attributeName.dirFlag} (string) overwrites the name of the 'is directory flag' attribute. Default is: \"isDir\"\n" +
    "{bold attributeName.extension} (string) overwrites the name of the 'extension' attribute. Default is: \"ext\"\n" +
    "{bold attributeName.fileName} (string) overwrites the name of the 'file name' attribute. Default is: \"ext\"\n" +
    "{bold attributeName.modificationTime} (string) overwrites the name of the 'modification time' attribute. Default is: \"modificationTime\"\n" +
    "{bold attributeName.path} (string) overwrites the name of the 'path' attribute. Default is: \"path\"\n" +
    "{bold attributeName.size} (string) overwrites the name of the 'size' attribute. Default is: \"size\"\n" +
    "{bold excludeEmptyFolders} (boolean)exclude all folders without a file. This is also excludes folders with just empty folders. Default is: false\n" +
    "{bold filter.fileExtension} (regex or string) filter files by file extension name. Default is: null\n" +
    "{bold filter.fileName} (regex or string) filter files by name. Default is: null\n" +
    "{bold filter.folderName} (regex or string) filter folders by name. Default is: null\n" +
    "{bold includeAbsolutePath} (boolean) include the absolute path of the folder/file. Default is: false\n" +
    "{bold includeCreationTime} (boolean) include the creation time of the folder/file. Default is: false\n" +
    "{bold includeDirFlag} (boolean) include is directory flag. Default is: true\n" +
    "{bold includeExtension} (boolean) include the extension of the file. Default is: true\n" +
    "{bold includeModificationTime} (boolean) include the modification time of the folder/file. Default is: false\n" +
    "{bold includeSize} (boolean) include the size of the folder/file. Default is: false\n" +
    "{bold rootName} (string) overwrites the name of the root folder. Default is: name of the relative path\n" +
    "{bold rootPath} (string) overwrites the path attribute of the  the root. Default is: relative path of the folder";

var sections = [
    {
        header: 'dirtree2json',
        content: 'Simple, flexible lib to convert a directory tree into a json.'
    },
    {
        header: 'Usage',
        content: 'dirtree2json [options] <directory-path>'
    },
    {
        header: 'Options',
        optionList: [
            {
                name: 'help',
                alias: 'h',
                description: 'Print this usage guide.'
            },
            {
                name: 'prettify',
                alias: 'p',
                description: 'Enable json pretty print'
            },
            {
                name: 'json',
                alias: 'j',
                typeLabel: '{underline file}',
                description: 'Json file with dirtree2json configuration\n\n' + jsonOptions
            }
        ]
    }
];

module.exports = function () {
    return commandLineUsage(sections);
} 