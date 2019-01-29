define(["app"], function(Directives) {
  Directives.directive("loading", [function() {
    return {
      template: CURRENT_PROJECT_DIRECTIVES["d-video-loading"],
      restrict: "A",
      replace: true,
      transclude: false,
      scope: {
        w: "@lw",
        h: "@lh",
        isLoading: "=isLoading"
      },
      link: function($scope) {
        $scope.ld = {
          "width": $scope.w,
          "height": $scope.h,
          "padding-left": "50%"
        };
      }
    };
  }]);
});
