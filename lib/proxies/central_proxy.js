var http = require('http');
var AgentProxy = require('./agent_proxy');

module.exports.create = function(centralLocation){

    function allocate(requirements, serviceDescription, callback){
        var options = {
            host: centralLocation.host,
            port: centralLocation.port,
            path: '/central/allocate',
            method: 'POST'
        };

        var request = http.request(options, function(response){
            var agentJson = JSON.parse(response.body);
            var agentProxy = AgentProxy.create(agentJson);
            callback(null, agentProxy);
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