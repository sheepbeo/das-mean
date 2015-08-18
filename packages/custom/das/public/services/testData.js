'use strict';

angular.module('mean.das').service('TestData', ['$http',
	function($http) {
		var urlBase = '/TestData';

		this.getCrunchedData = function(type) {
			return $http.get(urlBase + '/' + type);
		};
	}]
);