'use strict';

angular.module('mean').controller('QueueController', ['$scope', '$http', 'Global',
  function($scope, $http, Global, Queue) {
    $scope.global = Global;
    $scope.queue = {name:'queue'};

    $scope.orders = [{
      "order": {
        "human":{
          "name":"The Dude",
          "cell":"1234567890"
        },
        "cocktail": {
          "name":"White Russian",
          "routes":[
            "/warm/0/1",
            "/cold/1/2"
          ]
        }
      }
    }];

    $http.get('/queue/')
      .success(function(data) {
        $scope.orders = data;
      })
      .error(function(data) {
        console.log(data);
      });

    }
]);
