var fs = require('fs');
var path = require('path');
var async = require('async');

function create_registry(registry_path){
    //  structure below path:
    //      /portx
    //          props       (contains: name, install, start, suspend url, stop url)
    //          state       (current state of service, see below)
    //          package     (received package)
    //          /install    (extracted and installes)
    //      /porty
    //          ..
    //
    // valid states are: received, installed, corrupt, suspended, removed
    //
    // format of registration: 
    //    var registration = {
    //        name: 'A service',
    //        port: 666,
    //        install: {
    //          command: 'node',
    //          args: [
    //              0,
    //              'x'
    //          ]
    //        },
    //        start: {
    //          command: 'node',
    //          args: [
    //              0,
    //              'x'
    //          ],
    //          port_arg: 0
    //        },
    //        commands: {
    //            suspend: '/suspend',
    //            stop: '/stop'
    //        },
    //        state: 'installed'
    //    }

    function read_port(directory_name, directory_path, callback){
        // ensure directory
        fs.stat(directory_path, function(error, stats){
            if (error){
                callback(error);
                return;
            }

            if (!stats.isDirectory()){
                callback({ error: directory_path + " is not a directory." });
                return;
            }

            // name should be a valid portnumber
            var port = parseInt(directory_name);
            if (!port){
                callback({ error: directory_name + " isnt a valid port number."});
                return;
            }

            callback(null, port);
        });
    }

    function read_props(directory_path, callback){
        var props_path = path.join(directory_path, 'props');
        fs.readFile(props_path, 'utf8', function(error, data){
            if (error){
                callback(error);
                return;
            }

            var json = JSON.parse(data);

            callback(null, json);
        });
    }

    function read_state(directory_path, callback){
        var state_path = path.join(directory_path, 'state');
        fs.readFile(state_path, 'utf8', function(error, data){
            if (error){
                callback(error);
                return;
            }

            callback(null, data);
        });
    }

    // name is just directoryname, path excluded
    function get_registration(directory_name, registration_callback){
        var directory_path = path.join(registry_path, directory_name);

        async.parallel({
            port: function(callback){
                read_port(directory_name, directory_path, callback);
            },
            state: function(callback){
                read_state(directory_path, callback);
            },
            props: function(callback){
                read_props(directory_path, callback);
            }
        }, function(error, result){
            if (error){
                registration_callback(error);
                return;
            }
            var registration = {
                port: result.port,
                state: result.state,
                name: result.props.name,
                install: result.props.install,
                start: result.props.start,
                commands: result.props.commands
            };
            registration_callback(null, registration);
        });
    }

    function get_registrations(callback){
        fs.readdir(registry_path, function(error, filenames){
            async.map(filenames, get_registration, callback);
        });
    }

    return {
        // constructs registration json by reading
        // structure in path as described above
        get_registrations: get_registrations,
    };
}

module.exports = create_registry;

/*
var r = Registry('./registry');
r.get_registrations(function(error, registrations){
    if (error){
        console.log(error);
    }
    console.log(registrations);
});
*/