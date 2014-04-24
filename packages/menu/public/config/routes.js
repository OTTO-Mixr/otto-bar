'use strict';

angular.module('mean').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('menu main page', {
        url: '/menu/',
        templateUrl: 'menu/views/index.html'
      })
  }
])
