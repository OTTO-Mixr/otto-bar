'use strict';

angular.module('mean').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('recipes and stuff', {
        url: '/recipes/',
        templateUrl: 'recipes/views/index.html'
      })
  }
])
