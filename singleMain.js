;
(function () {
    var fs = require('fs');
    var FileTree = require('./FileTree.js').FileTree;
    var path = (process.argv.length <= 2)
        ? './'
        : process.argv[2];
    var fileTree = new FileTree(path);
    console.log(fileTree.out());
    console.log(fileTree.fileList());
    console.log('/ntotal: ' + fileTree.numLines());
})();
