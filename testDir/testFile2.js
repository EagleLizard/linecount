var fs  = require("fs");
fs.readFileSync(process.argv[2]).toString().split('\n').forEach(
function (line) {
    if (line != "") {
        //do something here
        var args = line.split(' ').map(function(n){return parseInt(n);});
        var resultArr = fizzBuzz(args[0], args[1], args[2]);
        var resultStr = resultArr.join(' ');
        console.log(resultStr);
    }
});
//return a list of numbers where each line
// contains a number or the correspomnding F, B, or FB
function fizzBuzz(X,Y,N){
	var result = [];
	for(var i=1; i<=N; ++i){
		var fb = '';
		if(i%X==0){
			fb+="F";
		}
		if(i%Y==0){
			fb+="B";
		}
		result.push( (fb=='')?i:fb );
	}
	return result;
}
