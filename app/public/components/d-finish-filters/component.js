define(["app"], function(Directives) {
  Directives.directive("onFinishRenderFilters", ['$timeout', function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        if (scope.$last === true) {
          $timeout(function() {
            scope.$emit('ngRepeatFinished');
          });
        }
      }
    }
  }])
});
