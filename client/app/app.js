'use strict';

angular.module('brtmtApp', [
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'btford.socket-io',
  'ui.bootstrap',
  // 'truncate',
  'timer'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  }).filter('capitalize', function() {
    return function(input, all) {
      return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
    }
  }).filter('unittransform', function() {
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
});;