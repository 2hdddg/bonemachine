module.exports = function (registration, create_process_proxy){
    var instance = create_process_proxy(registration);

    return {
        start: function(){
            instance.start();
        },
        running: {
            get_state: function(){
                return instance.state();
            }
        },
        registration: {
            get_name: function(){
                return registration.name;
            },
            get_port: function(){
                return registration.port;
            },
            get_state: function(){
                return registration.state;
            }
        }
    };
};