'use strict';

angular.module('mean').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('debug example page', {
        url: '/debug/',
        templateUrl: 'debug/views/index.html'
      })
  }
])
