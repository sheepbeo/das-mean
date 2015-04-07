'use strict';

/*
	Angular Controller

	Logic atm is here
*/

/* jshint -W098 */
angular.module('mean.das', ['chart.js']).controller('DasController', ['$scope', 'Global', 'Speedup',
  function($scope, Global, Speedup) {
    $scope.global = Global;
    $scope.package = {
      name: 'das'
    };

    $scope.labels = ['0-5', '5-10', '10-15', '15-20', '20-25', '25-30', '30+'];
	$scope.series = ['Speedup Distribution'];
	$scope.data = [
		[0, 0, 0, 0, 0, 0, 0]
	];

    $scope.getAllSpeedups = function() {
		Speedup.scope = $scope;
		Speedup.getAll()
			.success(function(data) {
				var speedups = data;

				var i = 0;

				for (i=0; i<speedups.length; i++) {
					var speedup = speedups[i];

					console.log(speedup.timeLeft);
					var times = speedup.timeLeft.split(':');
					var totalMinutes = parseInt(times[0]) * 60 + parseInt(times[1]);

					var index = Math.floor(totalMinutes / 5);
					console.log(times);
					console.log(index);
					console.log(parseInt(times[1]));
					
					index = Math.min(index, $scope.data[0].length-1);
					console.log(index);

					$scope.data[0][index] += 1;
				}

			})
			.error(function(error) {

			});
    };
    $scope.getAllSpeedups();


  }
]);

