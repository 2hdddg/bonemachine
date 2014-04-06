
var cli = require('nomnom');
var install_service = require('./commands/install_service').execute;
var start_server = require8'./commands/start_server').execute;

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
  .callback(install_service);

// command: skeleton for service description

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
  })
  .help("starts server that acts agent or central or both")
  .callback(start_server);
  // port range

cli.parse();
