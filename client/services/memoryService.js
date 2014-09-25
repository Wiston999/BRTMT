'use strict';


angular.module('brtmtApp')
	.service('memoryService', function(socket){
		
		var salida = {};

		salida.memoryUsage = {
			ram: {
				total: 0,
				free: 0
			},
			swap: {
				total: 0,
				free: 0
			}
		};
		
		salida.getUsage = function(){
			return salida.memoryUsage;
		}
	
		socket.socket.on('memoryNews', function(data){
			salida.memoryUsage = data;
		});
		
		return salida;
	}
);