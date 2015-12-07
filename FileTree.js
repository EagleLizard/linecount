;
(function () {
    var FileTree = (function () {
        function FileTree(basePath) {
            this.root = require('./Node.js').nodeFactory('', basePath);
        }
        FileTree.prototype.out = function () {
            return this.root.out(0);
        };
        FileTree.prototype.numLines = function () {
            return numLinesHelper(0, this.root);
        };
        FileTree.prototype.fileList = function () {
            return fileListHelper('', this.root);
        };
        return FileTree;
    })();
    exports.FileTree = FileTree;
    function numLinesHelper(lineCount, current) {
        if (current.numLinesImmediate() === null) {
            return current.numLines;
        }
        var sum = 0;
        current.subDirs.forEach(function (val) {
            sum += numLinesHelper(lineCount, val);
        });
        return lineCount + sum;
    }
    function fileListHelper(result, current) {
        var newFiles = '';
        if (current.numLinesImmediate() === null) {
            return result + '\n' + current.name + ':' + current.numLines;
        }
        current.subDirs.forEach(function (val) {
            result += fileListHelper(newFiles, val);
        });
        return result;
    }
})();
