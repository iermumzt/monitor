define(["app", "oauth", "d_modal", "Echarts", "Echarts_line","ui_dateRange", "s_profile", "s_profess", "d_data_left_nav",], function(Controllers, OAuth, Dialog, echarts) {
  Controllers.controller("DataStatisticsController", ["$scope", "$element", "$timeout", "ProfileService","ProfessService",
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
});