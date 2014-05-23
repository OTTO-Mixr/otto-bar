'use strict';

angular.module('mean').controller('RecipesController', ['$scope', '$modal','$http','Global',
  function($scope, $modal, $http, Global, Menu) {
    $scope.global = Global;
    $scope.menu = {name:'menu'};

    $scope.units=["oz","dash","ml"];

    $scope.convertToOz = function(amt,units) {
      switch(units) {
        case 'ml':
          return amt * 0.033814;
        case 'oz':
          return amt;
        case 'dash':
          return amt * (1/32);
      }
    }



    $scope.suggestions = [];

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

    $scope.ingredients=[{"name":'',"units":"oz"}];
    $scope.focusIndex = -1;

    $scope.addIngredient = function (index,ingredients) {
      if (ingredients.length == index+1)
        ingredients.push({"name":'',"units":"oz"});
      if (ingredients[index].name == '') {
        $scope.focusIndex=index;
        ingredients.splice(index,1);
      }
    }

    $scope.addIt = function() {
      $scope.add.$setPristine(true);
      $scope.ingredients.splice($scope.ingredients.length-1,1);
      $scope.ingredients.forEach(function(ingredient) {
        ingredient.oz = $scope.convertToOz(ingredient.amount,ingredient.units);
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
      recipe.ingredients.forEach(function(ingredient) {
        ingredient.oz = $scope.convertToOz(ingredient.amount,ingredient.units);
      });
      $http.put('/api/recipes/'+recipe._id, {
        name: recipe.name,
        description: recipe.description,
        ingredients: recipe.ingredients
      })
      .success(function(data) {
        $scope.recipes = data;
      })
      .error(function(data) {

      });
  }

    $scope.deleteIt = function(recipe) {
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

angular.module('mean').directive('unique',function() {
  return {
    require: 'ngModel',
    scope: {
      elementArr: "=unique"
    },
    link: function(scope,elem,attrs,ctrl) {
      elem.on('blur', function(evt) {
        scope.$apply(function() {
          var valid = true;
          for (var i = 0; i < scope.elementArr.length; i++) {
            //make sure that they're not at the same index
            //otherwise name will never be valid when editing
            if (scope.$parent.$index == i)
              continue;
            if (scope.elementArr[i].name.toLowerCase() == elem.val().toLowerCase()) {
              valid = false;
              break;
            }
          }
          ctrl.$setValidity('unique',valid);
        });
      });
    }
  }
});

angular.module('mean').directive('focusIndex',function() {
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
