module.exports = function (registration, create_process_proxy){
    var instance = create_process_proxy(registration);

    return {
        start: function(){
            instance.start();
        }
    };
};