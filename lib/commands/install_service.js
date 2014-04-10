
module.exports.register = function(cli){

    function install(options){
        var S = require('string');

        var service_path = options.service;
        var agent_name = options.agent;

        var INSTALLING = S("Starting installation of service located in {{path}} on agent {{agent}}");

        function log(s, values){
            console.log(s.template(values).s);
        }

        log(INSTALLING, {path: service_path, agent: agent_name});
    }

    cli.command('install')
      .option('service', {
        abbr: 's',
        full: 'service',
        required: true,
        type: 'string',
        help: 'filesystem directory where service is located'
      })
      .option('agent',{
        abbr: 'a',
        full: 'agent',
        required: true,
        type: 'string',
        help: 'name of agent that service should be installed on'
      })
      .help("installs a service")
      .callback(install);
};