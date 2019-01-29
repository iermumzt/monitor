define(["app"], function(controllers) {
  controllers.controller("SlidebarController", ["$scope", function($scope) {

    $scope.currentPathName = document.location.pathname;
    $scope.currentPath = document.location.pathname + document.location.hash;
  }]);
});
