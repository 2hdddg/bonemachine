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

    return {
        start: start
    };
};