var _ = require('lodash');
var async = require('async');
var service = require('./service');

module.exports.create = function(registry, port_range){
    var services;

    // reads registrations and initializes
    // a service for each registration
    function initialize(callback){
        registry.getRegistrations(function(error, registrations){
            if (error){
                callback(error);
                return;
            }

            services = _.map(registrations, function(registration){
                return service.create(registration);
            });

            callback(null, services);
        });
    }

    // registry is only read once, changes to registry
    // after agent has been initialized will not be detected
    function getServices(callback){
        if (!services){
            initialize(callback);
            return;
        }
        callback(null, services);
    }

    function start(callback){
        getServices(function(error, services){
            if (error){
                callback(error);
                return;
            }
            _.each(services, function(service){
                service.start();
            });
            if (callback){
                callback(null, services);
            }
        });
    }

    function getFreeport(services){
        // find a free port that isnt in use
        for (var port = port_range.min; port <= port_range.max; port++){
            if (!_.some(services, { 'registration': { 'port': port }})){
                return port;
            }
        }
        return null;
    }

    function allocate(allocation, allocateCallback){
        var registration = _.cloneDeep(allocation);

        async.waterfall([
            getServices,
            function (services, callback){
                registration.port = getFreeport(services);
                registry.register(registration, callback);
            }
        ], function(error, result){
            allocateCallback(error, result);
        });
    }

    return {
        start: start,
        allocate: allocate,
        getServices: getServices,
    };
};