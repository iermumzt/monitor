define(["app", "fi_htmlnum", "d_camera_summary"], function(Directives) {
  Directives.directive("cameraSummaryList", [function() {
    return {
      template: CURRENT_PROJECT_DIRECTIVES["d-camera-summary-list"],
      restrict: "A",
      replace: false,
      transclude: false,
       scope: {
          videoList: "=",
          lyList: "=deList",
          onSelected: "=onSelected",
          checkSelected: "=checkSelected",
          isMyCameras: "=isMyCameras",
          getDelRecordIds: "=getDelRecordIds",
          getSelectedIds: "=getSelectedIds",
          getCheckId: "=getCheckId",
          getCurrId: "=getCurrId",
          hideMask: "=hideMask",
          showCks: "=showCks",
          hiddenFourItem: "="
        },
      link: function($scope){
        $scope.currentSelectedIndex = null;
        $scope.onSelectedItem = function(_item, $index, e){
          if(!$scope.onSelected) return;
          if($index === $scope.currentSelectedIndex){
            $scope.currentSelectedIndex = null;
          }else{
            $scope.currentSelectedIndex = $index;
          }
          $scope.onSelected(_item, $index, e);
        };
        if(!$scope.checkSelected && $scope.checkSelected !== undefined){
          $scope.checkSelected = function(_item, $index){
            return $index === $scope.currentSelectedIndex;
          };
        }


      }
    };
  }]);
});