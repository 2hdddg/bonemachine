var processProxy = require('./process_proxy');

module.exports.create = function (registration){
    var instance = processProxy.create(registration);

    return {
        start: function(){
            instance.start();
        },
        runtime: {
            getState: function(){
                return instance.getState();
            }
        },
        registration: registration
    };
};