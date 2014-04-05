
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

// command for installing service
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

// command: skeleton for service description

// command for running a server, a server
// can be either an agent or a central or both
cli.command('server')
  .option('agent', {
    abbr: 'a',
    full: 'agent',
    flag: true,
    default: true,
    help: 'server can act as an agent'
  })
  .option('central', {
    abbr: 'a',
    full: 'central',
    flag: true,
    default: false,
    help: 'server can act as an central, coordinating agents'
  })
  .option('port', {
    abbr: 'p',
    full: 'port',
    default: 6666,
    help: 'port that server listens on'
  })
  .option('agent registry', {
    abbr: 'ar',
    full: 'agent-registry',
    default: './agent_registry',
    type: 'string',
    help: 'filsystem location of agent registry'
  })
  .option('central registry', {
    abbr: 'cr',
    full: 'central-registry',
    default: './central_registry',
    type: 'string',
    help: 'filsystem location of central registry'
  });
  // port range

cli.parse();


