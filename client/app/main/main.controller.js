'use strict';

angular.module('brtmtApp')
  .controller('mainController', function ($scope, $http, socket) {
    $scope.hostInfo = {};

    $http.get('/api/basicInfo').success(function(basicInfo) {
		$scope.basicInfo = basicInfo;
		$scope.basicInfo.uptimeTimer = Math.round(new Date().getTime()  - basicInfo.uptime * 1000);
    });
});