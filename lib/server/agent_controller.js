var _ = require('lodash');

module.exports.initialize = function(agent, server){
/*
  Agent api:

  GET /agent/services returns json on format:

    {
      services: [
        {
          name: '<name of service>',
          registration: {
            port: <port that service is registered on>,
            state: '<state of installation>''
          },
          runtime: {
            state: '<state of running service>'
          },
          actions: {
            suspend: {
              href: ''
            }
            remove: {
              href: ''
            },
            start: {
              href: ''
            },
            stop: {
              href: ''
            },
            install: {
  
            },
            get_log: {
                href: ''
                stdout, stderr, stdout+stderr
            }
          }
        }
      ]
    }

    note that name of service isnt necessarily unique

  POST /agent/allocate
    allocates port for service


  POST /agent/install 
*/
    function serviceTomodel(service){
      return {
          name: service.registration.name,
          registration: {
            port: service.registration.port,
            state: service.registration.state
          },
          runtime: {
            state: service.runtime.getState()
          }
      };
    }

    function getServices(request, response, next){
       var services =  agent.getServices();
       var service_models = _.map(services, serviceTomodel);
       var model = {
          services: service_models
       };
       response.send(model);
       next();
     }

     function allocate(request, response, next){
        console.log(request.body);
     }

    // routes for agent
    server.get('/agent/services', getServices);
};