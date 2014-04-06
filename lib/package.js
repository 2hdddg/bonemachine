var tar = require('tar-pack');

function wrap(source){
    return tar.pack(source);
}

function unwrap(stream, destination){
    stream.pipe(tar.unpack(destination));
}

module.exports = {
    wrap: wrap,
    unwrap: unwrap
};