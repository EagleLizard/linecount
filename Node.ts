;(function(){

  var fs = require('fs');

  module.exports = {
    nodeFactory : nodeFactory
  };
  //factory method
  function nodeFactory(dirPath : string){
    if (fs.statSync(dirPath).isDirectory()){
      return new DirNode(dirPath);
    }else{
      return new FileNode(dirPath);
    }
  }
  //==interface deifnitions
  interface CountFunc {
    (): number;
  }
  interface Node {
    path : string;
    subDirs : Node[];
    numFiles : number;
    numLinesImmediate : CountFunc;
    numLinesTotal : CountFunc;
  }
  //class definitions

  class DirNode {
    path : string;
    subDirs : Node[];
    numFiles : number;

    constructor(directoryPath : string){
      directoryPath = directoryPath || '';
      this.path = directoryPath;
      this.subDirs = fs.readdirSync(directoryPath)
        .map(function(dirName){
          return nodeFactory(directoryPath+'/'+dirName);
        });
      this.numFiles = this.subDirs.length;
    }

    numLinesImmediate(){
      return 0;
    }
    numLinesTotal(){
      return 0;
    }
  }

  class FileNode {
    path : string;
    subDirs : Node[];
    numFiles : number;

    constructor(directoryPath : string){
      this.path = directoryPath;
      this.numFiles = 0;
    }

    numLinesImmediate(){
      return 0;
    }
    numLinesTotal(){
      return 0;
    }
  }

})();
