var _ = require('lodash');
var service = require('./service');

module.exports.create = function(registry){
    var services;

    function start(callback){
        registry.get_registrations(function(error, registrations){
            if (error){
                callback(error);
                return;
            }

            services = _.map(registrations, function(registration){
                return service.create(registration);
            });

            _.each(services, function(service){
                service.start();
            });
        });
    }

    function get_services(){
        return services;
    }

    return {
        start: start,
        get_services: get_services
    };
};