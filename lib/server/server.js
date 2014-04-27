module.exports.start = function(options){
    var restify = require('restify'),
        server = restify.createServer();

    options = options || {};
    var port = options.port || 6666;

    function getAgentregistry(){
        var registry = require('../agent/registry');
        return registry.open('./registry');
    }

    function getAgent(){
        var agent = require('../agent/agent');
        var registry = getAgentregistry();
        return agent.create(registry);
    }

    var agent = getAgent();
    agent.start();

    var agent_controller = require('./agent_controller');
    agent_controller.initialize(agent, server);

    server.use(restify.bodyParser({ mapParams: true }));
    server.listen(port, '127.0.0.1', function(){
        console.log('%s listening at %s', server.name, server.url);
    });
};