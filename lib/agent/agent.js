var _ = require('lodash');

module.exports = function(registry, create_service){
    var services;

    function start(callback){
        registry.get_registrations(function(error, registrations){
            if (error){
                callback(error);
                return;
            }

            services = _.map(registrations, function(registration){
                return create_service(registration);
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