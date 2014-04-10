var path = require('path');
var fs = require('fs');

module.exports.create = function(){
    // bonemachine:
    //  packages service, uses service description
    //  contact central for resolving agent to install on
    //    resolve could be done by name or set of rules
    //      central:
    //          allocate port on agent
    //  use agent install url to upload package to agent
    //      agent:
    //          receives package
    //          unpackages
    //          installs
    //  notify central that service has been installed
    //      central:
    //          starts service
    //          suspends old service
    //          new requests for this service will use new instance
    //          outstanding requests will still use old instance
    //          when last outstanding request timed out, stop old service
    //              and remove it

    function retrieve_service_description(service_path, callback){
        var service_description_path = path.join(service_path, 'service.json');
        fs.readFile(service_description_path, 'utf8', function(error, data){
            if (error) return callback(error);

            callback(null, JSON.parse(data));
        });
    }

    function resolve_agent(central_url, agent_requirements, service_description){

    }

    function get_package_stream(service_path){

    }

    function upload_package(package_stream, agent_url){

    }

    function notify_central(notification_url){

    }

    return {
        retrieve_service_description: retrieve_service_description
    }
};