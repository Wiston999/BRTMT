'use strict';

angular.module('brtmtApp')
	.controller('processesController', function($scope, processesService){
		$scope.processesService = processesService;
		$scope.processes = {};
		$scope.orderProp = 'etime';
		$scope.orderReverse = false;
		$scope.procSearch = '';
		
		$scope.$watch('processesService.processes', function(){
			$scope.processes = $scope.processesService.getProcesses();
			var procArray = [];
			for(var proc in $scope.processes.procs){
				$scope.processes.procs[proc]['pid'] = parseFloat($scope.processes.procs[proc]['pid']);
				$scope.processes.procs[proc]['etime'] = parseFloat($scope.processes.procs[proc]['etime']);
				$scope.processes.procs[proc]['etimeEpoch'] = Math.round(
					new Date().getTime()  - parseInt($scope.processes.procs[proc]['etime'])
				);
				procArray.push($scope.processes.procs[proc]);
			}
			$scope.processes.procs = procArray;
		});
		
});
