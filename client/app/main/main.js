'use strict';

angular.module('brtmtApp')
  .config(function ($routeProvider) {
	
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'mainController'
      });
  });