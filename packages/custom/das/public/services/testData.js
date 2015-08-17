'use strict';

angular.module('mean.das').service('TestData', ['$http',
	function($http) {
		var urlBase = '/TestData';

		this.getAll = function() {
			return $http.get(urlBase);
		};
	}]
);