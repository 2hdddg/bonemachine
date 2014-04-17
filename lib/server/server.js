module.exports.start = function(options){
    var restify = require('restify'),
        server = restify.createServer();

    options = options || {};
    var port = options.port || 6666;

    function get_agent_registry(){
        var registry = require('../agent/registry');
        return registry.open('./registry');
    }

    function get_agent(){
        var agent = require('../agent/agent');
        var registry = get_agent_registry();
        return agent.create(registry);
    }

    var agent = get_agent();
    agent.start();

    var agent_controller = require('./agent_controller');
    agent_controller.initialize(agent, server);

    server.use(restify.bodyParser({ mapParams: true }));
    server.listen(port, '127.0.0.1', function(){
        console.log('%s listening at %s', server.name, server.url);
    });
};