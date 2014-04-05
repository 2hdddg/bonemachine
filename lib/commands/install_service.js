var S = require('string');

module.exports.execute = function(options){
    var service_path = options.service;
    var agent_name = options.agent;

    var INSTALLING = S("Starting installation of service located in {{path}} on agent {{agent}}");

    function log(s, values){
        console.log(s.template(values).s);
    }

    log(INSTALLING, {path: service_path, agent: agent_name});

    // check that directory exists
    // look for service description in directory
    // read service description
    // verify service description
    // check that agent exists
    
};