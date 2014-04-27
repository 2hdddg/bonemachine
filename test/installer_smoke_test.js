var path = require('path');
var assert = require('assert');
var Installer = require('../lib/installer/installer');

function getServicePath(){
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

describe('installer.getDescription', function(){
    it('can read a valid service description', function(done){
        var installer = Installer.create();

        installer.getDescription(getServicePath(), function(error, serviceDescription){
            if (error) return done(error);

            assert.deepEqual(serviceDescription, service);
            done();
        });
    });
});