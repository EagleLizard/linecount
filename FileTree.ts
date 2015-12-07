;(function(){

  export class FileTree{
    root : Node;

    constructor(basePath : string){
      this.root = require('./Node.js').nodeFactory('',basePath);
    }

    out(){
      return this.root.out(0);
    }

    numLines(){
      return numLinesHelper(0, this.root);
    }

    fileList(){
      return fileListHelper('', this.root);
    }

  }

  function numLinesHelper(lineCount, current){
    if(current.numLinesImmediate() === null){
      return current.numLines;
    }
    var sum = 0;
    current.subDirs.forEach(function(val){
      sum += numLinesHelper(lineCount, val);
    });
    return lineCount+sum;
  }

  function fileListHelper(result, current){
    var newFiles = '';
    if (current.numLinesImmediate() === null){
      return result+'\n'+current.name+':'+current.numLines;
    }
    current.subDirs.forEach(function(val){
      result += fileListHelper(newFiles, val);
    });
    return result;
  }

})();
