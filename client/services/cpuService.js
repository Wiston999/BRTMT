'use strict';


angular.module('brtmtApp')
	.service('cpuService', function(socket){
		
		var salida = {};

		salida.cpuPercentage = [];
	
		salida.getPercentage = function(){
			return salida.cpuPercentage;
		}
	
		socket.socket.on('cpuNews', function(data){
			var arrayData = [];
			for(var index in data){
				var value = data[index] * 100;
				var severity = 'success';
				if(value > 90){
					severity = 'danger';
				}else if(value <= 90 && value > 60){
					severity = 'warning';
				}else if(value <= 60 && value > 30){
					severity = 'info';
				}
				arrayData.push({id: index, value: value, severity: severity});
			}
			salida.cpuPercentage = arrayData;
			if(salida.callback){
				salida.callback(salida.cpuPercentage);
			}
		});
		
		salida.onNews = function(callback){
			salida.callback = callback;
		}
		
		return salida;
	}
);