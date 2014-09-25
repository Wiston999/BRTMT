'use strict';

angular.module('brtmtApp')
	.controller('diskController', function($scope, diskService){
		$scope.diskService = diskService;
		$scope.diskUsage = {};
		
		
		$scope.$watch('diskService.diskStats', function(){
			$scope.diskUsage = $scope.diskService.getStats();		
		});
		
});
