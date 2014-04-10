var path = require('path');
var assert = require('assert');
var Installer = require('../lib/installer/installer');

function service_path(){
    return path.join(__dirname, 'service');
}

var service = {
    name: 'a name',
    install: {
        command: 'install command',
        args: [],
        port_arg: 0
    },
    start: {
        command: 'start command',
        args: [],
        port_arg: 1
    },
    commands: {
        suspend: {
            href: '',
        },
        stop: {
            href: ''
        }
    }
};

describe('installer.retrieve_service_description', function(){
    it('can read a valid service', function(done){
        var installer = Installer.create();

        installer.retrieve_service_description(service_path(), function(error, service_description){
            if (error) return done(error);

            assert.equal(service_description, service)
            done();
        });
    });
})