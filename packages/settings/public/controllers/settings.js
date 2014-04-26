'use strict';

angular.module('mean').controller('SettingsController', ['$scope', 'Global',
  function($scope, Global, Settings) {
    $scope.global = Global;
    $scope.settings = {name:'zsettingss'};

    $scope.drinks = [
    {
      title: "Liquor? I barely know her.",
      bebidas: [{
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
      }]
    },
    {
      title: "Mixer? I, uh, I got nothing.",
      bebidas: [
      {
        name: 'Orange Juice',
        fullness: 12,
        carbonated: false
      }, {
        name: '7-Up',
        fullness: 75,
        carbonated: true
      }, {
        name: 'Cream',
        fullness: 10,
        carbonated: false
      }, {
        name: 'Lemonaid',
        fullness: 28,
        carbonated: false
      }, {
        name: 'Ice-T',
        fullness: 69,
        carbonated: false
      }, {
        name: 'Coke',
        fullness: 23,
        carbonated: true
      }]
    }
    ];

    $scope.drinkBackup = $scope.drinks;

    $scope.suggestions = ["vodka","tequila","whiskey","kahlua","coke", "brandy", "wine"]

    $scope.test = 0;
    $scope.carbonated = false;
    $scope.sliderMultiplier = 1.78; //TODO change hardcode later
  }
]);
