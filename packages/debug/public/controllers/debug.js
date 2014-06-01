'use strict';

angular.module('mean').controller('DebugController', ['$scope','$http','Global',
  function($scope, $http, Global, Debug) {
    $scope.global = Global;
    $scope.debug = {name:'debug'};
  
    $scope.titles = ["Warm","Cold"];

    $scope.warmOpen = [];
    $scope.coldOpen = [];
    $scope.drinks = [];

    $scope.drinks.push($scope.warmOpen);
    $scope.drinks.push($scope.coldOpen);

    for (var i = 0; i < 6; i++) {
      $scope.warmOpen.push(false);
      $scope.coldOpen.push(false);
    }

    $scope.toggle = function(parentIndex,solenoidIndex) {
      var method = $scope.drinks[parentIndex][solenoidIndex] ? 'LOCK' : 'UNLOCK';
      $scope.drinks[parentIndex][solenoidIndex] = !$scope.drinks[parentIndex][solenoidIndex];
      var URL = ((parentIndex == 0) ? 'warm' : 'cold') + '/'+solenoidIndex;
      $http({method:method,url:URL});
    };

  }
]);
