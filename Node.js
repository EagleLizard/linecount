;
(function () {
    var fs = require('fs');
    var countLines = require('./lineCounter.js').countLines;
    module.exports = {
        nodeFactory: nodeFactory
    };
    var SUPPORTED_FILES = [
        'js', 'rb', 'cpp', 'c', 'h', 'py', 'cs',
        'ts', 'java', 'php', 'go', 'css', 'scss',
        'less', 'html', 'xml', 'json'
    ];
    function supportedFile(fileName) {
        var dotSplit = fileName.split('.');
        var postfix;
        if (dotSplit.length < 2) {
            return false;
        }
        postfix = dotSplit[dotSplit.length - 1].trim().toLowerCase();
        return SUPPORTED_FILES.indexOf(postfix) != -1;
    }
    //factory method
    function nodeFactory(dirPath, dirName) {
        var fullPath, isDir;
        if (dirName.trim()[0] == '.') {
            if (dirName.trim()[1] != '/') {
                return null;
            }
        }
        ;
        isDir = (dirPath == '')
            ? fs.statSync(dirName).isDirectory()
            : fs.statSync(dirPath + '/' + dirName).isDirectory();
        if (isDir) {
            return new DirNode(dirPath, dirName);
        }
        else {
            console.log(dirPath + '/' + dirName);
            if (!supportedFile(dirName)) {
                return null;
            }
            else {
                return new FileNode(dirPath, dirName);
            }
        }
    }
    //class definitions
    var DirNode = (function () {
        function DirNode(directoryPath, dirName) {
            var _this = this;
            var realPath, tempNode;
            directoryPath = directoryPath || '';
            this.path = directoryPath;
            this.name = dirName;
            realPath = (directoryPath == '')
                ? this.name
                : directoryPath + '/' + this.name;
            this.subDirs = [];
            fs.readdirSync(realPath)
                .filter(function (dir) {
                return (dir[0] != '.');
            })
                .forEach(function (dir) {
                tempNode = nodeFactory(realPath, dir);
                if (tempNode != null) {
                    _this.subDirs.push(tempNode);
                }
            });
            this.numFiles = this.subDirs.length;
        }
        DirNode.prototype.out = function (indent) {
            var result = '\n' + indentString(indent) + this.name + ':';
            indent++;
            this.subDirs.forEach(function (dir) {
                result += dir.out(indent);
            });
            return result;
        };
        DirNode.prototype.numLinesImmediate = function () {
            return 0;
        };
        DirNode.prototype.numLinesTotal = function () {
            return 0;
        };
        return DirNode;
    })();
    var FileNode = (function () {
        function FileNode(directoryPath, dirName) {
            this.path = directoryPath;
            this.name = dirName;
            this.numFiles = 0;
            console.log('filename in FileNode ctor: ' + directoryPath + '/' + dirName);
            this.numLines = countLines(directoryPath + '/' + dirName);
        }
        FileNode.prototype.numLinesImmediate = function () {
            return null;
        };
        FileNode.prototype.numLinesTotal = function () {
            return 0;
        };
        FileNode.prototype.out = function (indent) {
            return '\n' + indentString(indent) + this.name;
        };
        return FileNode;
    })();
    exports.FileNode = FileNode;
    function indentString(numTabs) {
        var result = '';
        for (var i = 0; i < numTabs; ++i) {
            result += '  ';
        }
        return result;
    }
})();
