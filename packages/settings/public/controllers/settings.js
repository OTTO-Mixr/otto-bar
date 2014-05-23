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
    $scope.backupDrinks = [];
    $scope.backupWarm = [];
    $scope.backupCold = [];
    $scope.installedDrinks.push($scope.warmDrinks);
    $scope.installedDrinks.push($scope.coldDrinks);
    $scope.backupDrinks.push($scope.backupWarm);
    $scope.backupDrinks.push($scope.backupCold);

    //Get all the currently installed drinks from db
    console.log('Getting installedDrinks from db..');
    $http.get('/api/installedDrinks')
      .success(function(data) {
        data.sort(function(a,b) {return (a.solenoid > b.solenoid) ? 1 : ((b.solenoid > a.solenoid) ? -1 : 0);} );
        for(var i = 0; i < data.length; i++){
          console.log('Drink ' + i + ': ' + data[i]);
          if(i < 6){
              $scope.warmDrinks.push(data[i]);
              $scope.backupWarm.push(angular.copy(data[i]));
          } else {
              $scope.coldDrinks.push(data[i]);
              $scope.backupCold.push(JSON.parse(JSON.stringify(data[i])));
          }
        }
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });

    $scope.convertToOz = function(amt,units) {
      switch(units) {
        case 'ml':
          return amt * 0.033814;
        case 'oz':
          return amt;
        case 'L':
          return amt * 33.814;
        case 'gal':
          return amt * 128;
      }
    }

    $scope.updateDrink = function(parentIndex, solenoidIndex) {
        $http.put('/api/installedDrinks/' + (parentIndex==0?solenoidIndex:solenoidIndex+6), {
          //type:,
          name:$scope.installedDrinks[parentIndex][solenoidIndex].name,
          //abv:,
          carbonated: $scope.installedDrinks[parentIndex][solenoidIndex].carbonated,
          //density:,
          //refrigerated:(parentIndex==0?false:true),
          //size: $scope.convertToOz($scope.installedDrinks[parentIndex][solenoidIndex].size,$scope.installedDrinks[parentIndex][solenoidIndex].unit),
          emptiness: 100 - $scope.installedDrinks[parentIndex][solenoidIndex].emptiness
        })
        .success(function(data) {
          angular.copy($scope.installedDrinks[parentIndex][solenoidIndex],$scope.backupDrinks[parentIndex][solenoidIndex]);
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
    };

    $scope.cancelDrink = function(parentIndex,index) {
      angular.copy($scope.backupDrinks[parentIndex][index],$scope.installedDrinks[parentIndex][index]);
    };

    $scope.removeDrink = function(parentIndex,index) {
      $scope.installedDrinks[parentIndex][index].emptiness = 100;
      $scope.installedDrinks[parentIndex][index].name = 'empty';
      $scope.installedDrinks[parentIndex][index].carbonated = false;
      $scope.updateDrink(parentIndex,index);
    };

    $scope.suggestions = [];
    //Add suggestions here
    //Take from menu recipe ingredients!!!

    $scope.sliderMultiplier = 1.78; //TODO change hardcode later
  }
]);
