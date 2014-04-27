var path = require('path');
var fs = require('fs');
var package = require('../package');

module.exports.create = function(centralProxy){
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

    function getDescription(servicePath, callback){
        package.getDescription(servicePath, callback);
    }

    // resolve
    function allocate(centralProxy, requirements, serviceDescription, callback){
            // initializes service proxy
            callback(null, {
                service: {
                    name: '',
                    runtime: {
                        state: ''
                    },
                    actions: {
                        upload: 'url'
                    }
                }
            });
    }

    function getPackage(servicePath, callback){
        callback(null, package.wrap(servicePath));
    }

    function uploadPackage(packageStream, serviceProxy, callback){
        serviceProxy.upload(packageStream, callback);
    }

    function installPackage(serviceProxy, callback){
        serviceProxy.install(callback);
    }

    function notifyCentral(centralProxy, serviceProxy){
        centralProxy.installed(agent, servicename, port);
    }

    function install(){
        
    }

    return {
        install: install
    };
};