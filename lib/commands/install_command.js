var Installer = require('../installer/installer');
var CentralProxy = require('../proxies/central_proxy');

module.exports.register = function(cli){

    function install(options){
        var S = require('string');

        var servicePath = options.service;
        var requirements = {
            agent: options.agent
        };

        var INSTALLING = S("Starting installation of service located in {{path}}.");

        function log(s, values){
            console.log(s.template(values).s);
        }

        log(INSTALLING, {path: servicePath});

        function callback(error){
            if (error){
                console.log('failed: ' + error);
            }
            else{
                console.log("Installed");
            }
        }

        var centralProxy = CentralProxy.create({
            host: options.centralhost,
            port: options.centralport
        });

        var installer = Installer.create(centralProxy);
        installer.install(servicePath, requirements, callback);
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
      .option('centralhost', {
        abbr: 'ch',
        full: 'centralhost',
        required: true,
        type: 'string',
        help: 'hostname where central is running'
      })
      .option('centralport', {
        abbr: 'cp',
        full: 'centralport',
        required: true,
        type: 'integer',
        help: 'port on which central is listening'
      })
      .help("installs a service")
      .callback(install);
};