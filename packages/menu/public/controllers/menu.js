'use strict';

angular.module('mean').controller('MenuController', ['$scope', '$modal','$http','Global',
  function($scope, $modal, $http, Global, Menu) {
    $scope.global = Global;
    $scope.menu = {name:'menu'};
    $scope.items = ['item1','item2','item3'];

    $scope.confirm = function(selectedDrink) {
      $scope.selectedDrink = selectedDrink;
      var modalInstance = $modal.open({
        templateUrl: 'confirm.html',
        controller: confirmControl,
        resolve: {
          selectedDrink: function() {
            return $scope.selectedDrink;
          }
        }
      });

      modalInstance.result.then(function (selectedDrink) {
        angular.forEach(selectedDrink.recipe, function(ingredient,key) {
          $http({method: 'UNLOCK', url: '/solenoid/' +
            ingredient.solenoid + '/' + ingredient.ounces});
        });
      });
    };

    var confirmControl = function($scope, $modalInstance,selectedDrink) {
      $scope.selectedDrink = selectedDrink;

      $scope.ok = function() {
        $modalInstance.close($scope.selectedDrink);
      };
  
      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };
    }

    $scope.drinks = [
      {
        name: 'White Russian',
        ingredients: 'Cream, Vodka, Kahlua',
        recipe: [{
          solenoid: 0,
          ounces: 1
        }, {
          solenoid: 1,
          ounces: 2
        }]
      },{
        name: 'Black Russian',
        ingredients: 'Vodka, Kahlua'
      },{
        name: 'Whiskey',
        ingredients: 'Whiskey'
      },{
        name: 'AMF',
        ingredients: 'a bunch of shit'
      }, {
        name: 'Rum & Coke',
        ingredients: 'What do you fucking think?'
      }, {
        name: 'Old Fashioned',
        ingredients: 'not sure actually'
      }, {
        name: 'Wine',
        ingredients: 'wine'
      }, {
        name: 'Screwdriver',
        ingredients: 'vodka. oj.'
      }
    ];

    $scope.selectedDrink = $scope.drinks[0];
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
