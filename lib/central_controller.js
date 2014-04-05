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

    POST /central/install
        installs a new service on an agent
        posted data:
            {
                agent: '<name of agent>',
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
                    },
                    package: '<base64 encoded zip>',
                    version: '<version of service?>'
                }
            }

        * forwards installation request to corresponding agent
        * when agent installed successfully it will suspend
        other instances of this service that share the same name
        * start the new instance
        * any new requests for the service will get the new service
        *after the last ttl timed out stop and remove the previously
        suspended services


*/