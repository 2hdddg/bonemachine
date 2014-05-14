var assert = require('assert');
var _ = require('lodash');
var fs = require('fs');
var Registry = require('../lib/agent/registry');

// reads the real thing from filesystem since
// this class:s major responsibility is doing just that

function openRegistry(){
    return Registry.open(__dirname + '/registry');
}

function deleteFolderRecursive(path) {
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
}

function openEmptyregistry(){
    return Registry.open(__dirname + '/registry_empty');
}

function ensureEmptyregistryisEmpty(){
    var registryPath = __dirname + '/registry_empty';
    deleteFolderRecursive(registryPath);
    fs.mkdirSync(registryPath);
}

function createRegistration(port, name, state){
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

describe('registry.getRegistrations', function(){
    it('should find two registrations', function(done){
        var registry = openRegistry();
        registry.getRegistrations(function(error, registrations){
            assert.strictEqual(registrations.length, 2);
            done();
        });
    });

    it('should have state "installed" on port 10', function(done){
        var registry = openRegistry();
        registry.getRegistrations(function(error, registrations){
            var on_port_10 = _.find(registrations, function(r){
                return r.port === 10;
            });
            assert.strictEqual(on_port_10.state, 'installed');
            done();
        });
    });

    it('should have name "service on port 12" on port 12', function(done){
        var registry = openRegistry();
        registry.getRegistrations(function(error, registrations){
            var on_port_12 = _.find(registrations, function(r){
                return r.port === 12;
            });
            assert.strictEqual(on_port_12.name, 'service on port 12');
            done();
        });
    });
});

describe('registry.register', function(){
    it('can register', function(done){
        ensureEmptyregistryisEmpty();
        var registry = openEmptyregistry();
        var registration = createRegistration(666, 'a name', 'installed');
        registry.register(registration, function(error, r){
            if (error) return done(error);

            // just to check that it adds registration to callback
            assert.strictEqual(r.port, registration.port);

            // reopen to ensure that it was persisted
            registry = openEmptyregistry();
            registry.getRegistrations(function(error, registrations){
                if (error) return done(error);

                assert.strictEqual(registrations[0].state, 'installed');
                done();
            });
        });
    });

    it('should assign a unique id to the registration', function(done){
        ensureEmptyregistryisEmpty();
        var registry = openEmptyregistry();
        var registration = createRegistration(666, 'a name', 'installed');
        registry.register(registration, function(error, r1){
            var id = r1.id;
            // do it again to check that it is not dependent on naming
            ensureEmptyregistryisEmpty();
            registry = openEmptyregistry();
            registry.register(registration, function(error, r2){
                assert.ok(id !== r2.id);
                done();
            });
        });
    })
});
