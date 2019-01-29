define(["app", "oauth", "d_modal", "Echarts", "Echarts_line","ui_dateRange", "socketio", "s_profile", "s_profess", "d_data_left_nav", "ui_videoplayer", "s_layoutmanager", "s_profile", "d_modal", "d_camera_tree_list", "d_camera_multiview", "d_camera_summary_list", "d_camera_identification_mzt", "d_camera_bident","d_finish_filters"], function(Controllers, OAuth, Dialog, echarts , VideoPlayer, LayoutManager , io) {
  Controllers.controller("DataMinzhengtController", ["$scope", "$element", "$timeout", "ProfileService","ProfessService",
    function($scope, $element, $timeout, ProfileService, ProfessService) {
      var user = OAuth.getUser();
      var configIds = [], jsonData = [], jsonAge = [], ageData = [];
      var removeArr;
      var colorImg = ['#facb63','#fd8f37','#e0485c','#871842','#10587b','#3db2e0','#6ad4d9','#48e79e','#b6e860'];
      var date,myChartTip,myChartTip2,myChartTip3;
      var bindData = function() {
        ProfileService.getMyCameras({
          list_type: "all",
          data_type: "none"
        }).then(function (_data) {
          if (_data.error_code) {
            AppLog.error('获取设备失败');
          } else {
            $scope.deviceItem = _data.list;
            _.each($scope.deviceItem,function(_item) {
              _item.checkboxIschecked = true;
              $scope.choseDeviceData.push(_item.deviceid);
            });
            // bindTime();
            dateData();
          }
        })
      };
      console.log(3333);
      console.log(io);
      var bindAiReport = function(_params, isToday) {
        ProfessService.getGraphData(_params).then(function(_data) {
          var data = [],
            tmpIn = [],
            tmpOut = [],
            timeX = [];
          var ISdaty;
          _.each(_data.statuic.list, function(_d) {
            if ($scope.currentQueryType === 0) {
              if (new Date(_d.time * 1000).getHours() >= 7) {
                tmpIn.push([new Date(_d.time * 1000), _d.in]);
                tmpOut.push([new Date(_d.time * 1000), _d.out]);
              } else {
                tmpIn.push([new Date(_d.time * 1000), 0]);
                tmpOut.push([new Date(_d.time * 1000), 0]);
              }
            }else{
              tmpIn.push([new Date(_d.time * 1000), _d.in]);
              tmpOut.push([new Date(_d.time * 1000), _d.out]);
            }
            timeX.push(new Date(_d.time * 1000));
          })
          if (timeX.length < 12) {
            $scope.intervaltype = 1;
          } else if (timeX.length < 25) {
            $scope.intervaltype = 2;
          }
          data.push(tmpIn);
          data.push(tmpOut);
          $scope.data = data;
          $scope.item = timeX;
          ISdaty = thisToday($scope.dateOne);
          echartTip3();
        });
      };
      var removeArr = function(_arr, id) {
        for (i = 0; i < _arr.length; i++) { //n = 0
          if (_arr[i] === id) {
            _arr.splice(i, 1);
            break;
          }
        }
      };
      var bindEvent = function() {
        var $index;
        var firstFire = null;
        $(window).resize(function () {
          myChartTip3.resize();
          if (firstFire === null) {
            firstFire = setTimeout(function () {
              firstFire = null;
            }, 500);
          };
        });
        //右栏事件
        $scope.choseDeviceClick = function() {
          $scope.showModal = true;
        };
        $scope.cancel = function() {
          $scope.showModal = false;
        };
        $scope.IsCheckbox = function(_item) {
          if (_item.checkboxIschecked) {
            _item.checkboxIschecked = false;
          } else {
            _item.checkboxIschecked = true;
          }
        };
        $scope.isNoChecked = function() {
          _.each($scope.deviceItem,function(_item) {
            _item.checkboxIschecked = false;
          })
        };
        $scope.sure = function() {
          $scope.choseDeviceData = [];
          $scope.choseDeviceName = '（';
          _.each($scope.deviceItem,function(_item) {
            if (_item.checkboxIschecked) {
              $scope.choseDeviceData.push(_item.deviceid);
              $scope.choseDeviceName = $scope.choseDeviceName+_item.description+'，';
            }
          });
          $scope.choseDeviceName = $scope.choseDeviceName.substring(0, $scope.choseDeviceName.lastIndexOf('，')) + '）';
          if ($scope.choseDeviceData.length === $scope.deviceItem.length) {
            $scope.choseDevice = true;
          } else {
            $scope.choseDevice = false;
          }
        };
        $scope.onChoseItem = function(_device) {
          if (_device.checked === true) {
            $scope.showDeviceImage.push(_device);
            if (!_.contains(configIds, _device.deviceid)) {
              configIds.push(_device.deviceid);
            }
            ProfileService.getAiCount({
              deviceid: _device.deviceid
            }).then(function(_data) {
              _device.ai_body_count = _data.ai_body_count;
              paintCanvas($scope.showDeviceImage.length-1, _device.ai_body_count);
            })
          } else {
            _.each($scope.showDeviceImage,function(_item,index) {
              if (_item.deviceid === _device.deviceid) {
                $index = index;
              }
            })
            $scope.showDeviceImage.splice($index,1);
            if (_.contains(configIds, _device.deviceid)) {
              configIds.splice(configIds.indexOf(_device.deviceid), 1);
            }
          }
          ProfileService.addMyAiCameras({
            deviceid: configIds.toString()
          }).then(function(_data) {
          });
        };
        $scope.query = function() {
          // bindAiReport({
          //   type: 0,
          //   st: parseInt($scope.startTime)/1000,
          //   et: parseInt($scope.endTime)/1000,
          //   deviceid: $scope.choseDeviceData.join(",")
          // },true);
          if (myChartTip !== null && myChartTip !== "" && myChartTip !== undefined) {
            myChartTip.dispose();
            myChartTip2.dispose();
            myChartTip3.dispose();
          }
          dateData();
        };
      };
      var dateData = function() {
        var name = [],
        total = [];
        $scope.jsonImage = [];
        jsonData = [];
        jsonAge = [];
        ageData = [];
        ProfessService.getGraphData({
          st: parseInt($scope.startTime)/1000,
          et: parseInt($scope.endTime)/1000,
          deviceid: $scope.choseDeviceData.join(",")
        }).then(function(_data) {
          $scope.captureInfo = _data.total;
          $scope.captureAge = _data.data.age;
          $scope.captureClass = _data.data.class;
          _.each($scope.captureClass, function(_item, id) {
            var arr = {
              "name": _item.name,
              "icon": "image://../../../../public/images/contrast/"+(id+1)+".png"
            }
            var arrArea = {
              "value": _item.total,
              "name": _item.name,
              "itemStyle": {
                "normal": {
                  "color": colorImg[id]
                }
              }
            }
            $scope.jsonImage.push(arr);
            jsonData.push(arrArea);

          });
          _.each($scope.captureAge, function(_age, _id) {
            var arr = {
              "name": _age.name,
              "icon": "image://../../../../public/images/contrast/"+(_id+1)+".png"
            }
            var arrArea = {
              "value": _age.total,
              "name": _age.name,
              "itemStyle": {
                "normal": {
                  "color": colorImg[_id]
                }
              }
            }
            jsonAge.push(arr);
            ageData.push(arrArea);
          });
          _.each(_data.data.area, function(_d) {
            name.push(_d.name);
            total.push(_d.total);
          });
          $scope.data = name;
          $scope.item = total;
          echartTip2();
          echartTip();
          echartTip3();
        })
      };
      // var bindTime = function() {
      //   bindAiReport({
      //     type: 1,
      //     st: parseInt($scope.startTime)/1000,
      //     et: parseInt($scope.endTime)/1000,
      //     deviceid: $scope.choseDeviceData.join(",")
      //   },true);
      // };
      var thisToday = function (str) {
        var d = new Date(str.replace(/-/g, "/"));
        var todaysDate = new Date();
        if (d.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)) {
          return true;
        } else {
          return false;
        }
      };
      var dateTime = function() {
        var dateRange1 = new pickerDateRange('date1', {
          isTodayValid:true ,
          startDate: $scope.dateOne,
          endDate: $scope.dateTwo,
          startToday: false,
          stopToday: true,
          needCompare: false,
          defaultText: ' - ',
          autoSubmit: true,
          inputTrigger: 'input_trigger1',
          theme: 'ta',
          success: function (obj) {
            if (obj.startDate === obj.endDate) {
              $scope.startTime = new Date(IX.Date.getDateByFormat(obj.startDate, "yyyy/MM/dd 00:00")).getTime();
              $scope.endTime = new Date(IX.Date.getDateByFormat(obj.endDate, "yyyy/MM/dd 00:00")).getTime() + (24 * 60 * 60 * 1000);
              $scope.currentQueryType = 0;
            } else {
              $scope.currentQueryType = 1;
              $scope.startTime = new Date(IX.Date.getDateByFormat(obj.startDate, "yyyy/MM/dd HH:mm")).getTime();
              $scope.endTime = new Date(IX.Date.getDateByFormat(obj.endDate, "yyyy/MM/dd HH:mm")).getTime();
            }
          }
        });
      };
      var initaccount = function() {
        $scope.currentMenu = 1;
        $scope.distinguish = 2;
        $scope.showDeviceImage = [];
        $scope.showModal = false;
        $scope.currentQueryType = 0;
        $scope.item = [];
        $scope.data = [];

        //右侧
        $scope.minValidDate = new Date(IX.Date.getDateByFormat(Date.now(), "yyyy/MM/dd 00:00")).getTime() - (6 * 24 * 60 * 60 * 1000);
        $scope.startTime = new Date(IX.Date.getDateByFormat(Date.now(), "yyyy/MM/dd 00:00")).getTime();
        $scope.endTime = new Date(IX.Date.getDateByFormat(Date.now(), "yyyy/MM/dd HH:mm")).getTime();
        $scope.dateOne = IX.Date.getDateByFormat($scope.startTime, "yyyy-MM-dd"),
        $scope.dateTwo = IX.Date.getDateByFormat(new Date(), "yyyy-MM-dd");

        $scope.model = {
          name: ''
        }

        $scope.choseDevice = true;
        $scope.choseDeviceData = [];
        $scope.jsonImage = [];
        $scope.choseDeviceName ='（';

        $scope.intervaltype = 1;
        if (user) {
          $scope.user = user;
        } else {
          OAuth.init();
          return;
        }

        bindEvent();
        dateTime();
        bindData();
      };
      var echartTip = function() {
        myChartTip = echarts.init(document.getElementById("pie"));
        var option = {
          tooltip : {
            trigger: 'item',
            formatter: "{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            right: '25%',
            top:'6%',
            itemWidth: 10,
            itemHeight: 10,
            itemGap:12,
            data:jsonAge,
            textStyle: {
              color: '#fff'
            },
          },
          grid: {
            y:20,
          },
          color:['#0ae490','#ff942b','#2274fc'],
          toolbox: {
            show : true,
            feature : {
              mark : {show: true},
              dataView : {show: false, readOnly: false},
              magicType : {
                show: true, 
                type: ['pie', 'funnel'],
                option: {
                  funnel: {
                    x: '25%',
                    width: '50%',
                    funnelAlign: 'center',
                    max: 1548
                  }
                }
              },
              restore : {show: false},
              saveAsImage : {show: false}
            }
          },
          calculable : true,
          series : [
            {
              name:'访问来源',
              type:'pie',
              hoverAnimation:true,
              selectedMode:'single',
              radius : ['50%', '75%'],
              center: ['30%','50%'],
              selectedOffset: 5,
              itemStyle : {
                normal : {
                  borderWidth:2,
                  borderColor: "#5d6372",
                  label : {
                    show : false
                  },
                  labelLine : {
                    show : false
                  }
                },
              },
              emphasis : {
                label : {
                  show : false,
                  position : 'center',
                  textStyle : {
                    fontSize : '14',
                    fontWeight : 'bold'
                  }
                }
              },
              data:ageData
            }
          ]
        };
        myChartTip.setOption(option);
      };
      var echartTip2 = function() {
        myChartTip2 = echarts.init(document.getElementById("pie2"));
        var option = {
          tooltip : {
            trigger: 'item',
            formatter: "{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            right: '5%',
            itemWidth: 10,
            itemHeight: 10,
            itemGap:10,
            top:'6%',
            data:$scope.jsonImage,
            textStyle: {
              color: '#fff'
            },
          },
          grid: {
            y:20,
          },
          color:['#0ae490','#ff942b'],
          toolbox: {
            show : true,
            feature : {
              mark : {show: true},
              dataView : {show: false, readOnly: false},
              magicType : {
                show: true, 
                type: ['pie', 'funnel'],
                option: {
                  funnel: {
                    x: '25%',
                    width: '50%',
                    funnelAlign: 'center',
                    max: 1548
                  }
                }
              },
              restore : {show: false},
              saveAsImage : {show: false}
            }
          },
          calculable : true,
          series : [
            {
              name:'数据',
              type:'pie',
              hoverAnimation:true,
              selectedMode:'single',
           	  selectedOffset:5,
              radius : ['50%', '75%'],
              center: ['30%','50%'],
              itemStyle : {
                normal : {
                  borderWidth:2,
                  borderColor: "#5d6372",
                  label : {
                    show : false
                  },
                  labelLine : {
                    show : false
                  }
                },
                emphasis : {
                  label : {
                    show : false,
                    position : 'center',
                    textStyle : {
                      fontSize : '14',
                      fontWeight : 'bold'
                    }
                  }
                }
              },
              data:jsonData
            }
          ]
        };
        myChartTip2.setOption(option);
      };
      var echartTip3 = function() {
        myChartTip3 = echarts.init(document.getElementById("main"));
        var option = {
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            offset: 5,
            splitArea: {
              show: true,//保留网格区域
              areaStyle: {
                color: ['#494f61'],
                opacity: 0.9,
              }
            },
            splitLine: { 
              show: false,//去除网格线false
              lineStyle: {
                color: ['#a7b1d0'],
                type:'dashed',
                opacity:0.2,
              }
            },
            axisLine: {
              lineStyle: {
                color: '#999'
              }
            },
            boundaryGap: true,
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            data: $scope.data,
            axisLabel: {
              textStyle: {
                color: '#fff'
              }
            }
          },
          calculable: true,
          grid: {
            left: '4%',
            top:20,
            right: '20'
          },
          yAxis: {
            type: 'value',
            min: 0,
            splitArea: {
              show: true,//保留网格区域
              areaStyle: {
                color: ['#494f61'],
                opacity:0.9,
              }
            },
            splitLine: {
              show: true,//去除网格线false
              lineStyle: {
                color: ['#a7b1d0'],
                type: 'dashed'
              }
            },
            nameTextStyle: {
              color: '#999'
            },
            axisLine: {
              lineStyle: {
                color: '#999'
              }
            },
            data: $scope.item
          },
          series: [{
            name: "人数",
            type: "bar",
            data: $scope.item,
            barWidth: '20%',
            itemStyle: {
              normal: {
                color: "rgb(28,193,252)",
                label: {
                  show: true,
                  position: 'top',
                  textStyle: {
                    color: "#999"
                  }
                }
              }
            }
          }]
        };
        myChartTip3.setOption(option);
      };
      initaccount();
    }
  ]);
  //播放器controller
  Controllers.controller("MultiViewController", ["$scope", "$element", "ProfileService", '$timeout',
        function($scope, $element, ProfileService, $timeout) {
            var user = OAuth.getUser();
            var c_max_index = 0;
            var num = 0;
            var resizeTimer = null;
            var chResizeTimer = null;
            $scope.isIpad = IX.browser.versions.mobile;
            if ($scope.isIpad) $("body").addClass("ipad");
            var bindData = function() {
                var isExist = false;
                ProfileService.getProfileMulti().then(function(_data) {
                    // c_max_index = Number(_data.list[_data.list.length - 1].mid);
                    $scope.multiList = _data.list;
                    if (!_data.effMulti) {
                        AppLog.error("用户未设置过多画面,请先设置");
                        // $timeout(function() {
                        $scope.isInit = false;
                        $scope.$emit("isInit", $scope.isInit);
                        $scope.multiType = _data.list[0];
                        // $scope.smultiType = _data.list[0];
                        // $scope.currentMultiType = _data.list[0];
                        // $scope.currentLayout =   _data.list[0];
                        // setTimeout(function() {
                        $scope.setMulti = true;
                        // }, 100);
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
                    $scope.$emit("camerasList", $scope.camerasList);
                    ProfileService.getMyAiCameras({}).then(function (_data) {
                        $scope.deviceStart = "";
                        if (_data.list.length <= 0) {
                            $scope.moreAi = false;
                            $scope.smiling = true;
                            $scope.$emit("moreAi", $scope.moreAi);
                            return;
                        }
                        _.each(_data.list, function (_item) {
                            $scope.deviceStart = _item.deviceid + "," + $scope.deviceStart;
                        });
                        _.each($scope.camerasList, function (_item) {
                            if ($scope.deviceStart.indexOf(_item.deviceid) != -1) {
                                $scope.Yai = true;
                            } else {
                                $scope.moreAi = false;
                                $scope.smiling = true;
                            }
                        });
                        if ($scope.Yai) {
                            $scope.moreAi = true;
                            $scope.smiling = false;
                        }
                        $scope.$emit("moreAi", $scope.moreAi);
                    });
                })
            };
            $scope.$watch("videosList", function(_v, _ov) {
                if (_v !== _ov && _v !== "") {
                    bindData();
                }
            });
            var dist;
            var bindEvent = function() {
                $scope.cancelMobileFull = function(){
                    if (IX.browser.versions.mobile) {
                        // $('.mutiConfig').addClass("ff");
                        $scope.mobileFull = false;
                        $timeout(function() {
                            $scope.onChangeLayout(true, true);
                        }, 0, true);
                        return;
                    }
                };
                $scope.fullscreen = function() {
                    if (IX.browser.versions.mobile) {
                        // $('.mutiConfig').addClass("ff");
                        $scope.mobileFull = true;
                        $timeout(function() {
                            $scope.onChangeLayout(true, true);
                        }, 0, true);
                        return;
                    }
                    console.log(111);
                    $scope.isFullscreen = true;
                    $scope.morescreen = true;
                    $scope.cancelFulling = true;
                    $scope.$emit("morescreen", $scope.morescreen);
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
                    };
                    $timeout(function () {
                        if (window.outerHeight >= screen.availHeight) {
                            if (window.outerWidth >= screen.availWidth) {
                                $scope.onChangeLayout(true, true);
                            };
                        };
                    }, 500, true);
                };
                var cancelfullscreen = function() {
                    $scope.isFullscreen = false;
                    $scope.cancelFulling = false;
                    $scope.morescreen = false;
                    $scope.$emit("morescreen", $scope.morescreen);
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
                    if (!$scope.setMulti) {
                        $scope.onChangeLayout(true, true);
                    };
                };
                document.onwebkitfullscreenchange = document.onmozfullscreenchange = document.onmsfullscreenchange = function () {
                    if (!document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement && !document.fullscreenElement) {
                        cancelfullscreen();
                        $timeout(function () {
                            childresize();
                            // $scope.onChangeLayout(true, true);
                        }, 0, true);
                    }
                };
                var CanF = function() {
                    cancelfullscreen();
                    $timeout(function () {
                        childresize();
                        // $scope.onChangeLayout(true, true);
                    }, 0, true);
                };
                document.addEventListener("fullscreenchange", function(e) {
                    if ($scope.isFullscreen && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement && !document.fullscreenElement) {
                        CanF();
                    }
                });
                document.addEventListener("mozfullscreenchange", function(e) {
                    if ($scope.isFullscreen && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement && !document.fullscreenElement) {
                        CanF();
                    }
                });
                document.addEventListener("webkitfullscreenchange", function(e) {
                    if ($scope.isFullscreen && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement && !document.fullscreenElement) {
                        CanF();
                    }
                });
                document.addEventListener("msfullscreenchange", function(e) {
                    if ($scope.isFullscreen && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement && !document.fullscreenElement) {
                        CanF();
                    }
                });
                //单多画面全屏状态互不影响
                var checkFull = function () {
                    var isFull = document.fullscreenEnabled || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
                    if (isFull === undefined) isFull = false;
                    return isFull;
                }
                window.onresize = function () {
                    if (resizeTimer) clearTimeout(resizeTimer);
                    resizeTimer = setTimeout(function () {
                        //console.log("窗口发生改变了哟！");
                        if (!checkFull()) {
                            cancelfullscreen();
                        }
                    }, 500);

                }
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
                    $scope.$emit("setMulti", $scope.setMulti);
                    $scope.results = true;
                    $scope.$emit("results", $scope.results);
                    $scope.noai = true;
                    $scope.$emit("noai", $scope.noai);
                    $timeout(function() {
                        childresize();
                        $scope.resize();
                    }, 0, true);
                };
                $scope.PoinHideOrShow = function () {
                    console.log($scope.results);
                    if (!$scope.results) {
                        $scope.results = true;
                        $scope.emp = false;
                        $scope.eyes = false;
                    } else {
                        $scope.results = false;
                        $scope.eyes = true;
                        if ($scope.haveface.length == 0) {
                            $scope.emp = true;
                        } else {
                            $scope.emp = false;
                        }
                    }
                    $scope.$emit("results", $scope.results);
                    $scope.$emit("emp", $scope.emp);
                    $scope.$emit("eyes", $scope.eyes);
                };
                $scope.wheeled = function() {//多画面轮播
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
                    $scope.noai = false;
                    $scope.variable = false;
                    $scope.oneConfig = false;
                    $scope.$emit("oneConfig", $scope.oneConfig);
                    $scope.$emit("variable", $scope.variable);
                    $scope.$emit("noai", $scope.noai);
                    $scope.$emit("setMulti", $scope.setMulti);
                    $scope.a = !$scope.a;
                    if ($scope.multiType.lid !== $scope.currentMultiType.lid) {
                        $scope.multiType = $scope.currentMultiType;
                        $scope.multiCids = $scope.multiType.cid || [];
                    }
                    if ($scope.multiType.cycle) {
                        $scope.checked = true;
                        $scope.wheelTime = $scope.multiType.cycle;
                    }
                    $scope.cancelSelectCategorys($scope.multiCids);
                    $timeout(function() {
                        childresize();
                        $scope.onChangeLayout(true, true);
                    }, 0, true);
                }
                $scope.saveEdit = function() {
                    var dvstr,dvarr = [];
                    $scope.Yai = false;
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
                    $scope.setMulti = false;
                    $scope.$emit('setMulti', $scope.setMulti);
                    $scope.variable = true;
                    $scope.oneConfig = false;
                    $scope.$emit("oneConfig", $scope.oneConfig);
                    $scope.$emit("variable", $scope.variable);
                    $scope.noai = false;
                    $scope.$emit("noai", $scope.noai);
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
                    ProfileService.getMyAiCameras({}).then(function (_data) {
                        $scope.deviceStr = "";
                        if (_data.list.length <= 0) {
                            $scope.moreAi = false;
                            $scope.smiling = true;
                            $scope.$emit("moreAi", $scope.moreAi);
                            return;
                        }
                        _.each(_data.list, function (_item) {
                            $scope.deviceStr = _item.deviceid + "," + $scope.deviceStr;
                        });
                        _.each(playingCameras, function (_item) {
                            if ($scope.deviceStr.indexOf(_item.deviceid) != -1) {
                                dvarr.push(_item.deviceid);
                                $scope.Yai = true;
                            }else{
                                $scope.moreAi = false;
                                $scope.smiling = true;
                            }
                        });
                        if ($scope.Yai) {
                            $scope.moreAi = true;
                            $scope.smiling = false;
                        }
                        $scope.$emit("moreAi", $scope.moreAi);
                        dvstr = dvarr.join(',');
                        ProfileService.addMyAiCameras({
                            deviceid: dvstr
                        }).then(function (_data) {
                            $scope.statis = true;
                            $scope.$emit("statis", $scope.statis);
                        });
                    });
                    ProfileService.saveProfileMultiPlayInfo(params).then(function(_data) {
                        if (_data.error_code) {
                            AppLog.info("多画面设置失败", 1);
                            return;
                        }
                        AppLog.info("多画面设置成功", 1);
                        // $scope.camerasList = $scope.getCamerasByCids($scope.multiCids);
                        $scope.isInit = true;
                        $scope.$emit("isInit", $scope.isInit);
                        $scope.categorysBindData();
                        $scope.cancelSelectCategorys();
                        childresize();
                        $element.find('.camera-multiview').empty();
                    });
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

                    $scope.multiType = _type;
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
                }
                $scope.$on("results", function (event, data) {
                    $scope.results = data;
                });
                $scope.$on("single", function(event, data) {
                    $scope.single = data;
                    if ($scope.single) {
                        $timeout(function () {
                            childresize();
                        }, 0, true);
                    }
                });
                $scope.$on("smiling", function (event, data) {
                    $scope.smiling = data;
                });
            };
            $(window).resize(function () {
                if (chResizeTimer) clearTimeout(chResizeTimer);
                chResizeTimer = setTimeout(function () {
                    //console.log("窗口变化");
                    if ($scope.single) {
                        childresize();
                    }
                }, 500);
            });
            var childresize = function() {
                var h = $scope.setMulti ? $element.find(".screenShow>.f").outerHeight(true) : 0;
                // var drh = $scope.setdrag ? $element.find(".screenShow>.drags").outerHeight(true)+20 : 0;
                $scope.sizechange = true;
                $scope.$emit("sizechange", $scope.sizechange);
                $scope.$on("camerh", function(event, data) {
                    $scope.camerh = data;
                });
                if (!$scope.isFullscreen) {
                    if (navigator.userAgent.indexOf('Firefox') >= 0 && !$scope.results) {
                        $element.find(".cameraList").height($element.find(".screenShow").height() - $('.botsnap').height());
                    } else {
                        $element.find(".cameraList").height($element.find(".screenShow").height() - h);
                    }
                    $element.find(".mutiConfig").height($scope.camerh);

                    //$element.find(".cameraList").height($scope.camerh - h);
                }
            };
            $scope.$on("setMulti", function(event, data) {
                $scope.setMulti = data;
            });
            $scope.$on("onSelectCategorys", function(event, data) {
                $scope.onSelectCategorys = data;
            });
            $scope.$on("cancelSelectCategorys", function(event, data) {
                $scope.cancelSelectCategorys = data;
            });
            $scope.$on("multiCids", function(event, data) {
                $scope.multiCids = data;
            });
            $scope.$on("multiType", function(event, data) {
                $scope.multiType = data;
            });
            $scope.$on("getCamerasByCids", function(event, data) {
                $scope.getCamerasByCids = data;
            });
            $scope.$on("videosList", function(event, data) {
                $scope.videosList = data;
            });
            $scope.$on("categorysBindData", function(event, data) {
                $scope.categorysBindData = data;
            });
            var Miinit = function() {
                $scope.downNum = 0;
                $scope.upNum = 0;
                $scope.aidevices = [];
                $scope.aiIndex = [];
                $scope.wheelTime = "";
                $scope.editType = false;
                $scope.Yai = false;
                $scope.morescreen = false;
                $scope.standLayout = [{
                    "lid": "s1",
                    "name": "单画面"
                }, {
                    "lid": "s2",
                    "name": "4画面"
                }, {
                    "lid": "s3",
                    "name": "9画面"
                } ,{
                    "lid": "s4",
                    "name": "16画面"
                },
                    {
                        "lid": "s6",
                        "name": "36画面"
                    }
                ];
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
                $scope.isFullscreen = false;
                $scope.currentTime = $scope.times[1];
                $scope.editType = true;
                $scope.setMulti = false;
                $scope.isInit = true;
                $scope.$emit("isInit", $scope.isInit);
                childresize();
                bindEvent();
            };
            $scope.$on("oneConfig", function (event, data) {
                $scope.oneConfig = data;
            });
            $scope.$on("single", function (event, data) {
                $scope.single = data;
            });
            $scope.$watch("single", function () {
                if (!$scope.single) {
                    num = ++num;
                    _.each($scope.currentPlayingVideos, function (_vm) {
                        _vm.destroy();
                    });
                    if (num === 1) {
                        $scope.selectItem($scope.videosList[0]);
                    }
                } else {
                    $timeout(function () {
                        childresize();
                        $scope.onChangeLayout(true, true);
                    }, 0, true);
                    if ($scope.videoPlayerManager) $scope.videoPlayerManager.destroy();
                }
            });
            $scope.$watch("oneConfig", function () {
                if ($scope.oneConfig) {
                    $timeout(function () {
                        childresize();
                        $scope.onChangeLayout(true, true);
                        $scope.toggleEnableConfig();
                    }, 0, true);
                };
            });
            $scope.$watch("results",function () {
                if ($scope.single) {
                    $timeout(function () {
                        childresize();
                        if (!$scope.setMulti) {
                            $scope.onChangeLayout(true, true);
                        }
                    }, 0, true);
                }
            }, true);
            $scope.$watch("playingCamera", function (_v,_ov) {
                $scope.$emit("playingCamera", $scope.playingCamera);
                if (_v !== _ov) {
                    MultiScreenFullScreenFace();
                }
            },true);
            // $scope.$watch("playingCamera[0].deviceid", function (_v, _ov) {
            //   $scope.$emit("playingCamera", $scope.playingCamera);
            //   if (_v !== _ov) {
            //     MultiScreenFullScreenFace();
            //   }
            // }, true);

            var MultiScreenFullScreenFace = function () {
                var $devlis = $element.find("div[class^='dvideo']");
                $scope.aiIndex = [];
                $scope.aidevices = [];
                if ($scope.single && $element.find(".video-player-wrap").length <= 9 && $scope.okpush) {
                    ProfileService.getMyAiCountedCameras({
                        is_statistics: 1
                    }).then(function (_data) {
                        _.each(_data.list, function (item) {
                            _.each($scope.playingCamera, function (_item, index) {
                                if (item.deviceid == _item.deviceid) {
                                    $scope.aidevices.push(_item);
                                    $scope.aiIndex.push(index);
                                }
                            })
                        })
                        _.each($scope.aiIndex, function (item) {
                            _.each($devlis, function (_item, index) {
                                if (item == index) {
                                    console.log("我是第" + (index + 1) + "个video");
                                    var $li = $element.find(".dvideo" + (index + 1));
                                    var $toast = $("<div class='pushed" + (index + 1) + "'>" +
                                        "<div class='putop" + (index + 1) + "'></div>" +
                                        "<div class='pubot" + (index + 1) + "'></div>" +
                                        "</div>");
                                    if ($element.find(".dvideo" + (index + 1)).find(".pushed" + (index + 1)).length<1) {
                                        $li.append($toast);
                                    }
                                    ProfileService.getPoJulei({
                                        list_type: 'page',
                                        face_id: -1,
                                        deviceid: $scope.playingCamera[item].deviceid,
                                        page: 1,
                                        count: 10
                                    }).then(function (data) {
                                        if (data.list.length > 0) {
                                            data.list.reverse();
                                            _.each(data.list, function (_item) {
                                                eachAll(_item);
                                            });
                                        };
                                    });
                                };
                            })
                        })
                    });
                };
            };
            var dataTimeAll = function (m) { return m < 10 ? '0' + m : m };
            var formatDateAll = function (now) {
                var time = new Date(now);
                var h = time.getHours();
                var mm = time.getMinutes();
                var s = time.getSeconds();
                return dataTimeAll(h) + ':' + dataTimeAll(mm) + ':' + dataTimeAll(s);
            };
            var eachAll = function (_newItem) {
                var moreStr, hclass, icla, timer, $facetarget;
                _.each($scope.playingCamera, function (item, index) {
                    if (_newItem.deviceid == item.deviceid) {
                        timer = formatDateAll(parseInt(_newItem.time * 1000));
                        if (_newItem.face) {
                            if (_newItem.face.name != "") {
                                moreStr = _newItem.face.name;
                                hclass = "okh";
                                icla = "iok";
                            } else {
                                moreStr = "ID:" + _newItem.face.face_id;
                                hclass = "haveid";
                                icla = "iques";
                            }
                        } else {
                            moreStr = "陌生人";
                            hclass = "noknow";
                            icla = "imark";
                        }
                        var $botever = "<div class='morebotface'>" +
                            "<div class='lp'>" +
                            "<div class='lppic' style='background-image: url(" + _newItem.image_url + ")'>" +
                            "<i class='" + icla + "'></i>" +
                            "</div>" +
                            "</div >" +
                            "<div class='rp'>" +
                            "<h3 class='" + hclass + "'>" + moreStr + "</h3>" +
                            "<p>" + timer + "&nbsp;进入视野</p>" +
                            "</div>" +
                            "</div>";
                        var $pubot = $element.find(".pubot" + (index + 1));
                        $pubot.append($botever);
                        $pubot.bind('DOMNodeInserted', function () {
                            $pubot.scrollTop($pubot[0].scrollHeight);
                        });
                    }
                })
                if (_newItem.face && _newItem.face.name != "") {
                    $scope.lotface.push(_newItem);
                    _.each($scope.lotface, function (newdata, facenum) {
                        var $snap = "<div class='moretopface" + newdata.face.face_id + "' style='background-image: url(" + newdata.face.image_url + ")'>" +
                            "</div>";
                        _.each($scope.playingCamera, function (item, index) {
                            if (newdata.deviceid == item.deviceid) {
                                var $putop = $element.find(".putop" + (index + 1));
                                if ($putop.find(".moretopface" + newdata.face.face_id).length == 0) {
                                    $putop.prepend($snap);
                                } else {
                                    $putop.find(".moretopface" + newdata.face.face_id).remove();
                                    $putop.prepend($snap);
                                }
                            }
                        })
                    })
                }
            }
            $scope.$watch("okpush", function () {
                $timeout(function () {
                    MultiScreenFullScreenFace();
                }, 0, true);
            },true);
            Miinit();
        }
    ]);
  //index
    Controllers.controller("MonitorController", ["$scope", "$element", "ProfileService", '$timeout',
        function($scope, $element, ProfileService, $timeout) {
            var $target,$count,$parr=[];
            var isFullScreen, firstParent;
            var user = OAuth.getUser();
            var urls = document.location.pathname.split("/");
            var deviceId = urls[urls.length - 1];
            var currentPlayCategory;
            var b_status = {},
                b_cvr = {};
            var languages = {
                "zh-cn": {
                    "lp1": "保存成功！",
                    "lp2": "参数设置失败，请重试！",
                    "lp3": "请设置参数！",
                    "lp4": "直播",
                    "lp5": "录像",
                    "lp13": "设置",
                },
                "en": {
                    "lp1": "Save success",
                    "lp2": "Parameter setting failed, please try again!",
                    "lp3": "Please set parameters!",
                    "lp4": "live",
                    "lp5": "video",
                    "lp13": "Set Up",
                }
            }
            if (navigator.userAgent.indexOf('Firefox') >= 0) {
                $element.find(".poin-wrap").css("overflow", "hidden");
            }
            $scope.isIpad = IX.browser.versions.mobile;
            if ($scope.isIpad) $("body").addClass("ipad");
            //摄像机设置
            var bindDevConfig = function() {
                $scope.cancelEditBaseInfo = function() {
                    $scope.baseInfoEditing = false;
                };
                $scope.closeModal = function() {
                    $scope.baseInfoEditing = false;
                }
                $scope.saveBaseInfo = function() {
                    $scope.e_description = $scope.e_description || "";
                    if ($scope.e_description.trim().length > 20) {
                        AppLog.error(languages[CURRENT_PROJECT_LANGUAGE].lp71, 1);
                        return;
                    }
                    $scope.description = $scope.e_description.trim();
                    if ($scope.e_introduction && $scope.info) {
                        $scope.info.intro = $scope.e_introduction;
                        updateDevInfo();
                    }
                    updateDesc();
                };
                $scope.editBaseInfo = function() {
                    $scope.baseInfoEditing = true;
                    $scope.e_description = $scope.description;
                };
                $scope.saveConfig = function() {
                    var updateStatus = {};
                    var updateCvr = {};
                    var skey, sk, ckey, ck, k, key;
                    $scope.isShowLoading = false;
                    for (skey in b_status) {
                        if (true) {
                            //do
                        }
                        for (sk in $scope.status) {
                            if (skey === sk && b_status[skey] !== $scope.status[sk]) {
                                updateStatus[sk] = $scope.status[sk];
                            }
                        }
                    }
                    for (ckey in b_cvr) {
                        if (true) {
                            //do
                        }
                        for (ck in $scope.cvr) {
                            if (ckey === ck && b_cvr[ckey] !== $scope.cvr[ck]) {
                                updateCvr[ck] = $scope.cvr[ck];
                            }
                        }
                    }
                    // if($scope.cvr[cvr] === b_cvr[cvr]){
                    //  delete $scope.cvr['cvr'];
                    // }
                    bashInfo = _.extend({}, updateStatus, updateCvr);
                    if (_.isEmpty(bashInfo)) {
                        AppLog.error(languages[CURRENT_PROJECT_LANGUAGE].lp3, 1);
                        $scope.isShowLoading = true;
                        return;
                    }
                    ProfileService.getMyCameraConfigInfo({
                        deviceid: deviceInfo.deviceid,
                        fileds: bashInfo
                    }).then(function(_data) {
                        if (_data.error_code) {
                            AppLog.error(languages[CURRENT_PROJECT_LANGUAGE].lp2, 1);
                            // $scope.isShowLoading = true;
                            return;
                        }
                        AppLog.success(languages[CURRENT_PROJECT_LANGUAGE].lp1, 1);
                        // $scope.editConfigEnable = false;
                        // $scope.isShowLoading = true;
                        $scope.showModalConfig = false;
                        for (k in bashInfo) {
                            for (key in $scope.status) {
                                if (key === k) {
                                    $scope.status[key] = bashInfo[k];
                                    b_status[key] = bashInfo[k];
                                }
                            }
                            if (k === 'power' && bashInfo[k] === 1) {
                            }
                            if (k === 'cvr') {
                                $scope.cvr['cvr'] = bashInfo[k];
                                b_cvr['cvr'] = bashInfo[k];
                            }
                        }
                    });
                };

                $scope.editConfig = function(_config, _value) {
                    $scope[_config.split(".")[0]][_config.split(".")[1]] = _value;
                };
                $scope.cancelEditConfig = function() {
                    // $scope.editConfigEnable = false;
                    $scope.showModalConfig = false;
                };
                $scope.point = function () {
                    $scope.haveface = [];
                    $scope.noface = [];
                    $scope.single = false;
                    $scope.provideo = true;
                    if ($scope.isAi) {
                        $scope.results = false;
                        $scope.smiling = false;
                        ProfileService.getPoJulei({
                            list_type: 'page',
                            face_id: -1,
                            deviceid: $scope.dvinfo,
                            page: 1,
                            count: 10
                        }).then(function (data) {
                            //console.log(data);
                            $scope.pastData = data.list;
                            if ($scope.pastData.length > 0) {
                                $scope.emp = false;
                                $scope.pastData.reverse();
                                _.each($scope.pastData, function (_item) {
                                    checkExist(_item);
                                });
                            }else{
                                $scope.emp = true;
                            };
                        });
                    } else{
                        $scope.results = true;
                        $scope.smiling = true;
                        // $scope.noai = true;
                    }
                    $element.find(".cameraList").empty();
                    if ($scope.devstatus) {
                        ProfileService.addMyAiCameras({
                            deviceid: $scope.dvinfo
                        }).then(function (_data) {
                            eventId = "ai_statistics";
                            $scope.pointface = true;
                        });
                        initVideo();
                    }
                    $scope.$broadcast("single", $scope.single);
                }
                $scope.points = function () {
                    $scope.dis();
                    var dvstr, dvarr=[];
                    $scope.haveface = [];
                    $scope.noface = [];
                    $scope.single = true;
                    $scope.noai = false;
                    if ($scope.moreAi) {
                        $scope.results = false;
                        $scope.smiling = false;
                        $scope.emp = true;
                    }else{
                        $scope.results = true;
                        $scope.smiling = true;
                    }
                    $scope.$broadcast("smiling", $scope.smiling);
                    $scope.$broadcast("results", $scope.results);
                    $scope.provideo = false;
                    $scope.pointface = false;
                    if (!$scope.isInit) {
                        $scope.setMulti = true;
                    } else {
                        $scope.setMulti = false;
                    }
                    $element.find(".video-player-module-wrap").empty();
                    _.each($scope.videosList, function(_item) {
                        dvarr.push(_item.deviceid);
                    });
                    dvstr = dvarr.join(',');
                    ProfileService.addMyAiCameras({
                        deviceid: dvstr
                    }).then(function(_data) {
                        eventId = "ai_statistics";
                        $scope.link();
                    });
                    $scope.$broadcast("single", $scope.single);
                }
                $scope.$on("isInit", function (event, data) {
                    $scope.isInit = data;
                });
                $scope.$on("setMulti", function(event, data) {
                    $scope.setMulti = data;
                });
            };
            var bindEvent = function() {

                document.addEventListener('DOMContentLoaded', ready, false);
                document.addEventListener('touchmove', function(ev) {

                    var $treeList = $(".list-wrap");
                    var treeW = $treeList.width();
                    var treeH = $treeList.height();
                    var treeLeft = $treeList.offset().left;
                    var treeTop = $treeList.offset().top;
                    var oLeft = ev.touches[0].pageX;
                    var oTop = ev.touches[0].pageY;

                    if (oLeft < treeW && oTop > treeTop && oTop < (treeTop + treeH)) {

                    } else {
                        ev.preventDefault();
                    }
                }, false);

                function ready() {
                    document.querySelector('.body').addEventListener('touchmove', function(ev) {
                        ev.stopPropagation();
                    }, false);
                }
                $scope.changeMult = function() {
                    $element.find("ul.show-m").fadeToggle('fast');
                }

                $scope.hideMultiMenue = function() {
                    $element.find("ul.show-m").hide();
                }

                $scope.setLayout = function(_type) {
                    $scope.multiType = _type;
                    //console.log($scope.multiType)
                }

                $scope.checkedElem = function(_target) {
                    $target = _target;
                }
                $scope.hideBaseInfo = function() {
                    $scope.cos = !$scope.cos;
                    // var h = Number($element.find(".base-info").css("height").replace('px', ''));
                    // if (!h || h > 20) {
                    //   $element.find(".base-info").animate({
                    //     height: '20px'
                    //   },100);
                    // } else {
                    //   $element.find(".base-info").animate({
                    //     height: '132px'
                    //   },100);
                    // };
                };
                //云台自动旋转
                $scope.yuntaiAuto = function() {
                    if (!deviceInfo) {
                        return;
                    }
                    $scope.videoPlayerManager.trigger("control-yuntai-oper", "yuntai-auto");
                };
                $scope.CloseModal = function() {
                    $scope.showModalDetail = false;
                };
                //停止云台
                // $scope.stopCloud = function() {
                //   CallServer.CallServer["camera_yuntai_result_callserver"](_.extend({
                //     method: "rotate",
                //     rotate: "stop",
                //     deviceid: deviceInfo['deviceid']
                //   }), function(data) {
                //     if (data) {
                //       //todo
                //     }
                //   });
                // };
                $scope.HideOrShow = function() {
                    if (!$scope.results) {
                        $scope.results = true;
                        $scope.emp = false;
                        $scope.eyes = false;
                    } else {
                        $scope.results = false;
                        $scope.eyes = true;
                        if ($scope.haveface.length == 0) {
                            $scope.emp = true;
                        } else {
                            $scope.emp = false;
                        }
                    }
                };
                $scope.OneAll = function () {
                    if ($element.find(".pic-fullscreen").length>0) {
                        $element.find(".pic-fullscreen").click();
                    }
                }
                $scope.OneToggleConfig = function () {
                    $scope.single = true;
                    $scope.oneConfig = true;
                    $scope.$broadcast("single", $scope.single);
                    $scope.$broadcast("oneConfig", $scope.oneConfig);
                }
            };
            $scope.$on("oneConfig", function (event, data) {
                $scope.oneConfig = data;
            });
            var bindAiDevice = function () {
                ProfileService.getAiDevices({
                }).then(function (_data) {
                    if (_data.error_code) {
                        _data = {
                            count: 0,
                            list: []
                        };
                    }
                    $scope.ainum = _data.list.length;
                    if ($scope.ainum > 0) {
                        // if (!$scope.single ) {
                        //   $scope.results = false;
                        // }else{
                        //   $scope.results = true;
                        // }
                        bindAiSoeck(_data.list);
                        $scope.results = false;
                    }else{
                        $scope.results = true;
                        $scope.noai = true;
                    }
                });
            };
            var bindAiSoeck = function(_devices) {
                var dvarr = [];
                $scope.haveface = [];
                $scope.noface = [];
                _.each(_devices, function(_item) {
                    dvarr.push(_item.deviceid);
                });
                dvstr = dvarr.join(',');
                ProfileService.getPoJulei({
                    list_type: 'page',
                    face_id: -1,
                    deviceid: dvstr,
                    page: 1,
                    count: 10
                }).then(function (data) {
                    $scope.pastData = data.list;
                    if ($scope.pastData.length > 0) {
                        $scope.emp = false;
                        $scope.pastData.reverse();
                        _.each($scope.pastData, function (_item) {
                            checkExist(_item);
                        });
                    }else{
                        $scope.emp = true;
                    };
                });
                ProfileService.addMyAiCameras({
                    deviceid: dvstr
                }).then(function(_data) {
                    eventId = "ai_statistics";
                    $scope.link();
                });
            };
            $(window).resize(function () {
                if (firstParent) clearTimeout(firstParent);
                firstParent = $timeout(function () {
                    firstParent = null;
                    if (!$scope.single) {
                        resize();
                    }
                }, 0,true);
            });
            var screenStatus = function () {
                document.querySelector(".f-show-history").addEventListener('click', function () {
                    $scope.putface = [];
                    $scope.downface = [];
                    $scope.isScreen = false;
                    $scope.$apply();
                    //console.log($scope.isScreen);
                });
                document.querySelector(".f-play-zhibo").addEventListener('click', function () {
                    $scope.isScreen = true;
                    $scope.$apply();
                    //console.log($scope.isScreen);
                });
            }
            var resize = function(_flag) {
                var bw, bh, vw, vh, mw, mh, allwidth, allheight,moniW,botW;
                if (isFullScreen) {
                    screenStatus();
                    if ($element.find(".video-play-menus").hasClass("video_play")) {
                        $scope.isScreen = false;
                    }else{
                        if ($scope.noai) {
                            $scope.isScreen = false;
                        }else{
                            $scope.isScreen = true;
                        }
                    }
                    //$scope.isScreen = true;
                    $element.find('.video-player-module-wrap').css({
                        "width": "100%",
                        "height": "100%",
                    });
                    if ($scope.videoPlayerManager) $scope.videoPlayerManager.resetSize($element.find(".video-player-module-wrap").width(), $element.find(".video-player-module-wrap").height());
                    return;
                }else{
                    $scope.isScreen = false;
                    $scope.putface = [];
                    $scope.downface = [];
                    if ($element.find(".video-play-menus").hasClass("video_play")) {
                        $scope.results = true;
                        $scope.noai = true;
                        //$element.find(".pro-video-live a span").text("看直播");
                        if ($scope.haveface.length > 0) {
                            $scope.emp = false;
                        } else {
                            $scope.emp = true;
                        }
                    }
                }
                $element.height($("body").outerHeight(true) - $("body>nav").height());
                if ($(window).width()<1300) {
                    allwidth = 1300;
                }else{
                    allwidth = $(window).width();
                };
                // if ($(window).height() < 750) {
                //   allheight = 750;
                // } else {
                //   allheight = $(window).height();
                // }

                if (!_flag) $element.find(".poin-wrap").width(allwidth - $(".left-nav").width()-247);
                $element.find(".poin-wrap").height($("body").height()- $("body>nav").height() - 14);
                $element.find(".poin-wrap div.moni-video div.contrast").height($("body").height()- $("body>nav").height() - 14);
                $element.find(".poin-wrap div.moni-video div.contrast div.ident").height($("body").height() - $("body>nav").height() - 14);
                $scope.ulHeight = $("body").height() - $("body>nav").height() - 14;
                moniW = $element.find(".poin-wrap").width()-3;
                botW =  $(".poin-wrap").width() - ($(".contrast").outerWidth(true) | 0);
                bw = $element.find(".poin-wrap").width()-$(".contrast").width()+60;
                if ($(window).width() <= 1750) {
                    bw = $element.find(".poin-wrap").width() - $(".contrast").width();
                } else{
                    bw = $element.find(".poin-wrap").width() - $(".contrast").width() + 60;
                };
                bh = $element.find(".poin-wrap").height() -($(".video-play-menus").outerHeight(true) | 0);
                if (bw * 9 / 16 > bh) {
                    mw = (bh * 16 / 9)*0.9;
                    mh = (bh-220) * 0.9;
                    vw = bw-160;
                    vh = (mh + 24)*100/90;
                    $element.find('.moni-video').css({
                        "width": moniW + "px",
                        "height": ($element.find(".poin-wrap").height()-$element.find('.botsnap').height()) + "px",
                    });
                    if ($(window).width() <= 1366) {
                        $element.find('.moni-video').css({
                            "width": moniW + "px",
                            "height": ($element.find(".poin-wrap").height() - $element.find('.botsnap').height()-11) + "px",
                        });
                    }
                    $element.find('.botsnap').css({
                        "width": (botW-3) + "px",
                    });
                    $element.find('.bot-wrap').css({
                        "width": vw + "px",
                        "height": vh + "px",
                        "margin-left":10,
                        //"margin-left": (vw-mw-50)/2,//24
                        "display": "inline-block"
                    });
                    $element.find('.video-player-module-wrap').css({
                        "width": (vw-24) + "px",
                        // "width": mw + "px",
                        "height": mh + "px",
                    });
                    $element.find('.morepic').css({
                        "width":  vw-4+ "px",
                        "height": mh + "px",
                        // "height":  vh-4+ "px",
                    });
                    if (!$scope.single && $scope.videoPlayerManager) $scope.videoPlayerManager.resetSize((vw - 24), mh);
                    if ($scope.smiling) {
                        $element.find('.morepic').css({
                            "width": vw + 34 + "px",
                            "height": mh + 220 + "px",
                        });
                        $element.find('.bot-wrap').css({
                            "width": vw + 24 + "px",
                            "height": vh + 220 + "px",
                        });
                        $element.find('.video-player-module-wrap').css({
                            "width": vw  + "px",
                            "height": mh + 220 + "px",
                        });
                        if (!$scope.single && $scope.videoPlayerManager) $scope.videoPlayerManager.resetSize(vw  , mh+220);
                    } else {
                        if ($scope.results) {
                            $element.find('.morepic').css({
                                "width": vw + 34 + "px",
                                "height": mh + 220 + "px",
                            });
                            $element.find('.bot-wrap').css({
                                "width": vw + 24 + "px",
                                "height": vh + 220 + "px",
                            });
                            $element.find('.video-player-module-wrap').css({
                                "width": vw  + "px",
                                "height": mh + 220 + "px",
                            });
                            if (!$scope.single && $scope.videoPlayerManager) $scope.videoPlayerManager.resetSize(vw , mh + 220);
                        }
                    }
                } else {
                    mw = bw * 0.90;
                    mh = (bw * 9 / 16) * 0.90;
                    vw = bw;
                    vh = (mh + 24)*100/90;
                    $element.find('.moni-video').css({
                        "width": moniW + "px",
                        "height": ($element.find(".poin-wrap").height()-$element.find('.botsnap').height()) + "px",
                    });
                    if ($(window).width() <= 1366) {
                        $element.find('.moni-video').css({
                            "width": moniW + "px",
                            "height": ($element.find(".poin-wrap").height() - $element.find('.botsnap').height() - 110) + "px",
                        });
                    }
                    $element.find('.botsnap').css({
                        "width": (botW - 3) + "px",
                    });
                    $element.find('.bot-wrap').css({
                        "width": mw + 24 + "px",
                        "height": mh + 24 + "px",
                        "margin-left": 10,
                        //"margin-left": (vw-mw-50)/2,
                        "display": "inline-block"
                    });
                    $element.find('.video-player-module-wrap').css({
                        "width": mw + "px",
                        //"height": ($element.find(".poin-wrap").height() - $element.find('.botsnap').height()) + "px",
                        "height": mh + "px",
                    });
                    $element.find('.morepic').css({
                        "width": mw-4 + "px",
                        "height": mh-4 + "px",
                    });
                    if (mh + 244 > $element.find(".poin-wrap").height()) {
                        $element.find(".poin-wrap").height(mh + 244);
                        $element.find(".moni-video").height(mh+24);
                        $element.find(".poin-wrap div.moni-video div.contrast").height(mh + 244);
                    }

                    if ($scope.smiling) {
                        $element.find('.morepic').css({
                            "width": mw +34 + "px",
                        });
                        $element.find('.bot-wrap').css({
                            "width": mw + 24 + "px",
                        });
                        $element.find('.video-player-module-wrap').css({
                            "width":mw  + "px",
                        });
                    }else{
                        if ($scope.results) {
                            $element.find('.morepic').css({
                                "width": mw + 34 + "px",
                            });
                            $element.find('.bot-wrap').css({
                                "width": mw + 24 + "px",
                            });
                            $element.find('.video-player-module-wrap').css({
                                "width": mw  + "px",
                            });
                        }
                    }
                    if (!$scope.single && $scope.videoPlayerManager) $scope.videoPlayerManager.resetSize(mw, mh);
                }
                $scope.camerh = mh-4;
                $scope.$broadcast("camerh", $scope.camerh);
                //if (!$scope.single && $scope.videoPlayerManager) $scope.videoPlayerManager.resetSize(mw, mh);
                if (_flag) $timeout(function() {
                    // $scope.onChangeLayout();
                    if ($scope.resize) $scope.resize();
                }, 0, false);
            };
            $scope.$on("sizechange", function(event, data) {
                $scope.sizechange = data;
                resize();
            });
            $scope.$on("variable", function (event, data) {
                $scope.variable = data;
            });
            $scope.$on("noai", function (event, data) {
                $scope.noai = data;
                if (!$scope.noai) {
                    if ($scope.ainum > 0) {
                        if ($scope.variable) {
                            $scope.haveface = [];
                            $scope.noface = [];
                        }
                        $scope.noai = false;
                        $scope.results = true;
                        $scope.emp = false;
                    } else {
                        $scope.results = true;
                        $scope.noai = true;
                    }
                }
            });
            $scope.$on("results", function (event, data) {
                $scope.results = data;
            });
            $scope.$on("eyes", function (event, data) {
                $scope.eyes = data;
            });
            $scope.$on("emp", function (event, data) {
                $scope.emp = data;
            });
            $scope.$on("moreAi", function (event, data) {
                $scope.moreAi = data;
            });
            $scope.onSelectDevice = function(_device) {
                $scope.dis();
                $scope.provideo = false;
                _device.tree = true;
                deviceInfo = _device;
                $scope.devstatus = true;
                $scope.pointface = true;
                $scope.haveface = [];
                $scope.noface = [];
                $scope.dvinfo = _device.deviceid;
                ProfileService.getMyAiCameras({}).then(function(_data) {
                    $scope.deviceObj = "";
                    //console.log(_data);
                    if (_data.list.length<=0) {
                        $scope.results = true;
                        $scope.noai = true;
                    }else{
                        _.each(_data.list, function (_item) {
                            $scope.deviceObj = _item.deviceid + "," + $scope.deviceObj;
                        });
                    }
                    if ($scope.deviceObj.indexOf(_device.deviceid)!=-1) {
                        $scope.isAi = true;
                        $scope.results = false;
                        $scope.smiling = false;
                        $scope.noai = false;
                        ProfileService.getPoJulei({
                            list_type: 'page',
                            face_id: -1,
                            deviceid: _device.deviceid,
                            page: 1,
                            count: 10
                        }).then(function (data) {
                            //console.log(data);
                            $scope.pastData = data.list;
                            if ($scope.pastData.length>0) {
                                if (!$scope.single) {
                                    $scope.pastData.reverse();
                                    _.each($scope.pastData , function (_item) {
                                        checkExist(_item);
                                    });
                                };
                            };
                        });
                        if ($scope.haveface.length > 0) {
                            $scope.emp = false;
                        } else {
                            $scope.emp = true;
                        }
                    }else{
                        $scope.isAi = false;
                        $scope.smiling = true;
                        $scope.results = true;
                        $scope.noai = true;
                    }
                });
                ProfileService.addMyAiCameras({
                    deviceid: _device.deviceid
                }).then(function (_data) {
                    eventId = "ai_statistics";
                    $scope.link();
                });
                bindBaseInfo();
                getCameraInfo();
            };
            //获取摄像机设置信息
            var getCameraInfo = function() {
                $scope.power = (deviceInfo['status'] & 0x4) === 4 ? 1 : 0;
                ProfileService.getDevStatus({
                    deviceid: deviceInfo.deviceid
                }).then(function(_data) {
                    var key, k;
                    if (_data.error_code) {
                        $scope.isShowLoading = true;
                        return;
                    }
                    for (key in $scope.status) {
                        for (k in _data) {
                            if (key === k) {
                                $scope.status[key] = _data[k];
                                b_status[key] = _data[k];
                            }
                        }
                    }
                    $scope.isShowLoading = true;
                });
                ProfileService.getDevCvr({
                    deviceid: deviceInfo.deviceid
                }).then(function(_data) {
                    var key, k;
                    if (_data.error_code) {
                        return;
                    }
                    for (key in $scope.cvr) {
                        if (true) {
                            //do
                        }
                        for (k in _data) {
                            if (key === k) {
                                $scope.cvr[key] = _data[k];
                                b_cvr[key] = _data[k];
                            }
                        }
                    }
                });
                ProfileService.getDevInfo({
                    deviceid: deviceInfo.deviceid
                }).then(function(_data) {
                    if (!_data || _data.error_code) {
                        $scope.info = {};
                        return;
                    }
                    $scope.info = _data;
                    $scope.introduction = _data.intro;
                    $scope.e_introduction = _data.intro;
                });
            };
            //获取摄像机meta信息
            var bindBaseInfo = function() {
                ProfileService.getPlayCamera({
                    deviceid: deviceInfo.deviceid
                }).then(function(_data) {
                    if (_data.error_code) {
                        _data = {
                            list: []
                        };
                    }
                    _data.tree = true;
                    deviceInfo = _data;
                    deviceInfo.isMyCamera = true;
                    initVideo();
                });
            }
            var initVideo = function() {
                var w,ih;
                var livePlay = true;
                var $device_setting_menu;
                var profilePlugins;
                var targetClass;
                if ($scope.videoPlayerManager) $scope.videoPlayerManager.destroy();
                if ($target) {
                    targetClass = $target[0].className.split(" ")[0];
                    $target.empty();
                    $target.removeClass().addClass(targetClass);
                } else {
                    $target = $element.find("div.dvideo1");
                }
                w = $element.find(".video-player-module-wrap").width();
                ih = $element.find(".video-player-module-wrap").height();
                profilePlugins = ["fullscreen", "cloud-config", "volume-control", "size-control", {
                    name: "video",
                    menus: ["video-pause", "video-history-btn", "video-liveplay", "pro-video-live"]
                }, "snapshot"];

                $scope.videoPlayerManager = new VideoPlayer(_.extend({
                    language: "zh-cn",
                    plugins: profilePlugins,
                    // controls: document.location.search.indexOf("nocontrols") === -1,
                    controls: false,
                    width: w,
                    height: ih,
                    container: $target,
                    isPrivate: true,
                    showMenu: true,
                    isProfessional: true
                }));
                $device_setting_menu = $scope.videoPlayerManager.addMenu({
                    title: function(_language) {
                        return languages[_language]["lp13"];
                    },
                    key: "device-setting",
                    d: "right",
                    prev: "fullscreen",
                    clz: "device-setting",
                    i_clz: "pic-device-setting"
                });
                $device_setting_menu.click(function() {
                    if ($scope.isGranted || deviceInfo.status === "0") {
                        return;
                    }
                    $scope.showModalConfig = true;
                    $scope.$apply();
                });
                $scope.videoPlayerManager.bindData(deviceInfo);
                $scope.videoPlayerManager.on("pro-fullscreen", "fullscreen", function(opt) {
                    isFullScreen = opt;
                    $element.find(".video-player-module-wrap")[isFullScreen ? "removeClass" : "addClass"]("menu-professional");
                    if (isFullScreen !== undefined && isFullScreen.height>=$(window).height() && !$element.find('.video-player-module-wrap').hasClass('show-history-list')) {
                        $scope.isScreen = true;
                        screenStatus();
                        // $scope.$apply();
                    } else if (isFullScreen === undefined && !$element.find('.video-player-module-wrap').hasClass('show-history-list')){
                        $scope.isScreen = false;
                        ProfileService.getMyAiCameras({}).then(function(_data) {
                            $scope.deviceObj = "";
                            //console.log(_data);
                            if (_data.list.length<=0) {
                                $scope.results = true;
                                $scope.noai = true;
                            }else{
                                _.each(_data.list, function (_item) {
                                    $scope.deviceObj = _item.deviceid + "," + $scope.deviceObj;
                                });
                            }
                            if ($scope.deviceObj.indexOf($scope.dvinfo)!=-1) {
                                $scope.results = false;
                                $scope.noai = false;
                                if ($scope.haveface.length > 0) {
                                    $scope.emp = false;
                                } else {
                                    $scope.emp = true;
                                }
                            }else{
                                $scope.results = true;
                                $scope.noai = true;
                            }
                        });
                        $scope.$apply();
                    } else if (isFullScreen === undefined && $element.find('.video-player-module-wrap').hasClass('show-history-list')) {
                        $scope.isScreen = false;
                        $scope.results = true;
                        $scope.noai = true;
                        // $element.find('.video-player-module-wrap').removeClass('show-history-list');
                        //$element.find(".pro-video-live a span").text("看直播");
                        $scope.$apply();
                    }
                });
                $scope.videoPlayerManager.on("ab", "play_category_changed", function(_category) {
                    if (_category === currentPlayCategory) return;
                    currentPlayCategory = _category;
                    if (!isFullScreen && (true || _category === "video_play")) {
                        $timeout(function() {
                            resize(true);
                        }, 0, true);
                    }
                })
                $scope.videoPlayerManager.on("ac", "pro-vide-event", function(_flag) {
                    $timeout(function() {
                        resize(true);
                    }, 0, true);
                });
                $scope.provideo = true;
            };
            var removeDuplicatedItem = function (arr) {
                var tmp = {},
                    ret = [];
                for (var i = 0, j = arr.length; i < j; i++) {
                    if (!tmp[arr[i].face.face_id]) {
                        tmp[arr[i].face.face_id] = 1;
                        ret.push(arr[i]);
                    }
                }
                return ret;
            }
            var dataTime = function (m) { return m < 10 ? '0' + m : m };
            var formatDate = function (now) {
                var time = new Date(now);
                var h = time.getHours();
                var mm = time.getMinutes();
                var s = time.getSeconds();
                return dataTime(h) + ':' + dataTime(mm) + ':' + dataTime(s);
            };
            var checkExist = function (_newItem) {
                $scope.noface.unshift(_newItem);
                if (_newItem.face) {
                    $scope.haveface.unshift(_newItem);
                    $scope.haveface = removeDuplicatedItem($scope.haveface);
                }
            }
            var fullcheckface = function (_newItem) {
                $scope.downface.push(_newItem);
                var $el = $element.find(".full-fot");
                $el.bind('DOMNodeInserted', function () {
                    $el.scrollTop($el[0].scrollHeight);
                });
                if (_newItem.face && _newItem.face.name != "") {
                    $scope.putface.unshift(_newItem);
                    $scope.putface = removeDuplicatedItem($scope.putface);
                }
            }
            $scope.$on("camerasList", function (event, data) {
                $scope.camerasList = data;
            });
            $scope.$on("playingCamera", function (event, data) {
                $scope.playingCamera = data;
            });
            var morefullface = function (_newItem) {
                var moreStr, hclass, icla, timer, $facetarget;
                _.each($scope.playingCamera, function (item, index) {
                    if (_newItem.deviceid == item.deviceid) {
                        timer = formatDate(parseInt(_newItem.time*1000));
                        if (_newItem.face) {
                            if (_newItem.face.name != "") {
                                moreStr = _newItem.face.name;
                                hclass = "okh";
                                icla = "iok";
                            } else{
                                moreStr = "ID:" + _newItem.face.face_id;
                                hclass = "haveid";
                                icla = "iques";
                            }
                        }else{
                            moreStr = "陌生人";
                            hclass = "noknow";
                            icla = "imark";
                        }
                        var $botever = "<div class='morebotface'>"+
                            "<div class='lp'>"+
                            "<div class='lppic' style='background-image: url(" + _newItem.image_url + ")'>"+
                            "<i class='" + icla+"'></i>"+
                            "</div>"+
                            "</div >"+
                            "<div class='rp'>"+
                            "<h3 class='" + hclass +"'>" +moreStr+"</h3>"+
                            "<p>"+ timer+"&nbsp;进入视野</p>"+
                            "</div>"+
                            "</div>";
                        var $pubot = $element.find(".pubot" + (index + 1));
                        $pubot.append($botever);
                        $pubot.bind('DOMNodeInserted', function () {
                            $pubot.scrollTop($pubot[0].scrollHeight);
                        });
                    }
                })
                if (_newItem.face && _newItem.face.name != "") {
                    $scope.lotface.push(_newItem);
                    _.each($scope.lotface, function (newdata,facenum) {
                        var $snap = "<div class='moretopface" + newdata.face.face_id+"' style='background-image: url(" + newdata.face.image_url + ")'>" +
                            "</div>";
                        _.each($scope.playingCamera, function (item, index) {
                            if (newdata.deviceid == item.deviceid) {
                                var $putop = $element.find(".putop" + (index + 1));
                                if ($putop.find(".moretopface" + newdata.face.face_id).length == 0){
                                    $putop.prepend($snap);
                                }else{
                                    $putop.find(".moretopface" + newdata.face.face_id).remove();
                                    $putop.prepend($snap);
                                }
                            }
                        })
                    })
                }
            }
            $scope.$on("morescreen", function (event, data) {
                $scope.morescreen = data;
                if (!$scope.morescreen) {
                    $scope.lotface = [];
                }
            });
            var getSocketMessage = function (msg) {
                try {
                    var item = JSON.parse(msg);
                    if (item.event_count <= 0) return;
                    for (var i = 0; i < item.event_count; i++) {
                        if (item.event_list[i].event_type === 0) { //人脸识别消息
                            if ($scope.isScreen && !$scope.single) {
                                fullcheckface(item.event_list[i]);
                                //console.log("单画面全屏");
                            }
                            if ($scope.morescreen && $scope.single) {
                                morefullface(item.event_list[i]);
                                //console.log("多画面全屏");
                            }
                            if ($scope.single) {
                                checkExist(item.event_list[i]);
                            }else{
                                if ($scope.pointface) {
                                    checkExist(item.event_list[i]);
                                }
                            }
                        }
                    }
                    $scope.$apply();
                } catch (err) {
                    console.error(err);
                }
            };
            //推送识别结果
            var socket, socket_token;

            $scope.$on("statis", function(event, data) {
                $scope.dis();
                $scope.statis = data;
                if ($scope.statis) {
                    eventId = "ai_statistics";
                    $scope.link();
                }
            });
            $scope.link = function() {
                if (socket) return;
                ProfileService.getAiToken({}).then(function(_data) {
                    socket = io.connect(_data.server_list[0]);
                    socket_token = _data.token;
                    socket.on('connect', function() {
                        console.log('连接成功');
                        socket.emit('authentication', {
                            token: socket_token
                        });
                        socket.emit("subscribe", {
                            "channel": eventId
                        });
                    });
                    socket.on('message', function(msg) {
                        getSocketMessage(msg);
                        console.log(msg);
                    });

                    socket.on('unsubscribe', function(data) {
                        socket.emit("unsubscribe", {
                            "channel": eventId //68731188216.ai_event
                        });
                        console.log('取消订阅')
                    });
                    socket.on('disconnect', function(data) {
                        console.log('断开连接了');
                        ProfileService.getAiToken({}).then(function(_data) {
                            socket_token = _data.token;
                        })
                    });
                    socket.on('error', function(data) {
                        console.log('连接错误');
                    });
                });
            };
            $scope.dis = function() {
                if (!socket) return;
                socket.emit("unsubscribe", {
                    "channel": eventId
                });
                socket.close();
                socket = null;
            };
            var init = function() {
                if (user) {
                    $scope.user = user;
                } else {
                    OAuth.init();
                    return;
                }
                if(CURRENT_USERINFO.domain='zhy'){
                    $scope.isZhy = true;
                }
                $scope.videoPlayerManager = "";
                $scope.status = {
                    power: -1,
                    audio: -1,
                    light: -1,
                    invert: -1,
                    scene: -1,
                    exposemode: -1,
                    nightmode: -1,
                    maxspeed: 276
                };
                $scope.cvr = {
                    cvr: -1
                };
                $target = $('.video-player-module-wrap');
                $scope.multiType = 1;
                $scope.haveface = [];
                $scope.noface = [];
                $scope.putface = [];
                $scope.downface = [];
                $scope.lotface = [];
                $scope.deviceObj = '';
                $scope.showModalDetail = false;
                $scope.isAi = false;
                $scope.oneConfig = false;
                $scope.single = true;
                $scope.devstatus = false;
                $scope.provideo = false;
                $scope.pointface = false;
                $scope.showOver = true;
                var eventId;
                $timeout(function() {
                    resize();
                }, 0, true);
                bindAiDevice();
                bindEvent();
                bindDevConfig();
            };
            var addeven = function () {
                document.querySelector('.pro-video-live').addEventListener('click', function () {
                    var $provideo = $element.find(".pro-video-live a span").text();
                    // if ($provideo === "看录像") {
                    if (!$element.find(".video-play-menus").hasClass("video_play")) {
                        if ($scope.ainum > 0) {
                            if ($scope.isAi) {
                                $scope.results = false;
                                $scope.smiling = false;
                                $scope.noai = false;
                                if ($scope.haveface.length > 0) {
                                    $scope.emp = false;
                                } else {
                                    $scope.emp = true;
                                }
                            }else{
                                $scope.results = true;
                                $scope.smiling = true;
                                $scope.noai = true;
                            }
                        } else {
                            $scope.smiling = true;
                            $scope.results = true;
                            $scope.noai = true;
                        }
                    } else {
                        $scope.results = true;
                        $scope.smiling = true;
                        $scope.noai = true;
                        resize();
                    };
                });
                document.querySelector('.btn-time-list').addEventListener('click', function () {
                    $timeout(function() {
                        if ($element.find(".video-play-menus").hasClass('show-hour-list')){
                            $element.find(".video-play-menus").removeClass("show-hour-list");
                        } else {
                            $element.find(".video-play-menus").addClass("show-hour-list");
                        }
                    }, 100, true);
                });
            };
            $scope.$watch("provideo", function () {
                if ($scope.provideo) {
                    $timeout(function () {
                        //console.log(document.querySelector('.pro-video-live'));
                        if (document.querySelector('.pro-video-live') == null) {
                            $timeout(function () {
                                addeven();
                            }, 5000, true);
                            return;
                        }else{
                            addeven();
                        };
                    }, 1000, true);
                };
            }, true);
            $scope.$watch("results", function () {
                $scope.$broadcast("results", $scope.results);
                if (!$scope.single) {
                    $timeout(function() {
                        resize();
                    }, 50, true);
                }
            },true);
            $scope.$watch("setMulti",function () {
                $scope.$broadcast("setMulti", $scope.setMulti);
            },true);
            $scope.$watch("onSelectCategorys",function () {
                $scope.$broadcast("onSelectCategorys", $scope.onSelectCategorys);
            },true);
            $scope.$watch("cancelSelectCategorys",function () {
                $scope.$broadcast("cancelSelectCategorys",$scope.cancelSelectCategorys);
            },true);
            $scope.$watch("multiCids",function () {
                $scope.$broadcast("multiCids", $scope.multiCids);
            },true);
            $scope.$watch("multiType",function () {
                $scope.$broadcast("multiType", $scope.multiType);
            },true);
            $scope.$watch("getCamerasByCids",function () {
                $scope.$broadcast("getCamerasByCids",$scope.getCamerasByCids);
            },true);
            $scope.$watch("videosList",function () {
                $scope.$broadcast("videosList",$scope.videosList);
            },true);
            $scope.$watch("categorysBindData",function () {
                $scope.$broadcast("categorysBindData", $scope.categorysBindData);
            },true);
            init();
        }
    ]);
});