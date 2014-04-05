
/*
 commandline parameters:
  bonemachine server [--agent] [--central]
  bonemachine install folder --agent=<name> 
    folder should contain a service description file: service.json
    that contains:
      {
        name: '',
        install: {
  
        },
        start: {
  
        },
        commands: {
  
        }

      }
*/
var cli = require('nomnom');
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
  .callback(function(options){
    console.log(options);
  })
  .help("installs a service");

cli.parse();


function get_agent(){
    var open_registry = require('./agent/registry').open;
    var create_agent = require('./agent/agent').create;
    var create_service = require('./agent/service').create;
    var create_process_proxy = require('./agent/process_proxy').create;

    var registry = open_registry('./registry');
    var agent = create_agent(registry, function(registration){
        return create_service(registration, create_process_proxy);
    });
    return agent;
}

/*
var restify = require('restify'),
    server = restify.createServer();

var agent = get_agent();
agent.start();

var initialize_agent_controller = require('./agent_controller').initialize;
initialize_agent_controller(agent, server);

var port = 6666;


server.listen(port, '127.0.0.1', function(){
    console.log('%s listening at %s', server.name, server.url);
});
*/




