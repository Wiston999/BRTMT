'use strict';

angular.module('brtmtApp')
	.controller('processesController', function($scope, processesService){
		$scope.processesService = processesService;
		$scope.processes = {};
		
		
		$scope.$watch('processesService.processes', function(){
			$scope.processes = $scope.processesService.getProcesses();		
		});
		
});
