var assert = require('assert');
var _ = require('lodash');
var fs = require('fs');
var Registry = require('../lib/agent/registry');

// reads the real thing from filesystem since
// this class:s major responsibility is doing just that

function open_registry(){
    return Registry.open(__dirname + '/registry');
}

var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

function open_empty_registry(){
    return Registry.open(__dirname + '/registry_empty');
}

function ensure_empty_registry_is_empty(){
    var registry_path = __dirname + '/registry_empty';
    deleteFolderRecursive(registry_path);
    fs.mkdirSync(registry_path);
}

function create_registration(port, name, state){
    return {
        port: port,
        name: name,
        state: state,
        start: {
            command: 'x',
            args: [1, 2]
        }
    };
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

describe('registry.register', function(){
    it('can register', function(done){
        ensure_empty_registry_is_empty();
        var registry = open_empty_registry();
        var registration = create_registration(666, 'a name', 'installed');
        registry.register(registration, function(error, r){
            if (error) return done(error);

            // just to check that it adds registration to callback
            assert.strictEqual(r.port, registration.port);

            // reopen to ensure that it was persisted
            registry = open_empty_registry();
            registry.get_registrations(function(error, registrations){
                if (error) return done(error);

                assert.strictEqual(registrations[0].state, 'installed');
                done();
            });
        });
    });
});