'use strict';

angular.module('mean').controller('SettingsController', ['$scope', '$http', 'Global',
  function($scope, $http, Global, Settings) {
    $scope.global = Global;
    $scope.titles = ["Warm","Cold"];

    // when landing on the page, get all drinks and show them
    $scope.installedDrinks = [];
    $scope.warmDrinks = [];
    $scope.coldDrinks = [];
    $scope.installedDrinks.push($scope.warmDrinks);
    $scope.installedDrinks.push($scope.coldDrinks);

    //Get all the currently installed drinks from db
    console.log('Getting installedDrinks from db..');
    $http.get('/api/installedDrinks')
      .success(function(data) {
        for(var i = 0; i < data.length; i++){
          console.log('Drink ' + i + ': ' + data[i]);
          if(i < 6){
              $scope.warmDrinks.push(data[i]);
          }
          else{
              $scope.coldDrinks.push(data[i]);
          }
        }
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });

    $scope.updateDrink = function(parentIndex, solenoidIndex) {
        $http.put('/api/installedDrinks/' + solenoidIndex, {
        name:$scope.installedDrinks[parentIndex][solenoidIndex].name,
        fullness: $scope.installedDrinks[parentIndex][solenoidIndex].fullness,
        carbonated: $scope.installedDrinks[parentIndex][solenoidIndex].carbonated
        })
        .success(function(data) {
          console.log('success!?');
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
    };

    $scope.drinkBackup = $scope.installedDrinks;

    $scope.suggestions = ["vodka","tequila","whiskey","kahlua","coke", "brandy", "wine"]

    $scope.sliderMultiplier = 1.78; //TODO change hardcode later
  }
]);
