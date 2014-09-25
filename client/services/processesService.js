'use strict';


angular.module('brtmtApp')
	.service('processesService', function(socket){
		
		var salida = {};

		salida.processes = {};
	
		salida.getProcesses = function(){
			return salida.processes;
		}
	
		socket.socket.on('processesNews', function(data){
			salida.processes = data;
		});
		
		return salida;
	}
);