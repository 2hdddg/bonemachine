var assert = require('assert');
var sandbox = require('sandboxed-module');

function serviceFake(registration){
    var start_calls = 0;

    return {
        start: function(){
            start_calls++;
        },
        registration: registration,

        // for inspection
        start_calls: function() {
            return start_calls;
        }
    };
}

function registrationFake(port){
    return {
        port: port
    };
}

function create_port_range(min, max){
    return {
        min: min,
        max: max
    };
}

function create_allocation(name){
    return {
        name: 'servicename',
        install: {
        },
        start: {
        },
        commands: {
        }
    };
}

function registryFake(registrations){
    return {
        get_registrations: function(callback){
            callback(null, registrations);
        }
    };
}

var Agent = sandbox.require('../lib/agent/agent', {
    requires: {
        './service': {
            create: serviceFake
        }
    }
});


describe('agent.start', function(){
    it('should start all registered services', function(done) {
        var agent = Agent.create(registryFake([registrationFake()]));

        agent.start(function(err, services){
            assert.strictEqual(services[0].start_calls(), 1);
            done();
        });
    });
});

describe('agent.allocate', function(){
    it('should return registration on min port when no prior registrations', function(done){
        var range = create_port_range(7, 9);
        var agent = Agent.create(registryFake([]), range);
        var allocation = create_allocation('name');

        agent.allocate(allocation, function(err, registration){
            assert.strictEqual(registration.port, range.min);
            done();
        });
    })

    it('should find hole in port usage', function(done){
        var range = create_port_range(7, 9);
        var registrations = [
            registrationFake(7),
            registrationFake(9)
        ];
        var agent = Agent.create(registryFake(registrations), range);
        var allocation = create_allocation('name');

        agent.allocate(allocation, function(err, registration){
            assert.strictEqual(registration.port, 8);
            done();
        });
    })
});
