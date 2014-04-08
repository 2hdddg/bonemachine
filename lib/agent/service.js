var process_proxy = require('./process_proxy');

module.exports.create = function (registration){
    var instance = process_proxy.create(registration);

    return {
        start: function(){
            instance.start();
        },
        runtime: {
            get_state: function(){
                return instance.get_state();
            }
        },
        registration: registration
    };
};