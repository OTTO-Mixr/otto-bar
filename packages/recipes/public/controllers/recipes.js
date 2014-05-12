'use strict';

angular.module('mean').controller('RecipesController', ['$scope', '$modal','$http','Global',
  function($scope, $modal, $http, Global, Menu) {
    $scope.global = Global;
    $scope.menu = {name:'menu'};
// TODO get on this shit
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

    $scope.recipes = [];
    $http.get('/api/recipes')
      .success(function(data) {
        for(var i = 0; i < data.length; i++){
          $scope.recipes.push(data[i]);
        }
        console.log(data);
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });

    $scope.ingredients=[{"name":''}];

    $scope.addIngredient = function (index) {
      if ($scope.ingredients.length == index+1)
        $scope.ingredients.push({"name":''});
      if ($scope.ingredients[index].name == '') {
        $scope.ingredients.splice(index,1);
        //TODO focus
      }
    }

    $scope.addIt = function() {
      $scope.ingredients.forEach(function(ingredient) {
        ingredient.type = $scope.drinkMap[ingredient.name];
      });
      $http.post('/api/recipes',{
        name: $scope.name,
        description: $scope.description,
        ingredients: $scope.ingredients
      })
      .success(function(data) {
        $scope.recipes = data;
        $scope.ingredients=[{"name":''}];
        $scope.name = '';
        $scope.description = '';
      })
      .error(function(data) {

      });
  }

    $scope.editIt = function(recipe) {
      console.log(recipe);
      $http.put('/api/recipes/'+recipe._id, {
        name: recipe.name,
        description: recipe.description,
        ingredients: recipe.ingredients
      })
      .success(function(data) {
        console.log(data);
        $scope.recipes = data;
      })
      .error(function(data) {

      });
  }

    $scope.deleteIt = function(recipe) {
      console.log("trying to delete");
      $http.delete('/api/recipes/'+recipe._id)
      .success(function(data) {
        $scope.recipes = data;
      })
      .error(function(data) {
        console.log(data);
      });
    }
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
