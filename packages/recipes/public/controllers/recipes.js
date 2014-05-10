'use strict';

angular.module('mean').controller('RecipesController', ['$scope', '$modal','$http','Global',
  function($scope, $modal, $http, Global, Menu) {
    $scope.global = Global;
    $scope.menu = {name:'menu'};

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

    $scope.ingredients=[{"name":''}];

    $scope.addIngredient = function (index) {
      if ($scope.ingredients.length == index+1)
        $scope.ingredients.push({"name":''});
    }

    $scope.addIt = function() {
      $http.post('/api/recipes')
      .success(function(data) {

      })
      .error(function(data) {

      });
  }

    $scope.editIt = function() {
      $http.post('/api/recipes')
      .success(function(data) {

      })
      .error(function(data) {

      });
  }

    $scope.deleteIt = function() {
      $http.delete('/api/recipes')
      .success(function(data) {

      })
      .error(function(data) {

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
