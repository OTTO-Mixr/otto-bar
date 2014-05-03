'use strict';

angular.module('mean').controller('SettingsController', ['$scope', '$http', 'Global',
  function($scope, $http, Global, Settings) {
    $scope.global = Global;
    $scope.titles = ["Liquor","Mixers"];

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

    $scope.updateDrink = function(solenoidIndex) {
      if(solenoidIndex<=5){
          $http.put('/api/installedDrinks/'+solenoidIndex, {
          name:$scope.warmDrinks[solenoidIndex].name,
          fullness: $scope.warmDrinks[solenoidIndex].fullness,
          carbonated: $scope.warmDrinks[solenoidIndex].carbonated
          })
          .success(function(data) {
            console.log('success!?');
          })
          .error(function(data) {
            console.log('Error: ' + data);
          });
      }
      else{
          $http.put('/api/installedDrinks/'+solenoidIndex, {
          name:$scope.coldDrinks[solenoidIndex%6].name,
          fullness: $scope.coldDrinks[solenoidIndex%6].fullness,
          carbonated: $scope.coldDrinks[solenoidIndex%6].carbonated
          })
          .success(function(data) {
            console.log('success!?');
          })
          .error(function(data) {
            console.log('Error: ' + data);
          });
      }
      
    };

    $scope.drinkBackup = $scope.installedDrinks;

    $scope.suggestions = ["vodka","tequila","whiskey","kahlua","coke", "brandy", "wine"]

    $scope.sliderMultiplier = 1.78; //TODO change hardcode later
  }
]);
