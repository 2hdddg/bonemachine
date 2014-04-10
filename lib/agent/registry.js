var fs = require('fs');
var path = require('path');
var async = require('async');
var _ = require('lodash');

module.exports.open = function(registry_path){
    //  structure below path:
    //      /portx
    //          props       (contains: name, install, start, suspend url, stop url)
    //          state       (current state of service, see below)
    //          package     (received package)
    //          /install    (extracted and installes)
    //      /porty
    //          ..
    //
    // valid states are:
    //      allocated   - port has been allocated, no package received
    //      packaged    - package has been received but not installed
    //      installed   - successfully installed package
    //      failed      - failed installation
    //      suspended   - service might be running but is to be removed
    //      removed     - services has been marked for removal but yet physically removed
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
    //          ],
    //          port_arg: -1
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

    // all fields in props file
    var all_props_fields = ['name', 'install', 'start', 'commands'];

    function read_port(directory_name, directory_path, callback){
        // ensure directory
        fs.stat(directory_path, function(error, stats){
            if (error) return callback(error);

            if (!stats.isDirectory()){
                return callback({ error: directory_path + " is not a directory." });
            }

            // name should be a valid portnumber
            var port = parseInt(directory_name);
            if (!port){
                return callback({ error: directory_name + " isnt a valid port number."});
            }

            callback(null, port);
        });
    }

    function read_props(directory_path, callback){
        var props_path = path.join(directory_path, 'props');
        fs.readFile(props_path, 'utf8', function(error, data){
            if (error) return callback(error);

            var json = JSON.parse(data);

            callback(null, json);
        });
    }

    function read_state(directory_path, callback){
        var state_path = path.join(directory_path, 'state');
        fs.readFile(state_path, 'utf8', function(error, data){
            if (error) return callback(error);

            var trimmed = data.trim();

            callback(null, trimmed);
        });
    }

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
            if (error) return registration_callback(error);

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

    function register(pending, register_callback){
        var props = _.pick(pending, all_props_fields);
        var port = pending.port;
        var state = pending.state;

        var registration_path = path.join(registry_path, port.toString());

        // validate
        // check that directory doesnt exist

        async.series({
            create_directory: function(callback){
                fs.mkdir(registration_path, callback)
            },
            write_props: function(callback){
                var props_file = path.join(registration_path, 'props');
                var json = JSON.stringify(props);
                fs.writeFile(props_file, json, {flag: 'wx'}, callback);
            },
            write_state: function(callback){
                var state_file = path.join(registration_path, 'state');
                fs.writeFile(state_file, state, {flag: 'wx'}, callback);
            },
            read: function(callback){
                get_registration(port.toString(), callback);
            }
        },
        function (error, result){
            register_callback(error, result.read);
        });
    }

    return {
        // constructs registration json by reading
        // structure in path as described above
        get_registrations: get_registrations,
        register: register
    };
};
