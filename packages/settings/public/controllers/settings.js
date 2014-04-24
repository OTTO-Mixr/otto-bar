'use strict';

angular.module('mean').controller('SettingsController', ['$scope', 'Global',
  function($scope, Global, Settings) {
    $scope.global = Global;
    $scope.settings = {name:'zsettingss'};

    $scope.liquors = [
      {
        name: 'Whiskey',
        fullness: 50,
        carbonated: false
      }, {
        name: 'Mezcal',
        fullness: 40,
        carbonated: false
      }, {
        name: 'Rum',
        fullness: 10,
        carbonated: true 
      }, {
        name: 'Vodka',
        fullness: 78,
        carbonated: false
      }, {
        name: 'Tequila',
        fullness: 2,
        carbonated: true
      }, {
        name: 'Gin',
        fullness: 23,
        carbonated: false
      }
    ];

    $scope.suggestions = ["vodka","tequila","whiskey","kahlua","coke", "brandy", "wine"]

    $scope.test = 0;
    $scope.carbonated = false;
    $scope.sliderMultiplier = 1.78; //TODO change hardcode later
  }
]);
