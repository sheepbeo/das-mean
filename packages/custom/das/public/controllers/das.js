'use strict';

/*
	Angular Controller

	Logic atm is here
*/

/* jshint -W098 */
angular.module('mean.das', ["chart.js"]).controller('DasController', ['$scope', 'Global', 'Speedup',
  function($scope, Global, Speedup) {
    $scope.global = Global;
    $scope.package = {
      name: 'das'
    };

    $scope.getAllSpeedups = function() {
    	//console.log(Speedup("hi"));
    	/*
    	Speedup.query(function(data) {
    		$scope.speedups = data;
    	});
		/**/
		Speedup.getAll()
			.success(function(data) {
				var speedups = data;



			})
			.error(function(error) {

			});
    };
    $scope.getAllSpeedups();

    
	
	$scope.labels = ['0-5', '5-10', '10-15', '15-20', '20-25', '25-30', '30+'];
	$scope.series = ['Speedup Distribution'];

	$scope.data = [
		[12, 22, 30, 44, 22, 12, 5]
	];
	
  }
]);

