define(["app", "d_video_thumbnail"], function(Directives) {
  Directives.directive("videoSummary",
    function() {
      return {
        template: CURRENT_PROJECT_DIRECTIVES["d-video-summary"],
        restrict: 'AE',
        transclude: true,
        replace: true,
        scope: {
          item: "="
        },
        link: function($scope){
          if($scope.item.shareid)
            $scope.item.playUrl = "/video/" + $scope.item.shareid + "/" + $scope.item.uk;
          else
            $scope.item.playUrl = "/video/" + $scope.item.deviceid;
          $scope.item.hasHistory = $scope.item.share > 2;
        }
      };
    }
  );
});