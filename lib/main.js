var _ = require('lodash');

function get_agent(){
    var create_registry = require('./agent/registry');
    var create_agent = require('./agent/agent');
    var create_service = require('./agent/service');
    var create_process_proxy = require('./agent/process_proxy');

    var registry = create_registry('./registry');
    var agent = create_agent(registry, function(registration){
        return create_service(registration, create_process_proxy);
    });
    return agent;
}

var agent = get_agent();
agent.start();

var restify = require('restify'),
    server = restify.createServer();

var port = 6666;

function agent_get_services(request, response, next){
   var services =  agent.get_services();
   var models = _.map(services, function(service){
        return {
            name: service.registration.get_name(),
            port: service.registration.get_port(),
            registration: service.registration.get_state(),
            runtime: service.running.get_state()
        };
   });
   response.send(models);
   next();
 }

// routes for agent
server.get('/agent/services', agent_get_services);

server.listen(port, '127.0.0.1', function(){
    console.log('%s listening at %s', server.name, server.url);
});

