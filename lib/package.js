var tar = require('tar-pack');

function wrap(source){
    return tar.pack(source);
}

function unwrap(stream, destination){
    stream.pipe(tar.unpack(destination));
}

function getDescription(source, callback){
    var descriptionPath = path.join(source, 'service.json');
    fs.readFile(descriptionPath, 'utf8', function(error, data){
        if (error) return callback(error);

        callback(null, JSON.parse(data));
    });
}


module.exports = {
    getDescription: getDescription,
    wrap: wrap,
    unwrap: unwrap
};