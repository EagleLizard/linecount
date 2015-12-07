;
(function () {
    module.exports = {
        countLines: countLines
    };
    var fs = require('fs');
    function countLines(fileName) {
        fileName = './' + fileName;
        var lines = fs.readFileSync(fileName, 'utf8').split('\n');
        return lines.length;
    }
})();
