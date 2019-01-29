define(["app", "ui_videoplayer"], function(Directives, VideoPlayer) {
  Directives.directive("cameraMultiView", [function() {
    return {
      template: CURRENT_PROJECT_DIRECTIVES["d-camera-multiview"],
      restrict: "AE",
      replace: true,
      transclude: true,
      scope: {
        // rows: '=',
        // cols: '=',
        editType: '=',
        multiType: '=',
        // count: '=',
        checkedElem: '=',
        onChangeLayout: '=',
        setMulti: '=',
        isInit: '=',
        camerasList: "=",
        currentPlayingVideos: "=?",
        wheelTime: "=",
        isFullscreen: "=",
        resize: "=",
        okpush: "=",
        playingCamera:"=",
      },
      link: function($scope, $elem) {
        var cols, rows, pageSize, tmpCameras, timeTrigger;
        $scope.playingCamera = [];
        var resizeTm = null;
        // $scope.currentCameraId = 2;
        var fullNum = 0;
        var bindData = function() {

        };

        $(window).resize(function() {
          if ($scope.isFullscreen) fullNum++;
          if (fullNum === 2) {
            fullNum = 0;
            return;
          }
          if (resizeTm) clearTimeout(resizeTm);
          resizeTm = setTimeout(function () {
            $scope.resize();
          }, 500);
        });

        // var bindEvent = function() {
        //   $scope.onSelectVideo = function() {
        //     $scope.currentCameraId = 2;
        //     alert("有效");
        //   }
        // };

        $scope.resize = function() {
          // var h = $scope.showType === "all" ? $elem.find(".status-wrap").outerHeight() : $elem.find(".category-edit-wrap").outerHeight();
          // $elem.find(".list-wrap").height($elem.height() - h - $elem.find(".btn-group").outerHeight() - $elem.find(".camera-search-wrap").outerHeight());
          // $elem.width($("body").width() - $(".left-nav").width() - $(".screenRatio").width())
         $scope.onChangeLayout(!$scope.setMulti, true);
        };

        $scope.onChangeLayout = function(_flag, _noLoad) {
          //console.log('33333');
          var playerH, playerW, tml = 0,
            tmt = 0;

          var str = "";
          var n = 0;
          var tb;

          _.each($scope.currentPlayingVideos, function(_vm) {
            _vm.destroy();
          });
          $elem.empty();

          if (_.contains(["s1", "s2", "s3", "s4", "s5", "s6"], $scope.multiType)) {
            var c = Number($scope.multiType.replace("s", ""));
            if (c === 5) return;
            tb = {
              'rows': c,
              'cols': c
            };
          } else if ($scope.multiType === 's7') {
            tb = {
              'rows': 3,
              'cols': 3,
              'coords': [{
                'coord': [1, 1],
                'rowspan': 2,
                'colspan': 2
              }]
            };
          } else if ($scope.multiType === 's8') {
            tb = {
              'rows': 4,
              'cols': 4,
              'coords': [{
                'coord': [1, 1],
                'rowspan': 2,
                'colspan': 2
              }, {
                'coord': [1, 3],
                'rowspan': 2,
                'colspan': 2
              }]
            };
          } else if ($scope.multiType === 's9') {
            tb = {
              'rows': 4,
              'cols': 4,
              'coords': [{
                'coord': [3, 1],
                'rowspan': 2,
                'colspan': 2
              }, {
                'coord': [3, 3],
                'rowspan': 2,
                'colspan': 2
              }]
            };
          } else if ($scope.multiType === 's10') {
            tb = {
              'rows': 4,
              'cols': 4,
              'coords': [{
                'coord': [2, 2],
                'rowspan': 2,
                'colspan': 2
              }]
            };
          } else if ($scope.multiType === 's11') {
            tb = {
              'rows': 4,
              'cols': 4,
              'coords': [{
                'coord': [1, 1],
                'rowspan': 2,
                'colspan': 2
              }]
            };
          } else if ($scope.multiType === 's12') {
            tb = {
              'rows': 4,
              'cols': 4,
              'coords': [{
                'coord': [1, 3],
                'rowspan': 2,
                'colspan': 2
              }]
            };
          } else if ($scope.multiType === 's13') {
            tb = {
              'rows': 6,
              'cols': 6,
              'coords': [{
                'coord': [3, 3],
                'rowspan': 2,
                'colspan': 2
              }]
            };
          } else {
            tb = $scope.multiType;
          }
          playerH = $elem.height() - tb.rows - 1;
          playerW = $elem.width() - tb.cols - 1;

          // if (!$scope.setMulti) {
          if (playerW * 9 / 16 > playerH) {
            videoWidth = playerH / tb.rows * 16 / 9;
            videoHeight = playerH / tb.rows;
            tml = (playerW - playerH * 16 / 9) / 2;
          } else {
            videoWidth = playerW / tb.cols;
            videoHeight = playerW / tb.cols * 9 / 16;
            tmt = (playerH - playerW * 9 / 16) / 2;
          }
          // } else {
          // videoHeight = (playerH - tb.rows - 1) / tb.rows;
          // videoWidth = (playerW - tb.cols - 1) / tb.cols;
          // }

          $("tr").css("height", videoHeight + "px");
          $("td").css("width", videoWidth + "px");

          str = "<table style='margin-left:" + tml + "px;margin-top:" + ( $scope.setMulti ? "30" : tmt) + "px;'>";

          for (var j = 1; j <= tb.rows; j++) {
            str += "<tr>";
            for (var k = 1; k <= tb.cols; k++) {
              var vh, vw, vwm;
              var nvh, nvw, vwlm, vwtm;
              if (tb.coords) {
                var isSpan = false,
                  isContinue = false;
                var c, r;
                var maxc, maxr;

                _.each(tb.coords, function(item, $index) {
                  if (j === item.coord[0] && k === item.coord[1]) {
                    isSpan = true;
                    c = item.colspan;
                    r = item.rowspan;
                    maxr = j + r - 2;
                    maxc = k + c - 2;;
                    return false;
                  } else if (j >= item.coord[0] && j < (item.coord[0] + item.rowspan) && k >= item.coord[1] && (k < item.coord[1] + item.colspan)) {
                    isContinue = true;
                    return false;
                  }
                })
                if (isSpan) {
                  n++;
                  vh = videoHeight * r;
                  vw = videoWidth * c;

                  if (vw * 9 / 16 > vh) {
                    nvw = vh * 16 / 9;
                    nvh = vh;
                    vwlm = (vw - nvw) / 2;
                    vwtm = 0;
                  } else {
                    nvw = vw;
                    nvh = vw * 9 / 16;
                    vwlm = 0;
                    vwtm = (vh - nvh) / 2;
                  }

                  str += "<td p='" + j + "," + k + "," + r + "," + c + "'  _p='" + j + "," + k + "," + maxr + "," + maxc + "' colspan = '" + c + "' rowspan = '" + r + "' style = 'width:" + videoWidth * c + "px;height:" + videoHeight * r + "px' ><div ng-click = 'getItem(this)' ondrop='angular.element(this).scope().drop(event,this)' ondragover='angular.element(this).scope().allowDrop(event)' draggable='true' ondragstart='angular.element(this).scope().drag(event,this)' class = 'dvideo" + n + "' style = 'width:" + nvw + "px;height:" + nvh + "px;" + "margin-left:" + vwlm + "px;" + "margin-top:" + vwtm + "px;" + "'></div></td>";
                } else if (isContinue) {
                  continue;
                } else {
                  n++;
                  vw = videoWidth;
                  vh = videoHeight;
                  if (vw * 9 / 16 > vh) {
                    nvw = vh * 16 / 9;
                    nvh = vh;
                    vwlm = (vw - nvw) / 2;
                    vwtm = 0;
                  } else {
                    nvw = vw;
                    nvh = vw * 9 / 16;
                    vwlm = 0;
                    vwtm = (vh - nvh) / 2;
                  }

                  str += "<td _p='" + j + "," + k + "' style = 'width:" + videoWidth + "px;height:" + videoHeight + "px' ><div ng-click = 'getItem(this)' ondrop='angular.element(this).scope().drop(event,this)' ondragover='angular.element(this).scope().allowDrop(event)' draggable='true' ondragstart='angular.element(this).scope().drag(event,this)' class = 'dvideo" + n + "' style = 'width:" + nvw + "px;height:" + nvh + "px;" + "margin-left:" + vwlm + "px;" + "margin-top:" + vwtm + "px;" + "'></div></td>";
                }
              } else {
                n++;

                vw = videoWidth;
                vh = videoHeight;

                if (vw * 9 / 16 > vh) {
                  nvw = vh * 16 / 9;
                  nvh = vh;
                  vwlm = (vw - nvw) / 2;
                  vwtm = 0;
                } else {
                  nvw = vw;
                  nvh = vw * 9 / 16;
                  vwlm = 0;
                  vwtm = (vh - nvh) / 2;
                }
                str += "<td _p='" + j + "," + k + "' style = 'width:" + videoWidth + "px;height:" + videoHeight + "px' ><div ng-click = 'getItem(this)' ondrop='angular.element(this).scope().drop(event,this)' ondragover='angular.element(this).scope().allowDrop(event)' draggable='true' ondragstart='angular.element(this).scope().drag(event,this)' class = 'dvideo" + n + "' style = 'width:" + nvw + "px;height:" + nvh + "px;" + "margin-left:" + vwlm + "px;" + "margin-top:" + vwtm + "px;" + "'></div></td>";
              }
            }
            str += '</tr>';
          }

          str += "</table>";

          pageSize = n;

          $elem.append(str);
          // if (Math.floor($elem.width()) === $elem.find("table").width()) {
          //   $elem.height($elem.find("table").height());
          // }
          $elem.find("div[class^='dvideo']").click(function(e) {
            if (!$scope.checkedElem || $scope.setMulti) return;
            var $target = $(this);
            if ($target.is('.checked')) {
              $target.removeClass('checked');
              $target = $elem.find("div[class='dvideo1']");
            } else {
              $elem.find("div[class^='dvideo']").removeClass('checked');
              $target.addClass('checked');
              $scope.checkedElem($target);
            }
          })

          if (_flag) {
            loadCameras(_noLoad);
          }

          // //需要的样式
          // document.write('<style>.cannotselect{-moz-user-select:none;-webkit-user-select:none;-ms-user-select:none;-khtml-user-select:none;user-select:none;}td.selected{background:#0094ff;color:#fff}</style>');
          //jQuery表格单元格合并插件，功能和excel单元格合并功能一样，并且可以保留合并后的所有单元格内容到第一个单元格中
          // $.fn.tableMergeCells = function() {
          //   return this.each(function() {
          //     var tb = $(this),
          //       startTD, endTD, MMRC = {
          //         startRowIndex: -1,
          //         endRowIndex: -1,
          //         startCellIndex: -1,
          //         endCellIndex: -1
          //       };
          //     //初始化所有单元格的行列下标内容并存储到dom对象中
          //     // tb.find('tr').each(function(r) {
          //     //   $('td', this).each(function(c) {
          //     //     $(this).data('rc', _.extend({
          //     //       r: r,
          //     //       c: c
          //     //     }, $(this).attr('colspan') ? {
          //     //       maxc: Number($(this).attr('colspan')) - 1,
          //     //       maxr: Number($(this).attr('rowspan')) - 1,
          //     //     } : {}));
          //     //   })
          //     // });
          //     tb.find('tr').each(function(r) {
          //       $('td', this).each(function(c) {
          //         var p = $(this).attr("_p").split(",");
          //         $(this).data('rc', _.extend({
          //           r: p[0] - 1,
          //           c: p[1] - 1
          //         }, $(this).attr('colspan') ? {
          //           maxr: Number(p[2]),
          //           maxc: Number(p[3])
          //         } : {}));
          //       })
          //     });
          //     //添加表格禁止选择样式和事件
          //     tb.addClass('cannotselect').bind('selectstart', function() {
          //       return false
          //     });
          //     //选中单元格处理函数
          //     function addSelectedClass() {
          //       var selected = false,
          //         rc, t;
          //       tb.find('td').each(function() {
          //         rc = $(this).data('rc');
          //         //判断单元格左上坐标是否在鼠标按下和移动到的单元格行列区间内
          //         selected = rc.r >= MMRC.startRowIndex && rc.r <= MMRC.endRowIndex && rc.c >= MMRC.startCellIndex && rc.c <= MMRC.endCellIndex;
          //         if (!selected && rc.maxc) { //合并过的单元格，判断另外3（左下，右上，右下）个角的行列是否在区域内             
          //           selected =
          //             (rc.maxr >= MMRC.startRowIndex && rc.maxr <= MMRC.endRowIndex && rc.c >= MMRC.startCellIndex && rc.c <= MMRC.endCellIndex) || //左下
          //             (rc.r >= MMRC.startRowIndex && rc.r <= MMRC.endRowIndex && rc.maxc >= MMRC.startCellIndex && rc.maxc <= MMRC.endCellIndex) || //右上
          //             (rc.maxr >= MMRC.startRowIndex && rc.maxr <= MMRC.endRowIndex && rc.maxc >= MMRC.startCellIndex && rc.maxc <= MMRC.endCellIndex); //右下
          //         }
          //         if (selected) this.className = 'selected';
          //       });
          //       var rangeChange = false;
          //       tb.find('td.selected').each(function() { //从已选中单元格中更新行列的开始结束下标
          //         // alert($(this).width());
          //         rc = $(this).data('rc');
          //         t = MMRC.startRowIndex;
          //         MMRC.startRowIndex = Math.min(MMRC.startRowIndex, rc.r);
          //         rangeChange = rangeChange || MMRC.startRowIndex != t;

          //         t = MMRC.endRowIndex;
          //         MMRC.endRowIndex = Math.max(MMRC.endRowIndex, rc.maxr || rc.r);
          //         rangeChange = rangeChange || MMRC.endRowIndex != t;

          //         t = MMRC.startCellIndex;
          //         MMRC.startCellIndex = Math.min(MMRC.startCellIndex, rc.c);
          //         rangeChange = rangeChange || MMRC.startCellIndex != t;

          //         t = MMRC.endCellIndex;
          //         MMRC.endCellIndex = Math.max(MMRC.endCellIndex, rc.maxc || rc.c);
          //         rangeChange = rangeChange || MMRC.endCellIndex != t;
          //       });
          //       //注意这里如果用代码选中过合并的单元格需要重新执行选中操作
          //       if (rangeChange) addSelectedClass();
          //     }

          //     function onMousemove(e) { //鼠标在表格单元格内移动事件
          //       e = e || window.event;
          //       var o = e.srcElement || e.target.parentElement;
          //       if (o.tagName == 'TD') {
          //         endTD = o;
          //         var sRC = $(startTD).data('rc'),
          //           eRC = $(endTD).data('rc'),
          //           rc;
          //         if ((_.contains(["s6", "s7", "s8"], $scope.multiType) || !$scope.setMulti) && startTD != endTD) {
          //           AppLog.error("列表不支持合并！", 1);
          //           return;
          //         }
          //         MMRC.startRowIndex = Math.min(sRC.r, eRC.r);
          //         MMRC.startCellIndex = Math.min(sRC.c, eRC.c);
          //         MMRC.endRowIndex = Math.max(sRC.r, eRC.r);
          //         MMRC.endCellIndex = Math.max(sRC.c, eRC.c);
          //         tb.find('td').removeClass('selected');
          //         addSelectedClass();
          //       }
          //     }

          //     function onMouseup(e) { //鼠标弹起事件
          //       tb.unbind({
          //         mouseup: onMouseup,
          //         mousemove: onMousemove
          //       });
          //       if (startTD && endTD && startTD != endTD) { //开始结束td不相同确认合并
          //         var tds = tb.find('td.selected'),
          //           firstTD = tds.eq(0),
          //           index = -1,
          //           t, addBR, tdw = 0,
          //           tdh = 0,
          //           html = tds.filter(':gt(0)').map(function() {
          //             t = this.parentNode.rowIndex;
          //             addBR = index != -1 && index != t;
          //             index = t;
          //             return (addBR ? '<br>' : '') + this.innerHTML
          //           }).get().join(',');
          //         tds.filter(':gt(0)').remove();
          //         // firstTD.append(',' + html.replace(/，(<br>)/g, '$1'));

          //         //更新合并的第一个单元格的缓存rc数据为所跨列和行
          //         var cs = MMRC.endCellIndex - MMRC.startCellIndex + 1;
          //         var rs = MMRC.endRowIndex - MMRC.startRowIndex + 1;
          //         var rc = firstTD.attr({
          //           colspan: cs,
          //           rowspan: rs,
          //           p: (MMRC.startRowIndex + 1) + ',' + (MMRC.startCellIndex + 1) + ',' + rs + ',' + cs
          //         }).data('rc');
          //         rc.maxc = rc.c + MMRC.endCellIndex - MMRC.startCellIndex;
          //         rc.maxr = rc.r + MMRC.endRowIndex - MMRC.startRowIndex;

          //         firstTD.css({
          //           width: videoWidth * (MMRC.endCellIndex - MMRC.startCellIndex + 1) + 'px',
          //           height: videoHeight * (MMRC.endRowIndex - MMRC.startRowIndex + 1) + 'px'
          //         })
          //         firstTD.data('rc', rc);
          //         console.info(rc);
          //       }
          //       tb.find('td').removeClass('selected');
          //       startTD = endTD = null;
          //     }

          //     function onMousedown(e) {
          //       var o = e.target.parentElement;
          //       if (o.tagName == 'TD') {
          //         startTD = o;
          //         tb.bind({
          //           mouseup: onMouseup,
          //           mousemove: onMousemove
          //         });
          //       }
          //     }
          //     tb.mousedown(onMousedown);
          //   });
          // };

          // if($scope.setMulti) $elem.find('table').tableMergeCells();

          // $elem.find('.tprev span').click(function() {
          //   alert(11111);
          // });
        };
        var flashstatus = function (){
          var flag = false;
          if(window.ActiveXObject){
            try{
              var swf = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
              if(swf){
                flag = true;
              }
            }catch(e){
            }
          }else{
            try{
              var swf = navigator.plugins['Shockwave Flash'];
              if(swf){
                flag = true;
              }
            }catch(e){
            }
          }
          if(flag){
            console.log("running ok");
            $scope.flStatus = true;
          }else{
            console.log("running error");
            $scope.flStatus = false;
          }
        };
        var loadCameras = function(_noLoad) {
          $scope.currentPlayingVideos = [];
          var playingNum = 0;
          flashstatus();
          _.each(getPlayCameras(_noLoad), function(_camera, $index) {
            $wrap = $elem.find("div[class='dvideo" + ($index + 1) + "']");
            var warpw = $wrap.width();
            var warph = $wrap.height();

            var videoPlayerManager = new VideoPlayer({
              language: CURRENT_PROJECT_LANGUAGE,
              plugins: [],
              width: warpw,
              height: warph,
              isPrivate: true,
              yuntaiType: 1,
              container: $wrap,
              showDesc: true,
              IsMuted: true,
              showMenu: false,
              controls: false,
              isProfessional: true,
              isMuted:true
            });
            videoPlayerManager.bindData(_camera);
            $scope.currentPlayingVideos.push(videoPlayerManager);
            if ($scope.flStatus == true) {
              var $lis = $('<div style="width:' + warpw + 'px;height:' + warph + 'px;background-color:rgba(0,0,0,0);position:absolute;top:0;left:0;z-index:999;"></div>');
              $lis.appendTo($wrap);
              if ($scope.isFullscreen) {
                $scope.okpush = true;
              }else{
                $scope.okpush = false;
              }
            };
            if ($scope.camerasList.length > pageSize) {
              if (Number(_camera.status) === 0 || (_camera.status & 0x4) === 0) {
                playingNum++;
                if (playingNum === pageSize && $scope.wheelTime) {
                  playingNum = 0;
                  timingTask();
                }
              }
              videoPlayerManager.on("aa", "play-state-changed", function(_state) {
                if (_state === "playing") {
                  playingNum++;
                  if (playingNum === pageSize && $scope.wheelTime) {
                    playingNum = 0;
                    timingTask();
                  }
                }

              });
            }

          })

        }

        var getPlayCameras = function(_noLoad) {
          var waitPlayCameras = [];
          if (_noLoad) return $scope.playingCamera;
          if (tmpCameras.length === 0 || $scope.setMulti) return;
          if (tmpCameras.length <= pageSize && $scope.camerasList.length > pageSize) {
            tmpCameras = tmpCameras.concat($scope.camerasList);
          }
          waitPlayCameras = tmpCameras.slice(0, pageSize);
          tmpCameras.splice(0, pageSize);
          $scope.playingCamera = waitPlayCameras;
          return waitPlayCameras;
        }

        var timingTask = function() {
          clearTimeout(timeTrigger);
          timeTrigger = setTimeout(function() {
            $scope.onChangeLayout(true);
          }, $scope.wheelTime * 1000);
        };
        
        var dd = function() {
          var getSrc;
          $scope.allowDrop = function(ev){
            ev.preventDefault();
          }
          var firstsrcdiv = [],secondsrcdiv = [], choseInner;
          var firstChoseId, secondChoseId;
          $scope.drag = function(ev,divdom)
          { 
            getSrc = divdom;
            firstsrcdiv = divdom.classList.value.split(" ");
            for (var i=0; i< firstsrcdiv.length; i++) {
              if (firstsrcdiv[i].indexOf('dvideo') > -1) {
                firstChoseId = parseInt(firstsrcdiv[0].substring(6,firstsrcdiv[0].length))-1;
                return;
              }
            }
          }
          $scope.drop = function(ev,divdom){
            ev.preventDefault();
            secondsrcdiv = divdom.classList.value.split(" ");
            for (var i=0; i < secondsrcdiv.length; i++) {
              if (secondsrcdiv[i].indexOf('dvideo') > -1) {
                secondChoseId = parseInt(secondsrcdiv[0].substring(6,secondsrcdiv[0].length))-1;
              }
            }
            if (getSrc != divdom) {
              choseInner = $scope.camerasList[secondChoseId];
              $scope.camerasList[secondChoseId] = $scope.camerasList[firstChoseId];
              $scope.camerasList[firstChoseId] = choseInner;
              tmpCameras = _.clone($scope.camerasList);
              $scope.onChangeLayout(true);
            } else {
              return;
            }
          }
        }
        $scope.$watch("multiType", function(_v, _ov) {
          if (_v !== _ov && !$scope.isInit) {
            $scope.onChangeLayout(!$scope.setMulti);
          } 
        });
        $scope.$watch("camerasList", function(_v, _ov) {
          if (_v !== _ov) {
            $scope.isInit = false;
            tmpCameras = _.clone($scope.camerasList);
            $scope.onChangeLayout(true);
          }
        });
        $scope.$watch("editType", function(_v, _ov) {
          if (_v === true) {
            dd();
          }
        })
      }
    };
  }]);
});