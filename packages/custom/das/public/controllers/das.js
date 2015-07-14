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

	Chart.defaults.global.colours[0] = "#F27952";

	var allSpeedups = [];
	var timeMarks = [0, 5, 10, 30, 60, 120, 240, 480, 1440];

	function getHorizontalValues(type) {
    	var values = [];

    	if (type == "timeLeft") {
    		for (var i=0; i<timeMarks.length; i++) {
    			if (i != timeMarks.length - 1) {
    				values.push(timeMarks[i] + "-" + timeMarks[i+1]);
    			} else {
    				values.push(timeMarks[i] + "+");
    			}
    		}
    	}

    	return values;
    }

    function getVerticalValues(typeHoz, typeVer) {
    	var values = [];

    	for (var i=0; i<getHorizontalValues(typeHoz).length; i++) {
    		values.push(0);
    	}

    	if (typeVer == "count") {
    		if (typeHoz == "timeLeft") {
    			for (var i=0; i<allSpeedups.length; i++) {
					var speedup = allSpeedups[i];

					var times = speedup.timeLeft.split(':');
					var totalMinutes = parseInt(times[0]) * 60 + parseInt(times[1]);

					var index = getIndexFromRange(totalMinutes, timeMarks);
					values[index]++;
				}
    		}
    	}

    	return values;
    }

    function getIndexFromRange(number, rangeArray) {
    	if (rangeArray.length > 0) {
    		for (var i=0; i<rangeArray.length-2; i++) {
    			if (number < rangeArray[i+1]) {
    				return i;
    			}
    		}

    		return rangeArray.length-1;
    	}

    	return false;
    }

    $scope.getAllSpeedups = function(callBack) {
		Speedup.scope = $scope;
		Speedup.getAll()
			.success(function(data) {
				allSpeedups = data;
				callBack(true);
			})
			.error(function(error) {
				callBack(false);
			});
    };
    

    $scope.optionVertical = "count";
    $scope.optionHorizontal = "timeLeft";

    $scope.updateGraph = function() {
		$scope.labels = getHorizontalValues($scope.optionHorizontal);
		$scope.data[0] = getVerticalValues($scope.optionHorizontal, $scope.optionVertical);
    }

    

    


    // initialization
    $scope.getAllSpeedups(function(result) {
    	if (result) {
    		$scope.updateGraph();
    	}
    });
  }
]);

