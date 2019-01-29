define(["app", "Echarts", "Echarts_line", "s_layoutmanager", "zbase"], function(Directives, echarts) {
  Directives.directive("line", ["LayoutManager", function(LayoutManager) {
    return {
      scope: {
        id: "@",
        item: "=",
        data: "=",
        bulkData: "=",
        type: "=",
        intervaltype: "=",
        reportLoad:"="
      },
      restrict: 'E',
      template: '<div class = "line" style="height:400px;"></div>',
      replace: true,
      link: function($scope, element, attrs, controller) {
        var myChart = echarts.init(document.getElementById($scope.id));
        var init = function() {
          var option = {
            legend: {
              itemWidth: 5,
              itemHeight: 15,
              data: [{
                name: '进店顾客',
                icon: 'image://../../../../public/images/analysis/aicam01.png'
              }, {
                name: '出店顾客',
                icon: 'image://../../../../public/images/analysis/aicam02.png'
              }]
            },
            // 横轴坐标轴  
            xAxis: [{
              type: 'time',
              nameTextStyle: {
                fontSize: 18,
                color: "#999"
              },
              axisLine: {
                lineStyle: {
                  color: '#999'
                }
              },
              splitLine: {
                show: false
              },
              boundaryGap: false,
              data: [] //$scope.item
            }],
            // 纵轴坐标轴  
            yAxis: [{
              // max: function (value) {
              //   return value.max + 5;
              // },
              minInterval: 1,
              type: 'value',
              nameTextStyle: {
                color: '#999'
              },
              axisLine: {
                lineStyle: {
                  color: '#999'
                }
              },
            }],
            calculable: true,
            // 数据内容数组  
            series: [{
              name: '进店顾客',
              type: 'line',
              smooth: true,
              symbol: 'emptyCircle', //是否显示标示
              lineStyle: {
                normal: {
                  color: "rgba(255,255,255,0)",
                }
              },
              itemStyle: {
                normal: {
                  color: "#1cc0ff",
                  areaStyle: {
                    type: 'default',
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: '#09e68b'
                    }, {
                      offset: 1,
                      color: '#1cc0ff'
                    }])
                  }
                }
              },
              data: [] //$scope.data[0]
            }, {
              name: '出店顾客',
              type: 'line',
              smooth: true,
              // symbol: 'none',
              lineStyle: {
                normal: {
                  color: "rgba(255,255,255,0)"
                }
              },
              itemStyle: {
                normal: {
                  color: "#ffc12b",
                  areaStyle: {
                    type: 'default',
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: '#ff802b'
                    }, {
                      offset: 1,
                      color: '#ffc12b'
                    }])
                  }
                }
              },
              data: [] //$scope.data[1]
            }]
            // ,
            // dataZoom: {
            //   id: 'dataZoomX',
            //   type: 'slider',
            //   xAxisIndex: [0],
            //   start: 0,
            //   end: 100
            // },
          };
          myChart.setOption(option);
          window.onresize = myChart.resize;
        }
        var flag = false;
        $scope.$watch("reportLoad",function(_v,_ov){
          if (_v !== _ov) {
            if($scope.reportLoad){
              myChart.showLoading({
                text : '数据获取中',
                effect: 'whirling'
              });
            }else{
              myChart.hideLoading();
              $scope.reportLoad = false;
            }
            
          }
        })
        $scope.$watch('data', function(_v, _ov) {
          if (_v !== _ov) {
            if($scope.data[0].length === 0 && $scope.data[1].length === 0)return;
            
            myChart.setOption({
              tooltip: {
                trigger: 'axis',
                formatter: function(params) {
                  if (!params) return;
                  var res = ($scope.type === 0 ? IX.Date.formatTime(params[0].data[0]).substring(0, 5) : IX.Date.formatDate(params[0].data[0])) + '<br/>';
                  if (params.length > 1) {
                    res += "进店顾客:" + params[0].data[1] + '<br/>';
                    res += "出店顾客:" + params[1].data[1] + '<br/>';
                  } else {
                    if (params[0].seriesIndex === 0) {
                      res += "进店顾客:" + params[0].data[1] + '<br/>';
                    } else {
                      res += "离店顾客:" + params[0].data[1] + '<br/>';
                    }
                  }

                  return res;
                }
              },
              xAxis: [{
                min: new Date($scope.item[0]),
                max: new Date($scope.item[$scope.item.length - 1]),
                interval: $scope.intervaltype === 1 ? ($scope.type === 2 ? 3 * 3600 * 24 * 1000 : ($scope.type === 1 ? 3600 * 24 * 1000 : 3600 * 1000)):($scope.intervaltype * 3600 * 1000),
                axisLabel: {
                  formatter: function(value, index) {
                    var date = new Date(value);
                    return $scope.type === 0 ? IX.Date.formatTime(date).substring(0, 5) : IX.Date.formatDate(date);
                  }
                }
              }],

              series: [{
                data: $scope.data[0]
              }, {
                data: $scope.data[1]
              }]
            });
          }
        });

        $scope.$watch('bulkData', function(_v, _ov) {
          if (_v !== _ov) {
            if(!$scope.bulkData.time) return;
            $scope.data[0].push([new Date($scope.bulkData.time * 1000), $scope.bulkData.in_sum]);
            $scope.data[1].push([new Date($scope.bulkData.time * 1000), $scope.bulkData.out_sum]);
            // $scope.item.push(new Date($scope.bulkData.time * 1000));
            // myChart.showLoading({
            //     text : '数据获取中',
            //     effect: 'whirling'
            // });
            myChart.setOption({
              xAxis: [{
                min: new Date($scope.item[0]),
                max: new Date($scope.bulkData.time * 1000)
              }],
              series: [{
                data: $scope.data[0]
              }, {
                data: $scope.data[1]
              }]
            });
            // myChart.hideLoading();
          }
        });

        // setInterval(function() {
        //   // $scope.data[0][$scope.data[0].length - 1] = $scope.data[0][$scope.data[0].length - 1]+10;
        //   // $scope.data[1][$scope.data[1].length - 1] = $scope.data[1][$scope.data[1].length - 1]+10;
        //   myChart.setOption({
        //     series: [{
        //       data: $scope.data[0]
        //     }, {
        //       data: $scope.data[1]
        //     }]
        //   });
        // }, 500);

        init();
      }
    };
  }]);
});