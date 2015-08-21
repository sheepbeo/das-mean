'use strict';

/*
	Angular Controller

	Logic atm is here
*/

/* jshint -W098 */
angular.module('mean.das', ['chart.js']).controller('DasController', ['$scope', 'Global', 'Speedup', 'TestData',
  function($scope, Global, Speedup, TestData) {
    $scope.global = Global;
    $scope.package = {
      name: 'das'
    };

    $scope.label1 = [];
	$scope.label2 = [];
    $scope.label3 = [];
    $scope.label4 = [];
    $scope.label5 = [];
    $scope.label6 = [];
    $scope.label7 = [];
    $scope.label8 = [];

    $scope.data1 = [ [] ];
    $scope.data2 = [ [] ];
    $scope.data3 = [ [] ];
    $scope.data4 = [ [] ];
    $scope.data5 = [ [] ];
    $scope.data6 = [ [] ];
    $scope.data7 = [ [] ];
    $scope.data8 = [ [] ];

    $scope.series2 = [];

	Chart.defaults.global.colours[0] = "#F27952";

	var allSpeedups = [];
	var timeMarks = [0, 5, 10, 30, 60, 120, 240, 480, 1440];
    var levelMarks = [1, 4, 7];



    



/********* private functions **************/

	function getHorizontalValues(type) {
    	var values = [];

    	if (type == "timeLeft" || type ==  "timeTotal") {
    		for (var i=0; i<timeMarks.length; i++) {
    			if (i != timeMarks.length - 1) {
    				values.push(timeMarks[i] + "-" + timeMarks[i+1]);
    			} else {
    				values.push(timeMarks[i] + "+");
    			}
    		}
    	}

    	if (type == "premiumSpent") {
    		var max = 5;

    		for (var i=0; i<allSpeedups.length; i++) {
				var speedup = allSpeedups[i];
				if (max < speedup.premiumSpent) {
					max = speedup.premiumSpent;
				}
			}

			for (var i=0; i<=max; i++) {
				values.push(i);
			}
    	}

    	if (type == "premium") {
			var max = 5;

    		for (var i=0; i<allSpeedups.length; i++) {
				var speedup = allSpeedups[i];
				if (max < speedup.context.premium) {
					max = speedup.context.premium;
				}
			}

			for (var i=0; i<=max; i++) {
				values.push(i);
			}
    	}

        if (type == "level") {
            for (var i=0; i<levelMarks.length; i++) {
                if (i != levelMarks.length - 1) {
                    values.push(levelMarks[i] + "-" + levelMarks[i+1]);
                } else {
                    values.push(levelMarks[i] + "+");
                }
            }
        }

        console.log(values);

    	return values;
    }

    function getVerticalValues(typeHoz, typeVer) {
    	var values = [];
    	var valuesHorz = getHorizontalValues(typeHoz);

    	for (var i=0; i<valuesHorz.length; i++) {
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

    		if (typeHoz == "timeTotal") {
    			for (var i=0; i<allSpeedups.length; i++) {
					var speedup = allSpeedups[i];

					var times = speedup.timeTotal.split(':');
					var totalMinutes = parseInt(times[0]) * 60 + parseInt(times[1]);

					var index = getIndexFromRange(totalMinutes, timeMarks);
					values[index]++;
				}
    		}

    		if (typeHoz == "premiumSpent") {
    			for (var i=0; i<allSpeedups.length; i++) {
					var speedup = allSpeedups[i];

					values[speedup.premiumSpent]++;
				}
    		}

    		if (typeHoz == "premium") {
    			for (var i=0; i<allSpeedups.length; i++) {
					var speedup = allSpeedups[i];

					values[speedup.context.premium]++;
				}
    		}

            if (typeHoz == "level") {
                for (var i=0; i<allSpeedups.length; i++) {
                    var speedup = allSpeedups[i];

                    var index = getIndexFromRange(speedup.context.level, levelMarks);
                    values[index]++;
                }
            }
    	}

        console.log("values : ");
        console.log(values);

    	return values;
    }

    function getTestData(type) {
        switch (type) {
            case "" :
                break;
            case "" :

                break;
            case "" :

                break;
            default:
                break;
        }
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


    $scope.getTestData = function(type, callBack) {
        TestData.scope = $scope;
        TestData.getCrunchedData(type)
            .success(function(data) {
                callBack(true, data);
            })
            .error(function(error) {
                callBack(false, data);
            });
    };


/************ /end private functions ***************/
    
    /*
    // initialization
    $scope.getAllSpeedups(function(result) {
        console.log(result);

        if (result) {
            $scope.label1 = getHorizontalValues("timeLeft");
            $scope.data1[0] = getVerticalValues("timeLeft", "count");

            $scope.label2 = getHorizontalValues("timeTotal");
            $scope.data2[0] = getVerticalValues("timeTotal", "count");

            $scope.label3 = getHorizontalValues("premiumSpent");
            $scope.data3[0] = getVerticalValues("premiumSpent", "count");

            $scope.label4 = getHorizontalValues("premium");
            $scope.data4[0] = getVerticalValues("premium", "count");

            $scope.label5 = getHorizontalValues("level");
            $scope.data5 = getVerticalValues("level", "count");

            $scope.label6 = getHorizontalValues("premiumSpent");
            $scope.data6[0] = getVerticalValues("premiumSpent", "count");

            $scope.label7 = getHorizontalValues("premiumSpent");
            $scope.data7[0] = getVerticalValues("premiumSpent", "count");

            $scope.label8 = getHorizontalValues("premiumSpent");
            $scope.data8[0] = getVerticalValues("premiumSpent", "count");
        }

        
        console.log(allSpeedups);
    });
    /**/

    $scope.getTestData('crunchedSpeedupAverage', function(result, data) {

        if (result) {
            $scope.label1 = ['0-5m', '5-10m', '10-15m' , '15-20m', '20-25m', '25-30m', '30-40m', '40-50m', '50-60m'];
            $scope.data1[0] = data;
        }
    });

    $scope.getTestData('crunchedSpeedupTotal', function(result, data) {

        if (result) {
            $scope.label2 = ['1 Aug', '2 Aug', '3 Aug' , '4 Aug', '5 Aug', '6 Aug', '7 Aug', '8 Aug', '9 Aug', '10 Aug', '11 Aug', '12 Aug', '13 Aug', '14 Aug'];
            $scope.data2[0] = data;
        }
    });

    $scope.getTestData('crunchedChurnReason', function(result, data) {

        if (result) {
            $scope.label3 = ['Failed tutorial', 'Social abused', 'Not enough content' , 'Unsuitable alliance', 'Undefined'];
            $scope.data3 = data;
        }
    });
    

    $scope.getTestData('allianceSuggestionMatrix', function(result, data) {

        if (result) {
            console.log(data);
            var displayData = [];

            var labels = ['low-low', 'low-med', 'low-high', 'med-low', 'med-med', 'med-high', 'high-low', 'high-med', 'high-high'];
            for (var i=0; i<data.length; i++) {
                if (data[i] != null) {
                    var row = {
                        data : data[i],
                        label : labels[i]        
                    };
                    
                    displayData.push(row);
                }
            }

            labels.unshift('');

            $scope.label4 = labels;
            $scope.data4 = displayData; 
            /**/
        }
    });

    $scope.getTestData('allianceSuggestionList', function(result, data) {

        if (result) {
            var displayData = data;

            var labels = ['Alliance Name', 'Alliance Level', 'Alliance Socialness'];

            $scope.label5 = labels;
            $scope.data5 = displayData;
            /**/
        }
    });
  }
]);

