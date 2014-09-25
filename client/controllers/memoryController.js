'use strict';

angular.module('brtmtApp')
	.controller('memoryController', function($scope, memoryService, $filter){
		$scope.memoryService = memoryService;
		$scope.ram = {};
		$scope.swap = {};
		
		$scope.ramBar = {};
		$scope.swapBar = {};
		
		$scope.ramTooltip = '';
		$scope.swapTooltip = '';
		
		$scope.unit = 'MB';
		
		$scope.$watch('memoryService.memoryUsage', function(){
			$scope.ram = $scope.memoryService.getUsage().ram;
			$scope.swap = $scope.memoryService.getUsage().swap;
			
			var ramBarType = 'info';
			try{
				var ramBarValue = ($scope.ram.total - $scope.ram.free) / $scope.ram.total * 100;
			}catch(Exception){
				console.log($scope.ram);
				console.log($scope.memoryService.getUsage().ram);
				console.log($scope.memoryService);
			}
			if(ramBarValue >= 20 && ramBarValue < 40){
				ramBarType = 'primary';
			}else if(ramBarValue >= 40 && ramBarValue < 70){
				ramBarType = 'warning';
			}else if(ramBarValue >= 70){
				ramBarType = 'danger';
			}
			
			$scope.ramBar = {
				value: ramBarValue,
				type: ramBarType
			};
			
			$scope.ramTooltip = 'Used '+ramBarValue.toFixed(2)+' % of '+$filter("unittransform")($scope.ram.total, 'MB', 2)+' MB';
			
			var swapBarType = 'info';
			var swapBarValue = ($scope.swap.total - $scope.swap.free) / $scope.swap.total * 100;
			if(swapBarValue >= 20 && swapBarValue < 40){
				swapBarType = 'primary';
			}else if(swapBarValue >= 40 && swapBarValue < 70){
				swapBarType = 'warning';
			}else if(swapBarValue >= 70){
				swapBarType = 'danger';
			}
			
			$scope.swapBar = {
				value: swapBarValue,
				type: swapBarType
			};
			
			$scope.swapTooltip = 'Used '+swapBarValue.toFixed(2)+' % of '+$filter("unittransform")($scope.swap.total, 'MB', 2)+' MB'
		});
	}	
).filter('unittransform', function() {
    return function(input, unit, round) {
		var factor = 1;
		var numRound = round || 3;
		switch(unit){
			case 'MB':
				factor = 1024;
			break;
			case 'GB':
				factor = 1024*1024;
			break;
		}
		input = parseInt(input);
		return (input / factor).toFixed(numRound);
    }
});
