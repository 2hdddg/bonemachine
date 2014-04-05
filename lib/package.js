var fstream = require('fstream'),
    tar = require('tar'),
    zlib = require('zlib'),
    base64stream = require('base64stream');

function wrap(source){
    console.log('wrapping ' + source);
    var wrapped = new base64stream.BufferedStreamToBase64();

    return fstream.Reader({
            path: source,
            type: 'Directory',
    })
    .pipe(tar.Pack())
    .pipe(zlib.Gzip())
    .pipe(wrapped);
}

function unwrap(package, destination){

}


module.exports = {
    wrap: wrap,
    unwrap: unwrap
}



wrap(process.argv[2])
.pipe(process.stdout);