var http = require('http');

var port = process.argv[2];
console.log('Starting service on port:' + port);

var count = 0;

http.createServer(function(req, res){
    count++;
    res.write("count:" + count);
    res.end();
}).listen(port);