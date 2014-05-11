var http = require('http')

module.exports.create = function(centralLocation){

    function allocate(requirements, serviceDescription, callback){
        var options = {
            host: centralLocation.host,
            port: centralLocation.port,
            path: '/central/allocate',
            method: 'POST'
        };

        var request = http.request(options, function(response){

        });

        request.on('error', function(e){
            callback(e);
        });

        request.write(JSON.stringify({
            requirements: requirements,
            service: serviceDescription
        }));
        request.end();
    }

    return {
        allocate: allocate
    };
};