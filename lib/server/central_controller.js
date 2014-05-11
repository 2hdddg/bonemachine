
module.exports.initialize = function(central, server){

    function allocate(request, response, next){

    }

    // routes for central
    server.get('/central/allocate', allocate);

}

/*
Central api:
    POST /central/register
        Registers a new agent
        name and location
        name should be unique
        typically used by setup

    GET /central/agents
        returns all registered agents, name+location

    GET /central/service?name='<name of service' 
        lookup used by consumers
        returns location of service+time to live (how long it is valid)

    POST /central/allocate
        allocates a new service on an agent
        posted data:
            {
                requirements: {
                    agent: '<name of agent>'
                },
                service: {
                    name: '<name of service>',
                    install: {
                        command: '<installation command>'
                        args: [],
                        port_arg: <optional index of port>
                    },
                    start: {
                        command: '<start command>',
                        args: [],
                        port_arg: <NON optional index of port> 
                    },
                    commands: {
                        suspend: {
                            href: '<relative path to notify running service that its being suspended>',                            
                        },
                        stop: {
                            href: '<>'
                        }
                    }
                }
            }

        response:
            {
    
            }


        * allocates a new service "slot" on agent, in state receive, 
        returns service slot with url to post package to to client
        * Uploads package url on corresponding agent
        * Requests agent to install
        * when agent installed successfully it will suspend
        other instances of this service that share the same name
        * start the new instance
        * any new requests for the service will get the new service
        *after the last ttl timed out stop and remove the previously
        suspended services


*/