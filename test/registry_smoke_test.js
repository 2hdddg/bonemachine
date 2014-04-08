var assert = require('assert');
var Registry = require('../lib/agent/registry');

// reads the real thing from filesystem since
// this class:s major responsibility is doing just that

describe('registry.get_registrations', function(){
    it('should find two registrations', function(done){
        var registry = Registry.open(__dirname + '/registry');
        registry.get_registrations(function(error, registrations){
            assert.strictEqual(registrations.length, 2);
            done();
        });
    });


});