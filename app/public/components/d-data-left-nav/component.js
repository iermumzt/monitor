define(["app"], function(Directives){
  Directives.directive("statisticsLeftNav",function(){
    return {
      template: CURRENT_PROJECT_DIRECTIVES["d-data-left-nav"],
      replace: true,
      transclude: false,
      scope: {
        currentMenu: "="
      },
      link: function($scope) {
        var bindDataEvent = function() {
          $scope.changeActive = function() {
            if ($scope.activeId) {
              $scope.activeId = false;
            } else {
              $scope.activeId = true;
            }
          };
        };
        var init = function() {
          $scope.activeId = true;
          bindDataEvent();
        }
        
        init();
      }
    };
  });
});