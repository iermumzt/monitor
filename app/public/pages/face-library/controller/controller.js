define(["app", "oauth",  "socketio", "s_profile", "ui_datetimepicker", "ui_datetimepicker_zhcn","d_modal", "ui_pagination", "d_video_loading", "d_pagination_list"], function(Controllers, OAuth,io) {
  Controllers.controller("FaceLibraryController", ["$scope", "$element", "ProfileService", "$timeout",
    function($scope, $element, ProfileService, $timeout) {
      var user = OAuth.getUser();
      var $container_top;

      var bindEvent = function() {
        var productTrigger;
        $scope.tabChange = function(nav) {
          $scope.tabNum = nav;
        };
        $(window).resize(function() {
          resize();
        });
        $scope.query = function() {
          if ($scope.startTime > $scope.endTime) {
            AppLog.error('开始时间不能大于结束时间，请重新选择！');
          } else {
            $scope.tabNum = 0;
            bindUserUnderData();
            bindUserNoData();
            bindUserClusData();
            bindUserMoreData();
          }
        };
        $scope.onPageChanged = function(_pageIndex) {
          $scope.currentPageIndex = _pageIndex;
          bindUserClusData();
        };
        $scope.onPageMoreChanged = function(_pageIndex) {
          $scope.currentMorePageIndex = _pageIndex;
          bindUserMoreData();
        };
        $element.find("div.reminder-num div.re-num").on('mouseover click', function() {
          if (productTrigger) {
            clearTimeout(productTrigger);
          }
          $element.find(".reminder-num .remind-grup").addClass("remind-grup-show-menu");
        });
        $element.find("div.reminder-num .remind-grup").mouseleave(function() {
          productTrigger = setTimeout(function() {
            $element.find(".reminder-num .remind-grup").removeClass("remind-grup-show-menu");
          }, 300);
        });
      };
      var bindUserUnderData = function() {
        ProfileService.getFaceLibrary({
          cluster: 0,
          list_type: 'all'
        }).then(function (data) {
          if (data.error_code) {
            data = {
              list: []
            }
          } else {
            $scope.user_under_clus = data.list;
          }
        })
      };
      // var bindAiDevice = function() {
      //   ProfileService.getAiDevices({
      //   }).then(function(_data){
      //     if (_data.error_code) {
      //       _data = {
      //         count: 0,
      //         list: []
      //       };
      //     }
      //     $scope.link(_data.list);
      //   });
      // };
      var bindUserNoData = function() {
        ProfileService.getFaceLibrary({
          cluster: 1,
          list_type: 'all'
        }).then(function (data) {
          if (data.error_code) {
            data = {
              list: []
            }
          } else {
            $scope.user_no_clus = data.list;
          }
        });
      };
      var bindUserClusData = function() {
        $scope.isLoading = true;
        ProfileService.getPoJulei({
          page:$scope.currentPageIndex,
          count:$scope.pageSize,
          st: parseInt($scope.startTime / 1000),
          et: parseInt($scope.endTime / 1000)
        }).then(function (data) {
          if (data.error_code) {
            AppLog.error("请求失败，请刷新页面重试！", 1);
            $scope.isLoading = true;
            data = {
              list: []
            }
          } else {
            $scope.userCount = data.page.total;
            $scope.user_clus = data.list;
            _.each($scope.user_clus, function (_item) {
              var image = new Image();
              image.src = _item.image_url;
              image.onload = function () {
                _item.imgw = image.width;
                _item.imgh = image.height;
                // $scope.isLoading = false;
                // $scope.$apply();
              }
            });
          }
        });
      };
      $scope.$watch("user_clus", function (_v,_ov) {
        if (_v!==_ov) {
          $timeout(function () {
            $scope.isLoading = false;
            $scope.pexl = $scope.user_clus;
            $scope.$apply();
          }, 4000, true);
        };
      });
      var bindUserMoreData = function() {
        $scope.isMoreLoading = true;
        ProfileService.getPoJulei({
          face_id:0,
          page:$scope.currentMorePageIndex,
          count:$scope.pageSize,
          st: parseInt($scope.startTime / 1000),
          et: parseInt($scope.endTime / 1000)
        }).then(function (data) {
          if (data.error_code) {
            AppLog.error("请求失败，请刷新页面重试！", 1);
            $scope.isMoreLoading = true;
            data = {
              list: []
            }
          } else {
            $scope.isMoreLoading = false;
            $scope.userMoreCount = data.page.total;
            $scope.user_more_clus = data.list;
          }
        })
      }
      var resize = function() {
        var $eleTop = document.documentElement.clientHeight-75;
        var flWidth = $element.find('div.face-libary-total div.showUser').outerWidth()-85;
        $element.css('min-height',$eleTop);
        $scope.pageSize = parseInt(flWidth/139) * 4;
        bindUserClusData();
        bindUserMoreData();

        //$element.find('div.face-libary-total div.showUser').css('height', $eleTop+'px');
        $element.find('div.face-libary-total div.showUser ul.infor-user').css('min-height', ($eleTop-285)+'px');
      };

      var dateTime = function() {
        $container_top.find('.time #datetimepicker1 input').datetimepicker({
          language: "zh-CN",
          minView: 0,
          format: 'yyyy-mm-dd hh:ii',
          autoclose: true,
          clearBtn: true
        }).on("changeDate", function(ev) {
          $scope.startTime = ev.date ? (ev.date.getTime() + (ev.date.getTimezoneOffset() * 60000)) : null; //修改时间不正确的问题
        });
        $container_top.find('.time #datetimepicker2 input').datetimepicker({
          language: "zh-CN",
          minView: 0,
          format: 'yyyy-mm-dd hh:ii',
          autoclose: true,
          clearBtn: true
        }).on("changeDate", function(ev) {
          $scope.endTime = ev.date ? (ev.date.getTime() + (ev.date.getTimezoneOffset() * 60000)) : null;
        });
      };
      var checkExist = function(_newItem) {
        var isExits = false;
        if ($scope.remin_num.length === 0) {
          isExits = false;
        } else {
          for (var i = 0; i <= $scope.remin_num.length - 1; i++) {
            if (_newItem.face.face_id === $scope.remin_num[i].face.face_id) {
              isExits = true;
              $scope.remin_num[i].time = _newItem.time;
              break;
            }
          }
        }

        if (!isExits) {
          $scope.remin_num.push(_newItem);
        }
        
      };
      var uniqItems = function(_items, _tmp) {
        if (!_items || $scope.remin_num.length <= 0) return;

        _items = _.sortBy(_items, function(item) {
          return -item.time;
        });
        return _items;

      }
      var getSocketMessage = function(msg) {
        try {
          var item = JSON.parse(msg);
          if (item.event_count <= 0) return;
          for (var i = 0; i < item.event_count; i++) {
            if (item.event_list[i].event_type === 0 && item.event_list[i].face && item.event_list[i].face.event_push === 1) { //人脸识别消息
              console.log(item.event_list[i]);
              item.event_list[i]['deviceid'] = item.deviceid;
              checkExist(item.event_list[i]);
            }
          }
          if ($scope.remin_num.length > 0) {
            $scope.remin_num = uniqItems($scope.remin_num);
            $scope.remindNum = $scope.remin_num.length;
          }

          $scope.$apply();
        } catch (err) {
          console.error(err);
        }
      };
      var init = function() {
        $container_top = $element.find("div.face-libary-total div.face-top");

        $scope.startTime = new Date(IX.Date.getDateByFormat(Date.now(), "yyyy/MM/dd 00:00")).getTime() - (6 * 24 * 60 * 60 * 1000);
        $scope.endTime = new Date(IX.Date.getDateByFormat(Date.now(), "yyyy/MM/dd HH:mm")).getTime();
        $scope.dateOne = IX.Date.getDateByFormat($scope.startTime, "yyyy-MM-dd 00:00"),
        $scope.dateTwo = IX.Date.getDateByFormat(new Date(), "yyyy-MM-dd HH:mm");
        $scope.tabNum = 0;
        $scope.pageSize = 50;
        $scope.currentPageIndex = 1;
        $scope.currentMorePageIndex = 1;
        $scope.user_under_clus = [];
        $scope.user_no_clus = [];
        $scope.user_more_clus = [];
        $scope.remin_num = [];
        $scope.pexl = [];
        $scope.isLoading = false;
        $scope.showMess = false;
        $scope.remindNum = 0;

        if (user) {
					$scope.user = user;
				} else {
					OAuth.init();
					return;
				}

        // resize();
        dateTime();
        bindEvent();
        bindUserUnderData();
        bindUserNoData();
        bindUserClusData();
        bindUserMoreData();
        // bindAiDevice();
      }
      var socket;
      // $scope.link = function(_items) {
      //   if (socket) return;
      //   if (_items.length === 0 ) {return;}
      //   ProfileService.getAiToken({}).then(function(_data) {
      //     socket = io.connect('ws://push.iermu.com:9901');
      //     socket.on('connect', function() {
      //       console.log('连接成功');
      //       socket.emit('authentication', {
      //         token: _data.token
      //       });
      //       // for (var i = 0; i<_items.length; i++) {
      //         socket.emit("subscribe", {
      //           "channel": 'd_'+_items[1].deviceid
      //         });
      //         console.log(_items[1].deviceid);
      //       // }
      //     });
      //     socket.on('message', function(msg) {
      //       getSocketMessage(msg);
      //     });
  
      //     socket.on('disconnect', function(data) {
      //       AppLog.error('消息推送断开连接,刷新页面');
      //       console.log('断开连接');
      //     });
      //     socket.on('error', function(data) {
      //       AppLog.error('消息推送连接错误,刷新页面');
      //       console.log('连接错误');
      //     });
      //   });
      // };

      init();
    }
  ])
})