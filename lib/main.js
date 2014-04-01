
var create_registry = require('./agent/registry');
var create_agent = require('./agent/agent');
var create_service = require('./agent/service');
var create_process_proxy = require('./agent/process_proxy');

var registry = create_registry('./registry');
var agent = create_agent(registry, function(registration){
    return create_service(registration, create_process_proxy);
});

agent.start();
