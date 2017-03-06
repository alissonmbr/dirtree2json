# dirtree2json
dirtree2json converts a directory in a json.

# Installation
```
npm install dirtree2json
```

# Usage
``` javascript
var dirtree2json = require('dirtree2json');

var path = __dirname + '/node_modules';
var options = {
    includeAbsolutePath: true,
    includeSize: true,
    includeCreationTime: true,
    includeModificationTime: true
};

var result = dirtree2json.dirTojson(path, options);
```

## Options
The options are:

**includeAbsolutePath**: include the absolute path to the json. Default is false  
**includeSize**: include the size(bytes) of the files and folders. Default is false  
**includeCreationTime**: include the creation time of the file. Default is false  
**includeModificationTime**: include the last modification time. Default is false  
