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

    $scope.suggestions = [];
    for(var key in $scope.drinkMap){
      $scope.suggestions.push(key);
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
    $scope.focusIndex = -1;

    $scope.addIngredient = function (index,ingredients) {
      if (ingredients.length == index+1)
        ingredients.push({"name":''});
      if (ingredients[index].name == '') {
        $scope.focusIndex=index;
        ingredients.splice(index,1);
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

angular.module('mean').directive('focusIndex',function($timeout,$rootScope) {
  return {
    restrict: 'A',
    scope: {
      indx: "=focusIndex",
      changed: "=focusIndexChange"
    },
    link: function($scope,$element,attrs) {
      $scope.$watch("changed", function(curVal,prevVal) {
        if (curVal < prevVal)
          if ($scope.$parent.$index == $scope.indx)
            $element[0].focus();
      });
    }
  }
});
/*
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
*/
