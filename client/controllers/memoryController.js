'use strict';

angular.module('brtmtApp')
	.controller('memoryController', function($scope, memoryService, $filter){
		$scope.memoryService = memoryService;
		$scope.ram = {};
		$scope.swap = {};
		
		$scope.ramBar = {};
		$scope.swapBar = {};
		
		$scope.ramValues = [];
		
		$scope.ramTooltip = '';
		$scope.swapTooltip = '';
		
		$scope.unit = 'MB';
		
		$scope.$watch('memoryService.memoryUsage', function(){
			$scope.ram = $scope.memoryService.getUsage().ram;
			$scope.swap = $scope.memoryService.getUsage().swap;
			
			var ramUsage = {};
			
			for(var type in $scope.ram){
				ramUsage[type] = (parseInt($scope.ram[type]) / parseInt($scope.ram.total)) * 100;
			}
			
			var usedRam = parseInt($scope.ram.total) - parseInt($scope.ram.free);
			
			$scope.ramValues = [
				{
					value: (usedRam - (parseInt($scope.ram.cached) + parseInt($scope.ram.buffered) + parseInt($scope.ram.shared))) / $scope.ram.total * 100,
					name: 'Used',
					type: 'danger'
				},
				{
					value: ramUsage.buffered,
					name: 'Buffered',
					type: 'warning'
				},
				{
					value: ramUsage.cached,
					name: 'Cached',
					type: 'success'
				},
				{
					value: ramUsage.shared,
					name: 'shared',
					type: 'default'
				}
			];
			
			// $scope.ramTooltip = 'Used '+ramBarValue.toFixed(2)+' % of '+$filter("unittransform")($scope.ram.total, 'MB', 2)+' MB';
			
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
);
