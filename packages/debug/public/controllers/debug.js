'use strict';

angular.module('mean').controller('DebugController', ['$scope','$http','Global',
  function($scope, $http, Global, Debug) {
    $scope.global = Global;
    $scope.debug = {name:'debug'};
  
    $scope.solenoids = [];
    $scope.pump = false;

    for (var i = 0; i < 12; i++) {
      $scope.solenoids.push(false);
    }

    $scope.toggleSolenoid = function(index) {
      var method = $scope.solenoids[index] ? 'LOCK' : 'UNLOCK';
      $scope.solenoids[index] = !$scope.solenoids[index];
      var URL = '/solenoid/' + index;
      $http({method:method,url:URL});
    };

    $scope.togglePump = function() {
      var method = $scope.pump ? 'LOCK' : 'UNLOCK';
      $scope.pump = !$scope.pump;
      var URL = '/pump';
      $http({method:method,url:URL});
    }

  }
]);
