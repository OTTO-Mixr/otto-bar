'use strict';

angular.module('mean').controller('MenuController', ['$scope', '$modal','$http','Global',
  function($scope, $modal, $http, Global, Menu) {
    $scope.global = Global;
    $scope.menu = {name:'menu'};

    //Get the currently installed drinks to check that the user has the right drinks installed
    $scope.installedDrinks = [];
    $http.get('/api/installedDrinks')
      .success(function(data) {
        for(var i = 0; i < data.length; i++){
          $scope.installedDrinks.push(data[i]);
        }
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });

    $scope.confirm = function(selectedDrink) {
      $scope.selectedDrink = selectedDrink;
      var modalInstance = $modal.open({
        templateUrl: 'confirm.html',
        controller: confirmControl,
        resolve: {
          selectedDrink: function() {
            return $scope.selectedDrink;
          },
          installedDrinks: function() {
            return $scope.installedDrinks;
          }
        }
      });

      modalInstance.result.then(function (selectedDrink) {
        angular.forEach(selectedDrink.recipe, function(ingredient,key) {
          urlBase = (ingredient.refrigerated) ? '/cold/' : '/warm/';
          $http({method: 'UNLOCK', url: urlBase +
            ingredient.solenoid + '/' + ingredient.ounces});
        });
      });
    };

    var confirmControl = function($scope, $modalInstance,selectedDrink,installedDrinks) {
      $scope.selectedDrink = selectedDrink;
      $scope.installedDrinks = installedDrinks;
      
      //The user wants to make drink. Let's make sure they have the correct ingredients first
      $scope.ok = function() {
          var canMakeDrink = true;
          for(var i = 0; i < $scope.selectedDrink.ingredients.length; i++){
            var ingredientFound = false;
            for(var j = 0; j < $scope.installedDrinks.length; j++){
                if($scope.selectedDrink.ingredients[i].type == $scope.installedDrinks[j].type){
                  ingredientFound = true;
                  break;
                }
            }
            if(!ingredientFound){
              canMakeDrink = false;
              break;
            }
          }

          if(canMakeDrink){
            console.log('all good, create this drink bitches!');
          }
          else{
            alert('You don\'t have the right ingredients dumbass.');
          }

          $modalInstance.close($scope.selectedDrink);
      };
  
      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };
    }

    $scope.recipes = [];
    $http.get('/api/recipes')
      .success(function(data) {
        for(var i = 0; i < data.length; i++){
          $scope.recipes.push(data[i]);
        }
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });

    $scope.selectedDrink = $scope.recipes[0];
  }
]);

angular.module('mean').filter('searchFor',function() {
  return function(arr,searchString) {
    if(!searchString) return arr;

    var result = [];
    searchString = searchString.toLowerCase();
    angular.forEach(arr,function(item) {
      if(item.name.toLowerCase().indexOf(searchString) !== -1) {
        result.push(item);
      }
    });
    return result;
  }
});
