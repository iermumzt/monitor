define(["app"], function(Directives) { 
  Directives.directive("cameraIdentification", ["ProfileService", "$timeout",
    function(ProfileService, $timeout) {
      return {
        template: CURRENT_PROJECT_DIRECTIVES["d-camera-identification"],
        restrict: "A",
        replace: true,
        transclude: false,
        scope: {
          getData:"=?",
          results:"=",
          noai:"=",
          emp:"=",
          eyes:"=",
          ulHeight:"=",
          showModalDetail: "=",
          detailData: "="
        },
        link: function($scope, $elem) {
          var contrast = [];
          var vb;

          var resizeDiff = function () {
            vb = $scope.ulHeight - $elem.find('div.nav').height()-20;
            $elem.find('ul.diffList').height(vb);
          };
          var bindData = function () {
            // $scope.down = function () {
            //   $scope.results = true;
            //   $scope.emp = false;
            //   $scope.eyes = false;
            // }
            $scope.openup = function () {
              $scope.results = false;
              $scope.eyes = true;
              if ($scope.getData.length == 0) {
                $scope.emp = true;
              } else {
                $scope.emp = false;
              }
            }
          }
          // var progressList= function () {
          //   var $pro = $elem.find('ul.diffList li div.swin-wrap div.chartpie div.progress');
          //   $pro.each(function (index, el) {
          //     //console.log($pro.find(".right" + index));
          //     $scope.percent = parseInt(($scope.contrast[index].score) / 100);
          //     var num = $scope.percent * 3.6;
          //     //console.log(num);
          //     if (num <= 180) {
          //       $pro.find(".right" + index).css("background", "#515756");
          //       $pro.find(".right" + index).css('transform', "rotate(" + num + "deg)");
          //       $pro.find(".right" + index).css('-moz-transform', "rotate(" + num + "deg)");
          //       $pro.find(".right" + index).css('-ms-transform', "rotate(" + num + "deg)");
          //       $pro.find(".right" + index).css('-o-transform', "rotate(" + num + "deg)");
          //       $pro.find(".right" + index).css('-webkit-transform', "rotate(" + num + "deg)");
          //     } else {
          //       $pro.find(".right" + index).css("background", "-webkit-linear-gradient(#26f0cc, #2bb2e8)");
          //       $pro.find(".right" + index).css("background", "-o-linear-gradient(#26f0cc, #2bb2e8)");
          //       $pro.find(".right" + index).css("background", "-moz-linear-gradient(#26f0cc, #2bb2e8)");
          //       $pro.find(".right" + index).css("background", "linear-gradient(#26f0cc, #2bb2e8)");
          //       $pro.find(".right" + index).css('transform', "rotate(0deg)");
          //       $pro.find(".right" + index).css('-webkit-transform', "rotate(0deg)");
          //       $pro.find(".right" + index).css('-moz-transform', "rotate(0deg)");
          //       $pro.find(".right" + index).css('-ms-transform', "rotate(0deg)");
          //       $pro.find(".right" + index).css('-o-transform', "rotate(0deg)");
          //       $pro.find(".left" + index).css('transform', "rotate(" + (num + 180) + "deg)");
          //       $pro.find(".left" + index).css('-webkit-transform', "rotate(" + (num + 180) + "deg)");
          //       $pro.find(".left" + index).css('-moz-transform', "rotate(" + (num + 180) + "deg)");
          //       $pro.find(".left" + index).css('-ms-transform', "rotate(" + (num + 180) + "deg)");
          //       $pro.find(".left" + index).css('-o-transform', "rotate(" + (num + 180) + "deg)");
          //     };
          //   });
          // };
          var bindPrecent = function() {
            var $progress = $elem.find('ul.diffList li div.swin-wrap div.chartpie div.progress2');
            $progress.each(function (index, el) {
              $scope.percent = parseInt(($scope.contrast[index].score) / 10000*195);
              $progress.find('div.circle'+index+' span.bar').css('width',$scope.percent+'px');
            });
          };
          $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
            bindPrecent();
          });
          $scope.showModal = function(_user) {
            $scope.showModalDetail = true;
            $scope.detailData = _user;
          };
          var init = function () {
            $scope.results = false;
            $scope.emp = true;
            $scope.percent = 0;
            resizeDiff();
            bindData();
          };
          $scope.$watch("results", function () {
            if (!$scope.results) {
              $scope.contrast = $scope.getData;
              //console.log(11);
            }
          }, true);
          $scope.$watch("noai", function (_v, _ov) {
            if (_v !== _ov) {
              $scope.noai = _v;
            }
          }, true);
          $scope.$watch("eyes", function (_v, _ov) {
            if (_v !== _ov) {
              $scope.eyes = _v;
            };
          }, true);
          $scope.$watch("emp", function (_v, _ov) {
            if (_v !== _ov) {
              $scope.emp = _v;
            }
          }, true);
          $scope.$watch("ulHeight", function (_v, _ov) {
            if (_v !== _ov) {
              resizeDiff();
            }
          }, true);
          $scope.$watch("getData", function (_v, _ov) {
            if (_v !== _ov) {
              //console.log($scope.getData);
              if ($scope.getData.length > 0) {
                $scope.contrast = $scope.getData;
                $scope.emp = false;
                $timeout(function () {
                  bindPrecent();
                }, 0, true);
              } else{
                if ($scope.results) {
                  $scope.emp = false;
                }else{
                  $scope.emp = true;
                }
              }
            }else{
              //console.log("我在呢");
            }
          }, true);
          init();
        }
      };
    }
  ]);
});