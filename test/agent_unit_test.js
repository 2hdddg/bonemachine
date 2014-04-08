var assert = require('assert');
var sandbox = require('sandboxed-module');

function serviceFake(){
    var start_calls = 0;

    return {
        start: function(){
            start_calls++;
        },

        // for inspection
        start_calls: function() {
            return start_calls;
        }
    };
}

function registrationFake(){
    return {
        command: {}
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
        var agent = Agent.create({
            get_registrations: function(callback){
                callback(null, [registrationFake()]);
            }
        })

        agent.start(function(err, services){
            assert.strictEqual(services[0].start_calls(), 1);
            done();
        });
    });
});

describe('agent.allocate', function(){
    it('should return registration on min port when no prior registrations', function(done){
        var agent = Agent.create({
            get_registrations: function(callback){
                callback(null, []);
            }
        }, {
            min: 7,
            max: 9
        });

        agent.allocate({
            name: 'servicename',
            install: {
            },
            start: {
            },
            commands: {
            }
        }, function(err, registration){
            assert.strictEqual(registration.port, 7);
            done();
        });
    })
});
