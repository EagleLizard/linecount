;(function(){

  var fs = require('fs');
  var nodeFactory = require('./Node.js').nodeFactory;

  var path = (process.argv.length <= 2)
              ? './'
              : process.argv[2]
              ;
  var root: Node = nodeFactory(path);
  console.log(root["subDirs"]);
  // var dirList = fs.readdirSync(path);
  // dirList.forEach((item)=>{
  //   console.log(item);
  //   console.log('\tisDir: ', fs.statSync('./'+item).isDirectory());
  // });

})();
