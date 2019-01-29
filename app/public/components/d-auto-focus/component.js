define(["app"], function(Directives) {
  Directives.directive('autoFocus', ['$timeout', function($timeout) {
    return {
      restrict: 'A',
      link: function($scope, $element) {
        $timeout(function() {
          $element[0].focus();
          $element.triggerHandler("focus");
        },1000);
      }
    }
  }]);
});