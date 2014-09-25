'use strict';

var plot = new Object;

angular.module('brtmtApp')
	.controller('cpuController', function($scope, cpuService, $timeout){
		$scope.cpuService = cpuService;
		$scope.series = [];
		$scope.seriesTotal = {
			lines: {fill: true},
			data: [],
			label: '% Total CPU'
		};
		$scope.seriesPerCPU = [];
		$scope.xGraphCounter = 0;
		$scope.ticks = 100;
		$scope.viewOptions = [
			{name: 'perCpu', viewName: 'Per CPU'},
			{name: 'total', viewName: 'Total'},
		];
		$scope.viewActive = 'perCpu';
		
		function reDrawGraph(){
			var series;
			switch($scope.viewActive){
				case 'total': 
					series = [$scope.seriesTotal];
				break;
				case 'perCpu':
				default:
					series = $scope.seriesPerCPU;
				break;
			}
			$.plot('#flot-line-chart-moving', series, {
				grid: {
					borderWidth: 1,
					minBorderMargin: 20,
					labelMargin: 10,
					backgroundColor: {
						colors: ["#fff", "#e4f4f4"]
					},
					margin: {
						top: 8,
						bottom: 20,
						left: 20
					},
					markings: function(axes) {
						var markings = [];
						var xaxis = axes.xaxis;
						for (var x = Math.floor(xaxis.min); x < xaxis.max; x += xaxis.tickSize * 2) {
							markings.push({
								xaxis: {
									from: x,
									to: x + xaxis.tickSize
								},
								color: "rgba(232, 232, 255, 0.2)"
							});
						}
						return markings;
					}
				},
				xaxis: {
					tickFormatter: function() {
						return "";
					}
				},
				yaxis: {
					min: 0,
					max: function(){
						var maxValue = 1;
						if($scope.viewActive == 'total'){
							maxValue = 100;
						}else{
							for(var index in series){
								for(var entry in series[index].data){
									if(series[index].data[entry][1] > maxValue){
										maxValue = series[index].data[entry][1];
									}
								}
							}
						}
						return maxValue;
					}()
				},
				legend: {
					show: true
				}
			});
		}
		
		$scope.$watch('cpuService.cpuPercentage', function(){
			$scope.cpuPercentage = cpuService.getPercentage();
			var totalPercentage = 0;
			for(var index in $scope.cpuPercentage){
				totalPercentage += $scope.cpuPercentage[index].value / $scope.cpuPercentage.length;
				if(!$scope.seriesPerCPU[index]){
					$scope.seriesPerCPU[index] = {
						lines: {fill: true},
						data: [],
						label: '% CPU '+index
					};
				}
				index = parseInt(index);
				if($scope.seriesPerCPU[index].data.length > $scope.ticks){
					$scope.seriesPerCPU[index].data = 
						$scope.seriesPerCPU[index].data.slice($scope.seriesPerCPU[index].data.length - $scope.ticks);
				}
				
				$scope.seriesPerCPU[index].data.push([$scope.xGraphCounter, $scope.cpuPercentage[index].value]);
				
			}
			if($scope.seriesTotal.data.length > $scope.ticks){
				$scope.seriesTotal.data = 
					$scope.seriesTotal.data.slice($scope.seriesTotal.data.length - $scope.ticks);
			}
			
			$scope.seriesTotal.data.push([$scope.xGraphCounter, totalPercentage]);
			
			$scope.xGraphCounter += 1;
			reDrawGraph();
		});
		
		$scope.changeView = function(viewName){
			$scope.viewActive = viewName;
			reDrawGraph();
		}
	}	
);

