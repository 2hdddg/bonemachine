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

describe('agent.start()', function(){
    var Agent = sandbox.require('../lib/agent/agent', {
        requires: {
            './service': {
                create: serviceFake
            }
        }
    });

    it('should start all registered services', function() {
        var agent = Agent.create({
            get_registrations: function(callback){
                callback(null, [registrationFake()]);
            }
        })

        agent.start();

        var services = agent.get_services();

        assert.strictEqual(services[0].start_calls(), 1);
    });
});