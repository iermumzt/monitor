define(["app", "oauth",  "s_layoutmanager", "fi_htmlnum", "d_camera_summary_list", "s_profile", "d_video_list_loading"], function(Directives, OAuth) {
  Directives.directive("cameraList", ["ProfileService", "LayoutManager",
    function(ProfileService, LayoutManager) {
      return {
        template: "<div camera-summary-list video-list = 'videoList' hidden-four-item ='hiddenFourItem'></div>",
        restrict: "A",
        replace: false,
        transclude: false,
        link: function($scope) {
          var user = OAuth.getUser();
          $scope.pageSize = $scope.pageSize || 4;
          $scope.bindMyDevData = function(_pagination) {
            var width = $(window).width();
            if(width < 1000){
              $scope.hideAll = true;
              $scope.mLoading = true;
            }else{
              $scope.isLoading = true;              
            }
  	        params = {
              count: $scope.pageSize,
              list_type: "page",
              page: _pagination || 1 
            };
            if(!_pagination) _pagination = 1;
            if (LayoutManager.widthType === 100) $scope.hiddenFourItem = true;
            ProfileService.getMyCameras(params).then(function(_data) {
              currentItems = _data.list;
              if( width < 1000){ //IX.browser.versions.mobile &&
                $scope.hideAll = true;  //移动端不显示全部
                if(_pagination === 1 || !_pagination){
                  $scope.videoList = _data.list;
                }else{
                  $scope.videoList = $scope.videoList.concat(currentItems);
                }
                $scope.isLoading = false;
                $scope.mLoading = false;
              }else{
                $scope.videoList = _data.list;
                $scope.isLoading = false;
                if (LayoutManager.widthType === 100) { 
                  if ($scope.videoCount <= 3) $scope.hideAll = true; 
                } else if ($scope.videoCount <= 4) {
                  $scope.hideAll = true;
                }
              }
            });
          };
          $scope.bindDevInfoSum = function() {
            ProfileService.getMyCamerasSum("", $scope.pageSize).then(function(_data) {
              if (_data.error_code) {
                _data = {
                  "devicenum": 0,
                  "grantnum": 0,
                  "subnum": 0,
                  "status": {
                    "online": 0,
                    "offline": 0
                  }
                };
              }
              $scope.$emit("videosCount", _data.devicenum, _data.status.online, _data.status.offline);
              $scope.$emit("videosgCount", _data.grantnum);
              $scope.videoCount = _data.devicenum + _data.grantnum;
            }).then(function() {
              $scope.bindMyDevData();
            });
          };

          var init = function() {
            $scope.isLoading = true;
            if (!user) {
              OAuth.init();
              return;
            }
            LayoutManager.on(function() {
              if ($scope.videoCount < 3) {
                $scope.hideAll = true;
                return;
              }
              if (LayoutManager.widthType === 100) {
                $scope.hiddenFourItem = true;
                if ($scope.videoCount <= 3) $scope.hideAll = true;
                else $scope.hideAll = false;
              } else {
                $scope.hiddenFourItem = false;
                if ($scope.videoCount <= 4) $scope.hideAll = true;
              }
            });

            $scope.bindDevInfoSum();
          };

          init();
        }
      };
    }
  ]);
});