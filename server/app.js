/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
var server = require('http').createServer(app);
var socketio = require('socket.io')(server, {
  serveClient: (config.env === 'production') ? false : true,
  path: '/socket.io-client'
});
require('./config/socketio')(socketio);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

var CpuDispatcher 		= require('./components/classes/dispatchers/cpuDispatcher.js');
var MemoryDispatcher 	= require('./components/classes/dispatchers/memoryDispatcher.js');
var UsersDispatcher 	= require('./components/classes/dispatchers/usersDispatcher.js');
var ProcessesDispatcher = require('./components/classes/dispatchers/processesDispatcher.js');
var DiskDispatcher 		= require('./components/classes/dispatchers/diskDispatcher.js');

console.log('Creating Dispatchers');
var dispatchers = new Array();
dispatchers.push(new CpuDispatcher(socketio, mongoose));
dispatchers.push(new MemoryDispatcher(socketio, mongoose));
dispatchers.push(new UsersDispatcher(socketio, mongoose));
dispatchers.push(new ProcessesDispatcher(socketio, mongoose));
dispatchers.push(new DiskDispatcher(socketio, mongoose));

console.log('Dispatchers Created');

console.log('Starting Dispatchers');
for(var dispatcherId in dispatchers){
	console.log('Dispatcher with id='+dispatcherId+' started');
	dispatchers[dispatcherId].run();
}

socketio.on('connection', function(){
	for(var dispatcherId in dispatchers){
		dispatchers[dispatcherId].io.sockets.emit(
			dispatchers[dispatcherId].socketMessage, 
			dispatchers[dispatcherId].data
		);
	}
});

// Expose app
exports = module.exports = app;