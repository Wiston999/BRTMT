'use strict';


angular.module('brtmtApp')
	.service('diskService', function(socket){
		
		var salida = {};

		salida.diskStats = {};
	
		salida.getStats = function(){
			return salida.diskStats;
		}
	
		socket.socket.on('diskNews', function(data){
			salida.diskStats = data;
		});
		
		return salida;
	}
);