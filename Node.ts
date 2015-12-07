;(function(){

  var fs = require('fs');
  var countLines = require('./lineCounter.js').countLines;

  module.exports = {
    nodeFactory : nodeFactory,
  };

  var SUPPORTED_FILES = [
    'js',   'rb',   'cpp',  'c',   'h',   'py',  'cs',
    'ts',   'java', 'php', 'go',  'css', 'scss',
    'less', 'html', 'xml',  'json'
  ];
  function supportedFile(fileName){
    var dotSplit = fileName.split('.');
    var postfix;
    if (dotSplit.length < 2){
      return false;
    }
    postfix = dotSplit[dotSplit.length-1].trim().toLowerCase();
    return SUPPORTED_FILES.indexOf(postfix) != -1;
  }
  //factory method
  function nodeFactory(dirPath : string, dirName : string){
    var fullPath, isDir;
    if(dirName.trim()[0]=='.'){
      if(dirName.trim()[1] != '/'){
        return null;
      }
    };

    isDir = (dirPath == '')
             ? fs.statSync(dirName).isDirectory()
             : fs.statSync(dirPath+'/'+dirName).isDirectory()
             ;
    if (isDir){
      return new DirNode(dirPath, dirName);
    }else{
      console.log(dirPath+'/'+dirName);
      if (!supportedFile(dirName)){
        return null;
      }else{
        return new FileNode(dirPath, dirName);
      }
    }
  }

  //==interface deifnitions
  interface CountFunc {
    (): number;
  }
  interface OutFunc {
    (indent : Number):string;
  }
  interface Node {
    out(indent : number):string;
    path : string;
    name : string;
    subDirs : Node[];
    numFiles : number;
    numLinesImmediate : CountFunc;
    numLinesTotal : CountFunc;
  }
  //class definitions

  class DirNode {
    path : string;
    name : string;
    subDirs : Node[];
    numFiles : number;

    constructor(directoryPath : string, dirName : string){
      var realPath, tempNode;
      directoryPath = directoryPath || '';
      this.path = directoryPath;
      this.name = dirName;
      realPath = (directoryPath == '')
                  ? this.name
                  : directoryPath+'/'+this.name
                  ;
      this.subDirs = [];
      fs.readdirSync(realPath)
        .filter((dir)=>{
          return (dir[0] != '.');
        })
        .forEach((dir)=>{
          tempNode = nodeFactory(realPath,dir);
          if(tempNode!=null){
            this.subDirs.push(tempNode);
          }
        });
      this.numFiles = this.subDirs.length;

    }

    out(indent : number){
      var result = '\n'+indentString(indent)+this.name+':';
      indent++;
      this.subDirs.forEach((dir)=>{
        result+=dir.out(indent);
      });
      return result;
    }

    numLinesImmediate(){
      return 0;
    }
    numLinesTotal(){
      return 0;
    }
  }

  export class FileNode {
    path : string;
    name : string;
    subDirs : Node[];
    numFiles : number;
    numLines : number;

    constructor(directoryPath : string, dirName : string){
      this.path = directoryPath;
      this.name = dirName;
      this.numFiles = 0;
      console.log('filename in FileNode ctor: '+directoryPath+'/'+dirName);
      this.numLines = countLines(directoryPath+'/'+dirName);
    }

    numLinesImmediate(){
      return null;
    }
    numLinesTotal(){
      return 0;
    }
    out(indent :number){
      return '\n'+indentString(indent)+this.name;
    }
  }

  function indentString(numTabs : number){
    var result = '';
    for(var i=0; i<numTabs; ++i){
      result+='  ';
    }
    return result;
  }

})();
