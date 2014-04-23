'use strict';

angular.module('mean').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('bar open solenoid', {
        url: '/bar/example',
        templateUrl: 'bar/views/index.html'
      })
  }
])

