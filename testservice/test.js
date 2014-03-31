var http = require('http');

var port = process.argv[2];
console.log('Starting service on port:' + port);

http.createServer(function(req, res){

}).listen(port);