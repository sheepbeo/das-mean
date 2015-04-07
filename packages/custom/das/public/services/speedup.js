'use strict';

/*
angular.module('mean.das').factory('Speedup', ['$resource',
	function($resource) {
		return $resource('speedup/:speedupId', {
			goalId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}]
);
/**/

angular.module('mean.das').service('Speedup', ['$http',
	function($http) {
		var urlBase = '/speedup';

		this.getAll = function() {
			return $http.get(urlBase);
		};
	}]
);