module.exports.create = function(){
    var agents;

    function initialize(callback){
        agents = [
            {
                // fake agent
            }
        ];
        callback(null, agents);
    }

    function getAgents(callback){
        if (!agents){
            return initialize(callback);
        }
        callback(null, agents);
    }

    function start(callback){
        initialize(callback);
    }

    function allocate(requirements, serviceDescription, callback){
        // should analyze requirements and locate an agent
        // where the service can be installed
        callback(null, {

        });
    }

    return {
        start: start,
        allocate: allocate,
        getAgents: getAgents
    };
};