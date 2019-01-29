define(["app"], function(Directives){
  Directives.directive("presetList", function(){
     return {
      //template: "<p>eqweqweqweqweqwe</p>",
      //templateUrl: ZBase.getCdnUrl("/directives/videos?"+CURRENT_PROJECT_TIMESTAMP),
      template: CURRENT_PROJECT_DIRECTIVES["d-preset-list"],
      restrict: "A",
      replace: true,
      transclude: false,
      scope: {
        items: "=presetList",
        detailType: "=",
        delPresetsStatus: "=delPresetsStatus",
        moveByPreset: "=moveByPreset",
        cancelEditPreset: "=cancelEditPreset",
        submitEditPreset: "=submitEditPreset",
        delPreset: "=delPreset",
        editPreset: "=editPreset",
        editPresetStatus: "=editPresetStatus",
        hideExtend: "@hideExtend",
        hideMask: "=hideMask",
        cThumbnail: '=cThumbnail',
        isLoadding: "=",
        currentIndex: '=',
        presetLoading: '=',
        picLoading: '='
      },
      link: function($scope) { //$elem
        $scope.issLoading = true;
        $scope.cancelEditPresetFn = function() {
          $scope.editPresetId = "";
          $scope.textValue = "";
          $scope.cThumbnail = "ttt";

          $scope.cancelEditPreset();
        };
        $scope.submitEditPresetFn = function() {
          $scope.issLoading = false;
          $scope.submitEditPreset($scope.editPresetId, $scope.textValue);
          setTimeout(function() {
            $scope.textValue = "";
            $scope.cThumbnail = "ttt";
            $scope.editPresetId = "";
          },2000);
        };
        $scope.clearTextValue = function() {
          $scope.textValue = "";
        };
        $scope.getTextValue = function(_v) {
          $scope.textValue = _v;
        };
        $scope.editPresetFn = function(_item) {
          if(_item){
            $scope.textValue = _item.title;
            // $scope.cThumbnail = _item.thumbnail;
            $scope.editPresetId = _item.preset;
          }
          $scope.editPreset(_item);
        };
        $scope.delPresetFn = function(_item) {
          $scope.delPreset(_item.preset);
        };
        $scope.moveByPresetFn = function(_item, _index) {
          $scope.moveByPreset(_item.preset, _index);
        };
        // $scope.$watch('editPresetStatus', function(oldVal,newVal) {
        //   if(!newVal && oldVal !== newVal) {
        //     editPresetId = "";
        //     $scope.textValue = "";
        //     $scope.cThumbnail = "ttt";
        //   }
        // });
      }
    };
  });
});