define(["app", "d_video_thumbnail"], function(Directives) {
  Directives.directive("cameraSummary",
    function() {
      return {
        template: CURRENT_PROJECT_DIRECTIVES["d-camera-summary"],
        restrict: 'AE',
        transclude: true,
        replace: true,
        scope: {
          item: "=",
          lyList: "=deList",
          isMyCameras: "=isMyCameras",
          getDelRecordIds: "=getDelRecordIds",
          getSelectedIds: "=getSelectedIds",
          getCheckId: "=getCheckId",
          getCurrId: "=getCurrId",
          hideMask: "=hideMask",
          showCks: "=showCks"
        },
        link: function($scope){
          $scope.item.playUrl = "/video/" + $scope.item.deviceid;
          $scope.ckIschecked = function(_item) {
            if (_item.checkboxIsDisable) {
              return;
            }
            _item.checkboxIschecked = !_item.checkboxIschecked;
            $scope.getSelectedIds(_item);
          };
          $scope.caCkIschecked = function(_item) {
            _item.checkboxIschecked = !_item.checkboxIschecked;
            $scope.getSelectedIds(_item);
          };

          $scope.checkedi = function(_item) {
            if ($scope.getCurrId.did && _item.deviceid !== $scope.getCurrId.did) {
              $scope.getCurrId.did = false;
              $scope.curr = _item;
              $scope.getCheckId(_item, $scope.curr);
              return;
            } else if ($scope.getCurrId.did === _item.deviceid) {
              $scope.getCurrId.did = false;
              $scope.getCheckId(_item, $scope.curr);
              return;
            }
            if ($scope.curr === _item) {
              $scope.curr = false;
            } else {
              $scope.curr = _item;
            }
            $scope.getCheckId(_item, $scope.curr);
          };
        }
      };
    }
  );
});