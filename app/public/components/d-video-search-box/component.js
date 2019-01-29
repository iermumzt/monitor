define(["app", "d_search_box"], function(Directives){
  Directives.directive("videoSearchBox", function(){
    return {
      template: CURRENT_PROJECT_DIRECTIVES["d-video-search-box"],
      replace: false,
      transclude: false,
      scope: {
        value: "@",
        url: "@"
      },
      link: function($scope){
        $scope.onSubmit = function(v){
          document.location.href = "/search?kws=" + window.escape(v.trim()) + ($scope.url ? $scope.url : "");
        };
      }
    };
  });
});