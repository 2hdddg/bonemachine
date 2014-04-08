var assert = require('assert');
var _ = require('lodash');
var Registry = require('../lib/agent/registry');

// reads the real thing from filesystem since
// this class:s major responsibility is doing just that

function open_registry(){
    return Registry.open(__dirname + '/registry');
}


describe('registry.get_registrations', function(){
    it('should find two registrations', function(done){
        var registry = open_registry();
        registry.get_registrations(function(error, registrations){
            assert.strictEqual(registrations.length, 2);
            done();
        });
    });

    it('should have state "installed" on port 10', function(done){
        var registry = open_registry();
        registry.get_registrations(function(error, registrations){
            var on_port_10 = _.find(registrations, function(r){
                return r.port === 10;
            })
            assert.strictEqual(on_port_10.state, 'installed');
            done();
        });
    });

    it('should have name "service on port 12" on port 12', function(done){
        var registry = open_registry();
        registry.get_registrations(function(error, registrations){
            var on_port_12 = _.find(registrations, function(r){
                return r.port === 12;
            })
            assert.strictEqual(on_port_12.name, 'service on port 12');
            done();
        });
    });
});