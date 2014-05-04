'use strict';

angular.module('mean').controller('SettingsController', ['$scope', '$http', 'Global',
  function($scope, $http, Global, Settings) {
    $scope.global = Global;
    $scope.titles = ["Warm","Cold"];
    $scope.units = ["ml","oz","L","gal"];
    $scope.unit= $scope.units[0];

    // when landing on the page, get all drinks and show them
    $scope.installedDrinks = [];
    $scope.warmDrinks = [];
    $scope.coldDrinks = [];
    $scope.installedDrinks.push($scope.warmDrinks);
    $scope.installedDrinks.push($scope.coldDrinks);

    //TODO PUT THIS IN A SEPARATE FILE AND INCLUDE IT
    $scope.drinkMap = {};
    $scope.drinkMap['grey goose'] = {
        type : 'vodka',
        abv : 40,
        density : 1
    }
    $scope.drinkMap['vodka'] = {
        type : 'vodka',
        abv : 40,
        density : 1
    }
    $scope.drinkMap['tequila'] = {
        type : 'tequila',
        abv : 40,
        density : 1
    }
    $scope.drinkMap['whiskey'] = {
        type : 'whiskey',
        abv : 40,
        density : 1
    }
    $scope.drinkMap['lemonade'] = {
        type : 'lemonade',
        abv : 0,
        density : 1
    }
    $scope.drinkMap['pink lemonade'] = {
        type : 'lemonade',
        abv : 0,
        density : 1
    }
    $scope.drinkMap['empty'] = {
        type : 'empty',
        size : 100,
        carbonated : false,
        abv : 0,
        density : 1
    }

    //Get all the currently installed drinks from db
    console.log('Getting installedDrinks from db..');
    $http.get('/api/installedDrinks')
      .success(function(data) {
        data.sort(function(a,b) {return (a.solenoid > b.solenoid) ? 1 : ((b.solenoid > a.solenoid) ? -1 : 0);} );
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
        if($scope.installedDrinks[parentIndex][solenoidIndex].name in $scope.drinkMap){
            $http.put('/api/installedDrinks/' + (parentIndex==0?solenoidIndex:solenoidIndex+6), {
              type:$scope.drinkMap[$scope.installedDrinks[parentIndex][solenoidIndex].name].type,
              name:$scope.installedDrinks[parentIndex][solenoidIndex].name,
              abv:$scope.drinkMap[$scope.installedDrinks[parentIndex][solenoidIndex].name].abv,
              carbonated: $scope.installedDrinks[parentIndex][solenoidIndex].carbonated,
              density:$scope.drinkMap[$scope.installedDrinks[parentIndex][solenoidIndex].name].density,
              fullness: $scope.installedDrinks[parentIndex][solenoidIndex].fullness
            })
            .success(function(data) {
              console.log('success!?');
            })
            .error(function(data) {
              console.log('Error: ' + data);
            });
        }
        else{
            alert('Fuck you, idk what the fuck you\'re talking about');
        }
    };

    $scope.drinkBackup = $scope.installedDrinks;

    $scope.suggestions = [];
    for(var key in $scope.drinkMap){
      $scope.suggestions.push(key);
    }

    $scope.sliderMultiplier = 1.78; //TODO change hardcode later
  }
]);
