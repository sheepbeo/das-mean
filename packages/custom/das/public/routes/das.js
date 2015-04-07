'use strict';

/*
	angular routes
*/

angular.module('mean.das').config(['$stateProvider',
  function($stateProvider) {

    $stateProvider.state('das example page', {
      url: '/das/example',
      templateUrl: 'das/views/index.html'
    });

    $stateProvider.state('home page', {
      url: '/das',
      templateUrl: 'das/views/index.html'
    });
    
  }
]);
