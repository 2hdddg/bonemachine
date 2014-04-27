var processProxy = require('./processProxy');

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