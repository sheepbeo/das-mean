'use strict';

/* jshint -W098 */
angular.module('mean.das').controller('DasController', ['$scope', 'Global', 'Das',
  function($scope, Global, Das) {
    $scope.global = Global;
    $scope.package = {
      name: 'das'
    };
  }
]);
