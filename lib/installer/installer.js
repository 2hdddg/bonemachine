var path = require('path');
var fs = require('fs');
var package = require('../package');
var async = require('async');
var _ = require('lodash');

module.exports.create = function(centralProxy, agentProxy){
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

    function allocate(requirements, serviceDescription, callback){
            // initializes service proxy
            callback(null, {
                upload: function(stream, uploadCallback){
                    uploadCallback(null);
                },
                install: function(installCallback){
                    installCallback(null);
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

    function notifyCentral(serviceProxy, serviceDescription, callback){
        callback(null);
    }

    function install(servicePath, requirements, installCallback){
        async.waterfall([
            // Read description of service to be installed. 
            // The description is in a package defined on 
            // local filesystem
            function(callback){
                getDescription(servicePath, function(error, serviceDescription){
                    if (error){
                        console.log('Failed to read service description');
                        return callback(error);
                    }

                    console.log('Read service description');

                    callback(null, { serviceDescription: serviceDescription});
                });
            },
            // Create a package stream by reading the local filesystem
            function (result, callback){
                getPackage(servicePath, function(error, servicePackage){
                    if (error){
                        console.log('Failed to create package');
                        return callback(error);
                    }

                    console.log('Created package of service');

                    callback(null, _.assign(result, { servicePackage: servicePackage}));
                })
            },
            // Allocates a slot for the service on agent that
            // fulfills the requirements
            function(result, callback){
                allocate(requirements, result.serviceDescription, function(error, serviceProxy){
                    if (error){
                        console.log('Failed to find a matching agent');
                        return callback(error);
                    }

                    console.log('Allocated service');

                    callback(null, _.assign(result, { serviceProxy: serviceProxy}));
                })
            },
            // Upload package to the allocated service
            function(result, callback){
                uploadPackage(result.servicePackage, result.serviceProxy, function(error){
                    if (error){
                        console.log('Failed to upload service package');
                        return callback(error);
                    }

                    console.log('Service package uploaded');

                    callback(null, result);
                });
            },
            // install package on the agent
            function(result, callback){
                installPackage(result.serviceProxy, function(error){
                    if (error){
                        console.log('Installation failed on agent');
                        return callback(error);
                    }

                    console.log('Installation on agent done.');

                    callback(null, result);
                });
            },
            // Notify central that service has successfully
            // been installed on agent
            function(result, callback){
                notifyCentral(result.serviceProxy, result.serviceDescription, function(error){
                    if (error){
                        console.log('Unable to notify central');
                        return callback(error);
                    }

                    console.log('Notified central of new service.');

                    callback(null, result);
                });
            }
        ], installCallback);
    }

    return {
        install: install,
    };
};