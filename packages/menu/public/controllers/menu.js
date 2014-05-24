'use strict';

angular.module('mean').controller('MenuController', ['$scope', '$modal','$http','Global',
  function($scope, $modal, $http, Global, Menu) {
    $scope.global = Global;
    $scope.menu = {name:'menu'};

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

      modalInstance.result.then(function (input) {
        $scope.drinkIngredients = [];

        for(var i = 0; i < selectedDrink.ingredients.length; i++){
            for(var j = 0; j < $scope.installedDrinks.length; j++){
                if(selectedDrink.ingredients[i].name == $scope.installedDrinks[j].name){
                  $scope.drinkIngredients.push({drink:$scope.installedDrinks[j], oz:selectedDrink.ingredients[i].oz});
                }
            }
        }

        var routes = []
        //TODO: Solenoid might be incorrect
        angular.forEach($scope.drinkIngredients, function(ingredient,key) {
          var urlBase = ingredient.drink.refrigerated ? '/cold/' : '/warm/';
          routes.push(urlBase + ingredient.drink.solenoid + '/' + ingredient.oz);
        });
        $http.post('/queue/',{
          "human": {
            "name": input.name,
            "cell": input.cell
          },
          "cocktail": {
            "name": selectedDrink.name,
            "routes": routes
          }
        })
        .success(function(data) {
          angular.forEach($scope.drinkIngredients,function(ingredient,key) {
            var pctEmpty = 100 * ingredient.oz/ingredient.drink.oz;
            var newEmpty = pctEmpty + ingredient.drink.emptiness;
            if (newEmpty > 100)
              newEmpty = 100;
            for (var i = 0; i < $scope.installedDrinks.length; i++) {
              if ($scope.installedDrinks[i].solenoid == ingredient.drink.solenoid) {
                $scope.installedDrinks[i].emptiness = newEmpty;
                break;
              }
            }
            $http.put('/api/installedDrinks/' + ingredient.drink.solenoid, {
              emptiness: newEmpty
            })
            .success(function(data) {
              //console.log(data);
            })
            .error(function(data) {
              console.log(data); 
            });
          });
        })
        .error(function(data) {

        });
    });
  };
    var confirmControl = function($scope, $modalInstance,selectedDrink,installedDrinks) {
      $scope.selectedDrink = selectedDrink;
      $scope.installedDrinks = installedDrinks;
      $scope.lowIngredients = [];
      $scope.input = {};

      for(var i = 0; i < selectedDrink.ingredients.length; i++){
          var recipeDrink = selectedDrink.ingredients[i];
          for(var j = 0; j < $scope.installedDrinks.length; j++){
              var installedDrink = installedDrinks[j];
              var installedOzRemaining = installedDrink.oz * (100 - installedDrink.emptiness);
              if(recipeDrink.name == installedDrink.name && installedOzRemaining < recipeDrink.oz){
                $scope.lowIngredients.push(installedDrink.name);
              }
          }
      }

      //The user wants to make drink.
      $scope.ok = function() {
          $modalInstance.close($scope.input);
      };
  
      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };
    };

    //Menu Filter
    $scope.recipes = [];
    $scope.installedDrinks = [];
    $http.get('/api/recipes')
      .success(function(recipes) {
        $http.get('/api/installedDrinks')
          .success(function(data) {
            for(var i = 0; i < data.length; i++){
              $scope.installedDrinks.push(data[i]);
            }
            for(var i = 0; i < recipes.length; i++){
              var recipeIsPossible = true;
              for(var k = 0; k < recipes[i].ingredients.length; k++){
                var ingredientFound = false;
                for(var j = 0; j < $scope.installedDrinks.length; j++){
                    if(recipes[i].ingredients[k].name == $scope.installedDrinks[j].name){
                      ingredientFound = true;
                    }
                }
                if(!ingredientFound){
                  recipeIsPossible = false;
                  break;
                }
              }

              if(recipeIsPossible){
                $scope.recipes.push(recipes[i]);  
              }
            }
          })
          .error(function(data) {
            console.log('Error: ' + data);
        });
        
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
