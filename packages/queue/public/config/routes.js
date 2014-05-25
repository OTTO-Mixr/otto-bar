'use strict';

angular.module('mean').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('queue and stuff', {
        url: '/queue/',
        templateUrl: 'queue/views/index.html'
      })
  }
])
