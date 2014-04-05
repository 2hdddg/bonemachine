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
  
            }
          }
        }
      ]
    }

    note that name of service isnt necessarily unique

  POST /agent/install 
*/
    function get_services(request, response, next){
       var services =  agent.get_services();
       var service_models = _.map(services, function(service){
            return {
                name: service.registration.get_name(),
                registration: {
                  port: service.registration.get_port(),
                  state: service.registration.get_state()
                },
                runtime: {
                  state: service.running.get_state()
                }
            };
       });
       var model = {
          services: service_models
       }
       response.send(model);
       next();
     }

    // routes for agent
    server.get('/agent/services', get_services);
};