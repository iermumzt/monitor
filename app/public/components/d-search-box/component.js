define(["app"], function(Directives){
  Directives.directive("searchBox", function(){
    return {
      template: [
        "<div class = 'search-box' >",
          '<div class="ier-wrapper">',
            '<div ng-transclude>',
            '</div>',
            '<div class="ier-input-wrapper">',
              '<input type="text" class="ier-input" ng-keydown = "onInput($event)" placeholder="{{placeholder}}" ng-model = "v"></input>',
              '<a class="clear ng-hide" ng-click="clearInput()" ng-show = "v.length > 0"><i class = "pic-del"></i></a>',
              '<span class = "ier-submit" ng-click = "onSubmit(v)" ><i class = "pic-search"></i>{{label}}</span>',
            '</div>',
          '</div>',
        "</div>"
      ].join(""),
      replace: true,
      transclude: true,
      scope: {
        v: "@value",
        onSubmit: "=",
        placeholder: "@",
        label: "@"
      },
      link: function($scope){
        $scope.clearInput = function(){
          $scope.v = "";
        };

        $scope.onInput = function($event){
          $scope.v = $scope.v.trim();
          if($event.keyCode === 13){
            $scope.onSubmit($scope.v);
          }
        };
      }
    };
  });
});