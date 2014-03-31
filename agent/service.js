var spawn = require('child_process').spawn;
var S = require('string');

function create_service(registration){
    var process;
    var name = registration.name;
    var command = registration.start.command;
    var args = registration.start.args;
    var port_arg = registration.start.port_arg;
    var port = registration.port;

    var STARTED     = S("Starting service {{name}} with command: {{command}} {{args}}");
    var STDOUT_DATA = S("[{{name}}]\n{{data}}");
    var STDERR_DATA = S("[ERR: {{name}}]\n{{data}}");

    function log(s, values){
        console.log(s.template(values).s);
    }

    var on_stdout = function(data){
        log(STDOUT_DATA, { name: name, data: data });
    };

    var on_stderr = function(data){
        log(STDERR_DATA, { name: name, data: data });
    }

    var on_error = function(error){
    }

    function start_process(){
        if (port_arg){
            args[port_arg] = port;
        }

        log(STARTED, {
            name: name,
            command: command,
            args: args.join(' ')
        });

        process = spawn(command, args);
    }

    function attach_listeners(){
        process.on('error', on_error);
        process.stdout.on('data', on_stdout);
        process.stderr.on('data', on_stderr);
    }

    return {
        start: function(){
            start_process();
            attach_listeners();
        },
    };
}

module.exports = create_service;

var create_registry = require('./registry');
var r = create_registry('./registry');
r.get_registrations(function(error, registrations){
    if (error){
        console.log(error);
    }
    var service = create_service(registrations[0]);
    service.start();
    var service2 = create_service(registrations[1]);
    service2.start();
});