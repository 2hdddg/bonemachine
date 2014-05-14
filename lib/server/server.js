module.exports.start = function(options){
    var restify = require('restify'),
        server = restify.createServer();

    options = options || {};
    var port = options.port || 6666;

    function getAgentregistry(agentOptions){
        var registry = require('../agent/registry');
        return registry.open(agentOptions.registryPath);
    }

    function getAgent(agentOptions){
        var agent = require('../agent/agent');
        var registry = getAgentregistry();
        return agent.create(registry);
    }

    if (options.agent.start){
        var agent = getAgent(options.agent);
        agent.start();

        var agentController = require('./agent_controller');
        agentController.initialize(agent, server);
    }

    if (options.central.start){
        var central = getCentral(options.central);
        central.start();

        var centralController = require('./central_controller');
        centralController.initialize(central, server);
    }

    server.use(restify.bodyParser({ mapParams: false }));
    server.listen(port, '127.0.0.1', function(){
        console.log('%s listening at %s', server.name, server.url);
    });
};