var spawn = require('child_process').spawn;
var S = require('string');

module.exports.create = function (registration){
    var process;
    var name = registration.name;
    var command = registration.start.command;
    var args = registration.start.args;
    var port_arg = registration.start.port_arg;
    var port = registration.port;

    var state = 'pending';

    var STARTED     = S("Starting service {{name}} with command: {{command}} {{args}}");
    var STDOUT_DATA = S("[{{name}}] {{data}}");
    var STDERR_DATA = S("[ERR: {{name}}]{{data}}");

    function log(s, values){
        console.log(s.template(values).s);
    }

    var onStdout = function(data){
        log(STDOUT_DATA, { name: name, data: data });
    };

    var onStderr = function(data){
        log(STDERR_DATA, { name: name, data: data });
    };

    var onError = function(error){
        state = 'stopped_error';
    };

    function startProcess(){
        if (port_arg){
            args[port_arg] = port;
        }

        log(STARTED, {
            name: name,
            command: command,
            args: args.join(' ')
        });

        process = spawn(command, args);
        state = 'running';
    }

    function attachListeners(){
        process.on('error', onError);
        process.stdout.on('data', onStdout);
        process.stderr.on('data', onStderr);
    }

    return {
        start: function(){
            startProcess();
            attachListeners();
        },
        getState: function(){
            return state;
        }
    };
};