'use strict';

angular.module('mean').controller('BarController', ['$scope', 'Global',
  function($scope, Global, Bar) {
    $scope.global = Global;
    $scope.bar = {name:'bar'};

  }
]);