'use strict';


angular.module('brtmtApp')
	.service('memoryService', function(socket){
		
		var salida = {};

		salida.memoryUsage = {};
	
		salida.getUsage = function(){
			return salida.memoryUsage;
		}
	
		socket.socket.on('memoryNews', function(data){
			salida.memoryUsage = data;
		});
		
		salida.onNews = function(callback){
			
		}
		
		return salida;
	}
);