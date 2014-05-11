var _ = require('lodash');

module.exports.create = function(agentJson){
    function upload(packageStream, callback){

    }

    function install(callback){
    }

    var extensions = {
        install: install,
        upload: upload
    };

    // expose all properties as received from central and
    // some extensions
    return _.merge(extensions, agentJson, function(a, b){
        if (a && b){
            throw 'proxy overwrite';
        }
    });
};