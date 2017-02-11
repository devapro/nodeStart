angular.module('angularAdmin').controller('listLocation',function($scope, $http, $timeout){
    $scope.loading = false;
    $scope.search = "";
    $scope.cities = [];
});