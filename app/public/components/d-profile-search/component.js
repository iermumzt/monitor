define(["app",'d_auto_focus'], function(Directives) {
  Directives.directive("profileSearch", function() {
    return {
      template: CURRENT_PROJECT_DIRECTIVES["d-profile-search"],
      replace: true,
      transclude: true,
      scope: {
        videoList: "=",
        cancelSearch:"=",
        onInput: "=",
        kws:"="

        // isCurrentPage:"@",
        // isSearching: "=",
        // placeholder: "@",
        // isShare:"=",
        // kws:"="
      },
      link: function($scope) {
        console.log($scope.videoList);
        $scope.myFilter = function(item) {
          return $scope.kws ? item.description.indexOf($scope.kws) > -1 : true;
        };

        $scope.onInputFn = function(e){
          if(e.keyCode === 13){
            // if(!$scope.isCurrentPage) {
              $scope.focused = false;
              $('input').blur();
            // }
            $scope.onInput(e);
          }
        }
        $scope.getFocus = function() {
          $scope.focused = true; //!$scope.focused ;
        }
        $scope.LostFocus = function() {
          $scope.focused = false; 
          $("input").blur();
        }

        $scope.clearText = function() {
          $scope.kws = "";
          $("input").focus();
        }
      }
    };
  });
});