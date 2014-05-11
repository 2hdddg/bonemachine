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
    function toServiceModel(service){
      var id = service.id;

      var extensions = {
        // urls to perform actions on service
        actions: {
          upload: '/agent/service/' + id + '/upload';
        }
      };

      return _.merge(extensions, service, function(a, b){
        if (a && b){
          throw 'model overwrite';
        }
      });
    }

    function getServices(request, response, next){
      agent.getServices(function(error, services){
        var models = _.map(services, toServiceModel);
        response.send({
          services: model
        });
        next();
      });
    }

    function allocate(request, response, next){
      var serviceDescription = JSON.parse(request.body);
      var service = agent.allocate(serviceDescription, function(error, service){
        response.send(toServiceModel(service);
        next();
      }
    }

    function upload(request, response, next){
      // get id of service
    }

    // routes
    server.get('/agent/services', getServices);
    server.post('/agent/allocate', allocate);
    server.post('/agent/service/:id/upload', upload);
};