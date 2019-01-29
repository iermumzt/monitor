define(["app", "d_search_box"], function(Directives){
  Directives.directive("helpSearchBox", function(){
    return {
      template: CURRENT_PROJECT_DIRECTIVES["d-help-search-box"],
      replace: false,
      transclude: false,
      scope: {
        value: "@"
      },
      link: function($scope){
        $scope.onSubmit = function(v){
          document.location.href = "/support/search?kws=" + v;
        };
      }
    };
  });
});