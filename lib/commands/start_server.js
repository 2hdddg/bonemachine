module.exports.execute = function(options){
    /*
    agent: true/false
    central: true/false
    port: 
    agent_registry:
    central_registry
    */

    var server = require('../server/server');
    server.start();
};