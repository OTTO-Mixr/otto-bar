'use strict';

angular.module('mean').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('settings example page', {
        url: '/settings/example',
        templateUrl: 'settings/views/example.html'
      })
      .state('settings and stuff', {
        url: '/settings/',
        templateUrl: 'settings/views/index.html'
      })
  }
])
