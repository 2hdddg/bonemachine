
module.exports.register = function(cli){
    function start(options){
        var server = require('../server/server');
        server.start({
          port: options.port,
          agent: {
            start: options.agent,
            registryPath: options.agentregistry 
          },
          central: {
            start: options.central
          }
        });
    }

    cli.command('server')
      .option('agent', {
        abbr: 'a',
        full: 'agent',
        flag: true,
        default: false,
        help: 'server can act as an agent'
      })
      .option('central', {
        abbr: 'c',
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
      .option('agentregistry', {
        abbr: 'ar',
        full: 'agentregistry',
        default: './agent_registry',
        type: 'string',
        help: 'filsystem location of agent registry'
      })
      .option('centralregistry', {
        abbr: 'cr',
        full: 'centralregistry',
        default: './central_registry',
        type: 'string',
        help: 'filsystem location of central registry'
      })
      .help("starts server that acts agent or central or both")
      .callback(start);
};