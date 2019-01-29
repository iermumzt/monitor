define(["app"], function(Directives) { 
  Directives.directive("cameraBident", ["ProfileService", "$timeout",
    function(ProfileService, $timeout) {
      return {
        template: CURRENT_PROJECT_DIRECTIVES["d-camera-bident"],
        restrict: "A",
        replace: true,
        transclude: false,
        scope: {
          captureList:"=",
          results:"=",
          eyes:"=",
          emp:"="
        },
        link: function($scope, $elem) {
          var bindData = function () {
            $scope.down = function () {
              $scope.results = true;
              $scope.eyes = false;
              $scope.emp = false;
            }
          }
          $scope.$watch("results", function () {
            if (!$scope.results) {
              $scope.allface = $scope.captureList;
              if ($scope.allface.length>0) {
                $scope.eyes = false;
              }else{
                $scope.eyes = true;
              }
            }
          }, true);
          $scope.$watch("emp", function (_v, _ov) {
            if (_v !== _ov) {
              $scope.emp = _v;
            }
          }, true);
          $scope.$watch("captureList", function (_v, _ov) {
            if (_v !== _ov) {
              //console.log($scope.captureList);
              if ($scope.captureList.length > 0) {
                $scope.allface = $scope.captureList;
                $scope.eyes = false;
             }else{
                $scope.eyes = true;
             }
            }
          }, true);
          var init = function () {
            $scope.eyes = true;
            bindData();
          }
          init();
        }
      };
    }
  ]);
});