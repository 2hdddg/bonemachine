var cli = require('nomnom');
var fs = require('fs');

// register all commands
var commands = fs.readdirSync(__dirname + '/commands/');
commands.forEach(function(name){
    var command = require(__dirname + '/commands/' + name);
    command.register(cli);
});

cli.parse();