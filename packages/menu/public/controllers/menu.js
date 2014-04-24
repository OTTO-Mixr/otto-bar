'use strict';

angular.module('mean').controller('MenuController', ['$scope', '$modal','Global',
  function($scope, $modal, Global, Menu) {
    $scope.global = Global;
    $scope.menu = {name:'menu'};

    $scope.confirm = function(selectedDrink) {
      $scope.selectedDrink = selectedDrink;
      var modalInstance = $modal.open({
        templateUrl: 'confirm.html',
        controller: confirmControl,
        resolve: {
          something: function() {
            return "yo";
          },
          selectedDrink: function() {
            console.log($scope.selectedDrink);
            return $scope.selectedDrink;
          }
        }
      });
    };

    var confirmControl = function($scope, $modalInstance) {
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
        ingredients: 'Cream, Vodka, Kahlua'
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
