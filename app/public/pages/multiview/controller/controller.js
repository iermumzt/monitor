define(["app", "oauth", "s_layoutmanager", "s_profile", "d_modal", "d_camera_tree_list", "d_camera_multiview","d_camera_summary_list"], function(Controllers, OAuth, LayoutManager) {
  Controllers.controller("MultiViewController", ["$scope", "$element", "ProfileService", '$timeout',
    function($scope, $element, ProfileService, $timeout) {
      var user = OAuth.getUser();
      var c_max_index = 0;
      $scope.isIpad = IX.browser.versions.mobile;
      if ($scope.isIpad) $("body").addClass("ipad");
      var bindData = function() {
        var isExist = false;
        ProfileService.getProfileMulti().then(function(_data) {
          // c_max_index = Number(_data.list[_data.list.length - 1].mid);

          $scope.multiList = _data.list;
          if (!_data.effMulti) {
            AppLog.error("用户未设置过多画面,请先设置");
            $scope.isInit = false;
            $scope.multiType = _data.list[0];
            $scope.setMulti = true;
            $timeout(function() {
              $scope.resize();
            }, 0, false);
            return;
          }
          if (_data.effMulti.lid < 6) {
            $scope.smultiType = _data.effMulti;
          } else {
            $scope.smultiType = "";
          }
          console.log($scope.smultiType);
          console.log(_data.effMulti);
          $scope.multiType = _data.effMulti;
          $scope.currentMultiType = _data.effMulti;
          // $scope.currentLayout =  _data.effMulti;
          // $scope.multiType = (_data.c_mid.indexOf("s") === 0) ? multi.mid : multi;
          // $scope.currentMultiType = (_data.c_mid.indexOf("s") === 0) ? multi.mid : multi;
          $scope.multiCids = _data.effMulti.cid || [];
          $scope.rows = _data.effMulti.rows;
          $scope.cols = _data.effMulti.cols;
          if (_data.effMulti.cycle && Number(_data.effMulti.cycle) !== 0) {
            $scope.checked = true;
            $scope.wheelTime = _data.effMulti.cycle;
            _.each($scope.times, function(_time) {
              if (Number($scope.wheelTime) === _time.desc) {
                $scope.currentTime = _time;
              }
            })
          }
          if ($scope.multiCids) $scope.camerasList = $scope.getCamerasByCids($scope.multiCids);
          // isExist = true;
          // break;
          // for (var i = $scope.multiList.length - 1; i >= 0; i--) {
          //   var multi = $scope.multiList[i];
          //   // _.each($scope.multiList, function(multi) {
          //   if (multi.mid === _data.c_mid) {
          //   }
          // };

          // $scope.onChangeLayout(true);
        })
      };

      $scope.$watch("videosList", function(_v, _ov) {
        if (_v !== _ov && _v !== "") {
          bindData();
        }
      });
      var dist;
      var bindEvent = function() {
        // $scope.editTypeClick = function() {
        //   $scope.editType = true;
        //   $scope.setdrag = true;
        //   $scope.setMulti = false;
        // }
        $scope.cancelMobileFull = function(){
          if (IX.browser.versions.mobile) {
            // $('.mutiConfig').addClass("ff");
            $scope.mobileFull = false;
            $timeout(function() {
              $scope.onChangeLayout(true, true);
            }, 0, true);
            
            return;
          }
        }
        $scope.fullscreen = function() {
          if (IX.browser.versions.mobile) {
            // $('.mutiConfig').addClass("ff");
            $scope.mobileFull = true;
            $timeout(function() {
              $scope.onChangeLayout(true, true);
            }, 0, true);
            
            return;
          }
          $scope.isFullscreen = true;
          $scope.cancelFulling = true;
          var $container = $element.find('.cameraList');
          var is_support_fullscreen = document.webkitCancelFullScreen || document.mozCancelFullScreen || document.msExitFullscreen;
          if (is_support_fullscreen) {
            $container.css({
              width: window.screen.width,
              height: window.screen.height
            });
          } else {
            $container.css({
              width: document.documentElement.clientWidth,
              height: document.documentElement.clientHeight
            });
          }
          if ($container[0].webkitRequestFullScreen) {
            $container[0].webkitRequestFullScreen();
          } else if ($container[0].mozRequestFullScreen) {
            $container[0].mozRequestFullScreen();
          } else if ($container[0].msRequestFullscreen) {
            $container[0].msRequestFullscreen();
          }
          // $scope.onChangeLayout(true,true);
        };
        document.onwebkitfullscreenchange = document.onmozfullscreenchange = document.onmsfullscreenchange = function() {
          if (!document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
            cancelfullscreen(1);
          }
        };
        var cancelfullscreen = function(is_browser_trigger) {
          $scope.isFullscreen = false;
          $scope.cancelFulling = false;
          $scope.$apply();
          var $container = $element.find('.cameraList');
          // var is_support_fullscreen = document.webkitCancelFullScreen || document.mozCancelFullScreen || document.msExitFullscreen;
          $container.css({
            width: "100%",
            height: "100%"
          });
          // if (is_browser_trigger) return;
          if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
          $scope.onChangeLayout(true, true);
        };
        $scope.multiFilter = function(_multi) {
          return _multi.mid.indexOf("c") >= 0;
        }
        $scope.onSelectCategorys = function(_cids, _cameras) {}
        $scope.toggleEnableConfig = function() {
          _.each($scope.currentPlayingVideos, function(_vm) {
            _vm.destroy();
          });
          $element.find('.camera-multiview').empty();
          $scope.setMulti = true;
          //$scope.setdrag = false;
          //console.log($element.find('div.right-wrap div.multi div.top-menus ul.pull-right li.edit'));
          $timeout(function() {
            resize();
            $scope.resize();
          }, 0, true);
        };
        $scope.wheeled = function() {
          $scope.checked = !$scope.checked;
          if ($scope.checked) {
            $scope.wheelTime = $scope.currentTime.desc;
          } else {
            $scope.wheelTime = "";
          }
        };
        $scope.setWheelTime = function(_time) {
          $scope.currentTime = _time;
          if ($scope.checked) {
            $scope.wheelTime = $scope.currentTime.desc;
          } else {
            $scope.wheelTime = "";
          }
        }
        $scope.cancelEdit = function() {
          if (!$scope.currentMultiType) {
            AppLog.error("用户未设置过多画面,请先设置");
            return;
          }
          $scope.setMulti = false;
          // $element.find('.camera-multiview').empty();
          $scope.a = !$scope.a;
          // $scope.isInit = false;
          if ($scope.multiType.lid !== $scope.currentMultiType.lid) {
            $scope.multiType = $scope.currentMultiType;
            $scope.multiCids = $scope.multiType.cid || [];
          }
          // else {
          if ($scope.multiType.cycle) {
            $scope.checked = true;
            $scope.wheelTime = $scope.multiType.cycle;
          }
          $scope.cancelSelectCategorys($scope.multiCids);
          $timeout(function() {
            resize();
            $scope.onChangeLayout(true, true);
          }, 0, true);
          // }
        }
        $scope.saveEdit = function() {
          // var customTb = {
          //   'rows': $scope.rows,
          //   'cols': $scope.cols,
          //   'coords': []
          // };

          // var tds = $element.find("td[p]");

          if (!$scope.multiCids.length) {
            AppLog.error("请选择摄像机列表！", 1);
            return;
          }
          var playingCameras = $scope.getCamerasByCids($scope.multiCids);
          var tdNum = $element.find("td").length;
          if (playingCameras.length <= tdNum && $scope.checked) {
            AppLog.error("分类摄像机数量不支持轮播操作", 1);
            // return;
          }
          var data_type = "";
          if ($scope.multiCids.length > 1 && _.contains($scope.multiCids, "none")) {
            data_type = "category_and_none";
          } else if ($scope.multiCids.length === 1 && _.contains($scope.multiCids, "none")) {
            data_type = "none";
          } else if ($scope.multiCids.length === 1 && _.contains($scope.multiCids, "all")) {
            data_type = "all";
          } else if ($scope.multiCids.length > 0 && !_.contains($scope.multiCids, "all") && !_.contains($scope.multiCids, "none")) {
            data_type = "category";
          }
          $scope.multiCids = _.without($scope.multiCids, "none", "all");

          //用户自定义画面获取屏幕坐标
          // _.each(tds, function(td, $index) {
          //   var p = $(td).attr("p").split(",");
          //   var tmp = {
          //     'coord': [],
          //     'rowspan': -1,
          //     'colspan': -1
          //   };
          //   tmp.coord[0] = p[0];
          //   tmp.coord[1] = p[1];
          //   tmp.rowspan = p[2];
          //   tmp.colspan = p[3];
          //   customTb.coords[$index] = tmp;
          // });
          // $scope.toggleEnableConfig();
          // $scope.isInit = true;
          $scope.setMulti = false;
          $scope.currentMultiType = $scope.multiType;
          if ($scope.checked) {
            $scope.wheelTime = $scope.currentTime.desc;
          } else {
            $scope.wheelTime = "";
          }
          var params = {
            // 'rows': $scope.multiType.rows,
            // "cols": $scope.multiType.cols,
            // "coords": JSON.stringify($scope.multiType.coords),
            "lid": $scope.multiType.lid,
            "cid": $scope.multiCids.toString(),
            "cycle": $scope.checked ? $scope.wheelTime : "",
            "data_type": data_type
          }
          ProfileService.saveProfileMultiPlayInfo(params).then(function(_data) {
            if (_data.error_code) {
              AppLog.info("多画面设置失败", 1);
              return;
            }
            AppLog.info("多画面设置成功", 1);
            // $scope.camerasList = $scope.getCamerasByCids($scope.multiCids);
            $scope.isInit = true;
            $scope.categorysBindData();
            $scope.cancelSelectCategorys();
            resize();
            $element.find('.camera-multiview').empty();
          });
          // console.info('摄像机列表', customTb.toString());
          // $timeout(function() {

          // }, 0, false);
          // console.info('摄像机列表', $scope.camerasList);
          // console.info('currentType', $scope.multiType);
          // console.info('ids', $scope.multiCids.toString());
        }

        $scope.hideBaseInfo = function() {
          var h = Number($element.find(".base-info").css("height").replace('px', ''));
          if (!h || h > 20) {
            $element.find(".base-info").animate({
              height: '20px'
            });
          } else {
            $element.find(".base-info").animate({
              height: '132px'
            });
          };
        }

        $scope.setLayout = function(_type) {
          if (_type.lid < 6) {
            $scope.smultiType = _type;
          } else {
            $scope.smultiType = "";
          }
          console.log($scope.smultiType);
          // if (typeof(_type) !== "object") {
          //   var _index = Number(_type.replace("s", ""));
          //   if (_index < 7) {
          //     $scope.currentLayout = $scope.standLayout[_index === 6 ? _index - 2 : _index - 1]["name"];
          //   }
          //   $scope.multiType = _type;
          // for (var i = 0; i < $scope.multiList.length; i++) {
          //   var ci = $scope.multiList[i];
          //   if (ci.lid === _type.lid) {
          //     $scope.multiCids = ci.cid;
          //     $scope.rows = ci.rows;
          //     $scope.cols = ci.cols;
          //     if (ci.cycle) {
          //       $scope.checked = true;
          //       $scope.wheelTime = ci.time;
          //       _.each($scope.times, function(_time) {
          //         if (ci.time === _time.desc) {
          //           $scope.currentTime = _time;
          //         }
          //       })
          //     } else {
          //       $scope.checked = false;
          //       $scope.wheelTime = "";
          //     }

          //     break;
          //   }
          // };
          // } else {
          // if($scope.multiType === _type) return;
          // $scope.currentLayout = _type
          $scope.multiType = _type;
          // $scope.currentMultiType = _type;
          $scope.multiCids = $scope.multiType.cid || [];
          if (_type.cycle && Number(_type.cycle) !== 0) {
            $scope.checked = true;
            $scope.wheelTime = _type.cycle;
            _.each($scope.times, function(_time) {
              if (Number(_type.cycle) === _time.desc) {
                $scope.currentTime = _time;
              }
            })
          } else {
            $scope.checked = false;
            $scope.wheelTime = "";
            $scope.currentTime = $scope.times[1];
          }
          // }
        }
      };

      $(window).resize(function() {
        resize();
      });

      var resize = function() {
        var h = $scope.setMulti ? $element.find(".screenShow>.f").outerHeight(true) : 0;
        // var drh = $scope.setdrag ? $element.find(".screenShow>.drags").outerHeight(true)+20 : 0;
        if (!$scope.isFullscreen) {
          $element.height($("body").height() - $("body>nav").height());
          $element.find(".mutiConfig").height($element.height() - $element.find(".top-menus").height());
          $element.find(".cameraList").height($element.find(".screenShow").height() - h);
        }
      };

      var init = function() {
        $scope.downNum = 0;
        $scope.upNum = 0;
        $scope.wheelTime = "";
        $scope.editType = false;
        $scope.standLayout = [{
            "lid": "s1",
            "name": "单画面"
          }, {
            "lid": "s2",
            "name": "4画面"
          }, {
            "lid": "s3",
            "name": "9画面"
          }, {
            "lid": "s4",
            "name": "16画面"
          },
          {
            "lid": "s6",
            "name": "36画面"
          }
        ];
        // $scope.currentLayout = $scope.standLayout[0].name;
        $scope.smultiType = "";
        $scope.times = [{
          "tid": "1",
          "desc": 20
        }, {
          "tid": "2",
          "desc": 30
        }, {
          "tid": "3",
          "desc": 40
        }, {
          "tid": "4",
          "desc": 50
        }, {
          "tid": "5",
          "desc": 60
        }];

        if (user) {
          $scope.user = user;
        } else {
          OAuth.init();
          return;
        }
        $scope.currentTime = $scope.times[1];
        $scope.editType = true;
        $scope.setMulti = false;
        $scope.isInit = true;
        resize();
        bindEvent();
      };

      init();

      


    }
  ]);
});