var _ = require('lodash');

module.exports.create = function(registry, service_creator){
    var services;

    function start(callback){
        registry.get_registrations(function(error, registrations){
            if (error){
                callback(error);
                return;
            }

            services = _.map(registrations, function(registration){
                return service_creator(registration);
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