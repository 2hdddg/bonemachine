var fs = require('fs');
var path = require('path');
var async = require('async');
var _ = require('lodash');

module.exports.open = function(registryPath){
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
    var allPropsfields = ['id', 'name', 'install', 'start', 'commands'];

    function readPort(directoryName, directoryPath, callback){
        // ensure directory
        fs.stat(directoryPath, function(error, stats){
            if (error) return callback(error);

            if (!stats.isDirectory()){
                return callback({ error: directoryPath + " is not a directory." });
            }

            // name should be a valid portnumber
            var port = parseInt(directoryName);
            if (!port){
                return callback({ error: directoryName + " isnt a valid port number."});
            }

            callback(null, port);
        });
    }

    function readProps(directoryPath, callback){
        var propsPath = path.join(directoryPath, 'props');
        fs.readFile(propsPath, 'utf8', function(error, data){
            if (error) return callback(error);

            var json = JSON.parse(data);

            callback(null, json);
        });
    }

    function readState(directoryPath, callback){
        var statePath = path.join(directoryPath, 'state');
        fs.readFile(statePath, 'utf8', function(error, data){
            if (error) return callback(error);

            var trimmed = data.trim();

            callback(null, trimmed);
        });
    }

    function getRegistration(directoryName, registrationCallback){
        var directoryPath = path.join(registryPath, directoryName);

        async.parallel({
            port: function(callback){
                readPort(directoryName, directoryPath, callback);
            },
            state: function(callback){
                readState(directoryPath, callback);
            },
            props: function(callback){
                readProps(directoryPath, callback);
            }
        }, function(error, result){
            if (error) return registrationCallback(error);

            var registration = {
                id: result.props.id,
                port: result.port,
                state: result.state,
                name: result.props.name,
                install: result.props.install,
                start: result.props.start,
                commands: result.props.commands
            };
            registrationCallback(null, registration);
        });
    }

    function getRegistrations(callback){
        fs.readdir(registryPath, function(error, filenames){
            async.map(filenames, getRegistration, callback);
        });
    }

    function register(pending, registerCallback){
        var props = _.pick(pending, allPropsfields);
        // asign unique id
        props.id = Date.now();
        var port = pending.port;
        var state = pending.state;

        var registrationPath = path.join(registryPath, port.toString());

        // validate
        // check that directory doesnt exist

        async.series({
            create_directory: function(callback){
                fs.mkdir(registrationPath, callback);
            },
            write_props: function(callback){
                var props_file = path.join(registrationPath, 'props');
                var json = JSON.stringify(props);
                fs.writeFile(props_file, json, {flag: 'wx'}, callback);
            },
            write_state: function(callback){
                var state_file = path.join(registrationPath, 'state');
                fs.writeFile(state_file, state, {flag: 'wx'}, callback);
            },
            read: function(callback){
                getRegistration(port.toString(), callback);
            }
        },
        function (error, result){
            registerCallback(error, result.read);
        });
    }

    return {
        // constructs registration json by reading
        // structure in path as described above
        getRegistrations: getRegistrations,
        register: register
    };
};
