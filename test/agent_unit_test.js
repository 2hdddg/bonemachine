var assert = require('assert');
var sandbox = require('sandboxed-module');

function serviceFake(registration){
    var startCalls = 0;

    return {
        start: function(){
            startCalls++;
        },
        registration: registration,

        // for inspection
        startCalls: function() {
            return startCalls;
        }
    };
}

function getRegistrationFake(port){
    return {
        port: port
    };
}

function createPortrange(min, max){
    return {
        min: min,
        max: max
    };
}

function createAllocation(name){
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

function getRegistryFake(registrations){
    return {
        getRegistrations: function(callback){
            callback(null, registrations);
        },
        register: function(registration, callback){
            callback(null, registration);
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
        var agent = Agent.create(getRegistryFake([getRegistrationFake()]));

        agent.start(function(err, services){
            assert.strictEqual(services[0].startCalls(), 1);
            done();
        });
    });
});

describe('agent.allocate', function(){
    it('should return registration on min port when no prior registrations', function(done){
        var range = createPortrange(7, 9);
        var agent = Agent.create(getRegistryFake([]), range);
        var allocation = createAllocation('name');

        agent.allocate(allocation, function(err, registration){
            assert.strictEqual(registration.port, range.min);
            done();
        });
    });

    it('should find hole in port usage', function(done){
        var range = createPortrange(7, 9);
        var registrations = [
            getRegistrationFake(7),
            getRegistrationFake(9)
        ];
        var agent = Agent.create(getRegistryFake(registrations), range);
        var allocation = createAllocation('name');

        agent.allocate(allocation, function(err, registration){
            assert.strictEqual(registration.port, 8);
            done();
        });
    });
});
