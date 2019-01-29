define(["app", "oauth", "ui_videoplayer", "ui_webuploader", "IX", "d_modal", "d_draggable", "s_profile", "d_camera_tree_list"], function(Controllers, OAuth, VideoPlayer, WebUploader) {
  Controllers.controller("GisMapController", ["$scope", "$element", "ProfileService", "$timeout",
    function($scope, $element, ProfileService, $timeout) {
      var user = OAuth.getUser();
      $scope.isIpad = IX.browser.versions.mobile;
      if ($scope.isIpad) $("body").addClass("ipad");
      var bindEvent = function() {
        $scope.$on("showAddMark", function(event, data) {
          if ($scope.showAddMark === data) return;
          $scope.showAddMark = data;
          // $scope.$broadcast("showAddMark", $scope.showAddMark);
          $timeout(function() {
            resize();
          }, 0, false);
        });

        $scope.$on("currentMarker", function(e, _currentMarker) {
          if ($scope.showBuildingManage) return;
          $scope.showBuildingManage = true;
          $scope.$apply();
          $scope.$broadcast("currentMarker", _currentMarker);
          $timeout(function() {
            resize();
          }, 100);
        });
        $scope.$on("currentBuildMarker", function(e, _currentBuildMarker) {
          if (!$scope.showBuildingManage) return;
          $scope.showBuildingManage = false;
          $scope.$broadcast("currentBuildMarker", _currentBuildMarker);
          $timeout(function() {
            resize();
          }, 100);
        })

        $scope.$on("isFullscreen", function(e, _isFull) {
          if ($scope.isFullscreen === _isFull) return;
          $scope.isFullscreen = _isFull;
          // $scope.$broadcast("currentMarker", _currentMarker);
        });

        $scope.onSelectDevice = function(_device) {
          $scope.$broadcast("onSelectDevice", _device);
        };

        $(window).resize(function() {
          resize();
        });
      };

      var resize = function(_flag) {
        $element.height($("body").height() - $("body>nav").height());
        $element.find("#mapContainer").height($element.height() - $element.find(".top-menus.map").height() - $element.find(".foot-menus.map").height());
        $element.find("ul.floorImgs").css("max-height", $element.find(".sr").height() - 2 * $element.find(".floorImgUp").outerHeight() - $element.find(".foot-menus-build").outerHeight());
        // $element.find(".sl>.wrap").css("height", $element.find(".sl").height());
      };

      var init = function() {
        $scope.currentMenu = 8;
        $scope.showBuildingManage = false;
        $scope.isLoadedBMarkers = false;
        $scope.showAddMark = false;
        $scope.enableRudder = false;
        $scope.isLoadedMarkers = false;
        $scope.setMap = true;
        $scope.isSave = false;

        if (user) {
          $scope.user = user;
        } else {
          OAuth.init();
          return;
        }
        resize();
        bindEvent();
      };

      init();
    }
  ]);
  Controllers.controller("GisController", ["$scope", "$element", "ProfileService",
    function($scope, $element, ProfileService) {
      var markers = [];
      var map, infoWindow, geocoder, cluster;
      var markerLnglat, markerAddr; //currentDeviceId = "137893896363";
      $scope.isbuildAdding = false;
      var currentMarker, currentEditMarker, preMarker, beforeEditMarker, beforeEditIcon, currentLnglat;
      var videoPlayerManager;
      var updateMapDataList = [];
      var delMapDeviceIds = [];
      var addMapdeviceIds = [];
      var treeMarker;
      var isPan = false,
        isTreeMove = false;
      isZoom = false;
      var c_closed = false;

      var bindEvent = function() {
        $scope.$on("draggable:start", function(e, _data) {
          $scope.currentDragingDevice = _data.data;
          $scope.$apply();
        });
        $scope.$on("draggable:end", function(e, _data) {
          $scope.changeDraggingIcon(false);
        });
        $scope.$on("currentBuildMarker", function(e, _currentMarker) {
          currentMarker = _currentMarker;
          $scope.$emit("showAddMark", $scope.editable);
          infoWindow.setContent(createInfoWindow(currentMarker));
          infoWindow.open(map, currentMarker.getPosition());
        });

        $scope.$on("onSelectDevice", function(e, _camera) {
          if (currentMarker && _camera.deviceid === currentMarker.getExtData().marker.deviceid || !_camera.isMarked) return;
          for (var i = markers.length - 1; i >= 0; i--) {
            if (markers[i].getExtData().marker.preview) {
              var preview = markers[i].getExtData().marker.preview;
              for (var j = preview.length - 1; j >= 0; j--) {
                var devs = preview[j].device;
                for (var k = devs.length - 1; k >= 0; k--) {
                  devs[k].deviceid === _camera.deviceid;
                  changeMarkerStatus(markers[i], true);
                  break;
                };
              };
            }
            if (markers[i].getExtData().marker.deviceid === _camera.deviceid) {
              changeMarkerStatus(markers[i], true);
              break;
            }
          }
        });

        AMap.event.addListener(map, 'zoomstart', function(MouseEvent) {
          // if(currentMarker) map.setZoomAndCenter(currentMarker.getPosition());
          isZoom = true;
          closeInfoWindow();
        });
        AMap.event.addListener(map, 'zoomend', function(MouseEvent) {
          // closeInfoWindow();
          isZoom = false;
          // if(currentMarker) map.setCenter(currentMarker.getPosition());

          if (currentMarker && !c_closed) {
            // infoWindow.setContent(createCameraWindow(currentMarker));
            infoWindow.open(map, currentMarker.getPosition());
          }
        });
        AMap.event.addListener(map, 'moveend', function(MouseEvent) {
          if (isZoom) return;
          if (isTreeMove) {
            isTreeMove = false;
            isPan = true;
          };
          if (currentMarker && !c_closed) {
            infoWindow.setContent((currentMarker.getExtData().isbuildAdding || currentMarker.getExtData().marker.bid) ? createInfoWindow(currentMarker) : createCameraWindow(currentMarker));
            infoWindow.open(map, currentMarker.getPosition());
          }
          // if ($scope.editable && currentEditMarker && $scope.isIpad) {
          //   currentEditMarker.setPosition(map.getCenter());
          // }
          if ($scope.editable && currentMarker && $scope.isIpad) {
            // infoWindow.setContent(currentEditMarker.getExtData().isbuildAdding ? createInfoWindow(currentEditMarker) : createCameraWindow(currentEditMarker));
            // infoWindow.open(map, currentEditMarker.getPosition());
            // map.setZoomAndCenter(14, currentEditMarker.getPosition());
            // isPan = false;

            var markerLnglat = currentMarker.getPosition();
            console.info(markerLnglat);
            // var isBuild;
            // if (currentMarker.getExtData().marker.bid) {
            //   isBuild = true;
            // } else {
            //   isBuild = false;
            //   // currentDeviceId = marker.getExtData().marker.deviceid;
            // };
            geocoder.getAddress(markerLnglat, function(status, result) {
              if (status == 'complete') {
                markerAddr = result.regeocode.formattedAddress;
                console.info(markerAddr, markerLnglat);
                updateMapList(_.extend({
                  location: {
                    "type": "amap",
                    "latitude": markerLnglat.lat,
                    "longitude": markerLnglat.lng,
                    "name": markerAddr,
                    "address": markerAddr
                  }
                }, (currentMarker.getExtData().marker && currentMarker.getExtData().marker.bid) ? {
                  name: currentMarker.getExtData().marker.name,
                  intro: currentMarker.getExtData().marker.intro,
                  type: currentMarker.getExtData().marker.type,
                  minfloor: currentMarker.getExtData().marker.minfloor,
                  maxfloor: currentMarker.getExtData().marker.maxfloor,
                  preview: JSON.stringify(currentMarker.getExtData().marker.preview),
                  bid: currentMarker.getExtData().marker.bid
                } : {
                  deviceid: currentMarker.getExtData().marker.deviceid
                }));
                console.info(updateMapDataList);
              } else {
                AppLog.error("地图暂不支持该区域定位!", 1);
              }
            })
          } else if ($scope.editable && currentMarker && currentMarker.getExtData().isbuildAdding) {

          }
        });
        AMap.event.addListener(map, 'movestart', function(MouseEvent) {
          if (isZoom) return;
          // if ($scope.editable && isPan && $scope.isIpad) {
          // if(currentMarker.getExtData().isbuildAdding) return;
          closeInfoWindow();

          // }
        });
        AMap.event.addListener(map, 'mapmove', function(MouseEvent) {
          if (isZoom) return;
          if (($scope.editable || (currentMarker && currentMarker.getExtData().isbuildAdding)) && isPan && $scope.isIpad) {
            currentMarker.setPosition(map.getCenter());
          }
        });
        var changePreMarker = function(preMarker) {
          // console.info(preMarker.getIcon());

        }
        var changeMarkerStatus = function(_marker, _isTree) {
          // for (var i = markers.length - 1; i >= 0; i--) {
          // if ((markers[i].getExtData().marker.deviceid && markers[i].getExtData().marker.deviceid === _item.deviceid) || (markers[i].getExtData().marker.bid && markers[i].getExtData().marker.bid === _item.bid)) {
          if (!_isTree && _marker.getExtData().marker.deviceid) $scope.selectCamera(_marker.getExtData().marker, !_isTree);
          if (preMarker) {
            preMarker.setMap(null);
            markers.push(preMarker);
            cluster.addMarker(preMarker);
            preMarker.setzIndex(100);
            if (preMarker.getExtData().marker.deviceid) preMarker.getExtData().marker.checked = false;

            if ($scope.editable && $scope.isIpad) {
              isPan = false;
              var _device = preMarker.getExtData().marker;
              var icon_src = "/public/images/gismap/map-type-";
              if (_device.bid) {
                icon_src += "building-n.png";
              } else if ((_device.status & 0x100) !== 0 && _device.devStatus !== "offline") {
                icon_src += "cloud.png";
              } else if (_device.devStatus === "offline") {
                icon_src += "xiaohei-gray-n.png";
              } else if (_device.devStatus !== "offline") {
                icon_src += "xiaohei-n.png";
              }
              preMarker.setIcon(icon_src);
            }
          }
          currentMarker = _marker;
          preMarker = _marker;
          currentMarker.setzIndex(9999);
          cluster.removeMarker(currentMarker);
          for (var i = markers.length - 1; i >= 0; i--) {
            if ((markers[i].getExtData().marker.deviceid && markers[i].getExtData().marker.deviceid === currentMarker.getExtData().marker.deviceid) || (markers[i].getExtData().marker.bid && markers[i].getExtData().marker.bid === currentMarker.getExtData().marker.bid)) {
              markers.splice(i, 1);
            }
          };
          currentMarker.setMap(map);
          // currentMarker.setAnimation('AMAP_ANIMATION_BOUNCE');
          if ($scope.editable && $scope.isIpad) {
            isTreeMove = true;
            // isPan = false;
            currentMarker = currentMarker;
            beforeEditIcon = currentMarker.getIcon();
            currentMarker.setIcon("/public/images/gismap/current-location.png");
            currentMarker.setzIndex(9999);
          }
          infoWindow.setContent((currentMarker.getExtData().isbuildAdding || currentMarker.getExtData().marker.bid) ? createInfoWindow(currentMarker) : createCameraWindow(currentMarker));
          infoWindow.open(map, currentMarker.getPosition());
          //     break;
          //   }
          // };

          map.panTo(currentMarker.getPosition());
        }
        $scope.onDropComplete1 = function(e) {};
        //修改电子地图上的数据
        var updateMapList = function(_currentItem) {
          var isContain = false;
          if (updateMapDataList.length === 0) {
            updateMapDataList.push(_currentItem);
          } else {
            _.each(updateMapDataList, function(_marker) {
              if (_marker.deviceid && _marker.deviceid === _currentItem.deviceid) {
                _marker.location = _currentItem.location; //修改电子地图上的摄像机定位信息
                isContain = true;
                return false;
              }
              if (_marker.bid && _marker.bid === _currentItem.bid) {
                _marker.location = _currentItem.location;
                isContain = true;
                return false;
              }
            });
            if (!isContain) updateMapDataList.push(_currentItem);
          }
          console.info(updateMapDataList);
        };
        var delUpdateMapList = function(_deviceid) {
          if (updateMapDataList.length === 0) return;
          _.each(updateMapDataList, function(_marker, $index) {
            if (_marker.deviceid === _deviceid) {
              updateMapDataList.splice($index, 1);
              return false;
            }
          });
          console.info(updateMapDataList);
        };
        var checkData = function(v) {
          var entry = {
            "'": "&apos;",
            '"': '&quot;',
            '<': '&lt;',
            '>': '&gt;'
          };
          v = v.replace(/(['")-><&\\\/\.])/g, function($0) {
            return entry[$0] || $0;
          });
          return v;
        };
        //创建楼宇窗体
        var createInfoWindow = function(_marker) {
          if (videoPlayerManager) videoPlayerManager.destroy();
          var main = document.createElement("div");
          main.className = "map-main"
          var info = document.createElement("div");
          info.className = "info build";
          var _markerData = _marker.getExtData();
          var tmp = _.clone(_markerData);
          delete tmp['isbuildAdding'];
          var isEmpty = _.isEmpty(tmp);
          c_closed = false;
          // if(isEmpty) _marker.getExtData().isbuildAdding = true;
          var noFloor = false;
          if (!isEmpty) {
            if (_markerData.marker && _markerData.marker.preview) {
              if (_markerData.marker.preview.length !== 0) {
                noFloor = true;
              }
            }
          }


          // 定义顶部标题
          var top = document.createElement("div");
          // var titleD = document.createElement("div");
          var closeX = document.createElement("i");
          var aclose = document.createElement("a");

          var titleSpan = document.createElement("span");
          top.className = "info-title";
          titleSpan.className = "title";
          aclose.className = "w-close";
          if (!isEmpty) titleSpan.innerHTML = _markerData.marker.name;
          else titleSpan.innerHTML = "点位详情";
          top.appendChild(titleSpan);
          closeX.className = "pic-close";
          aclose.onclick = function() {
            c_closed = true;
            closeNewAddBuild();
            closeInfoWindow();
          }


          var delImg = document.createElement("img");
          var aDel = document.createElement("a");
          aDel.className = "adel";
          delImg.src = "/public/images/gismap/modal-del.png";
          // aDel.style.display = "block";
          aclose.appendChild(closeX);
          top.appendChild(aclose);
          info.appendChild(top);

          if (!isEmpty && !_marker.getExtData().isbuildAdding) {
            main.className = "map-main s";
            var editImg = document.createElement("img");
            var aEdit = document.createElement("a");
            editImg.src = "/public/images/gismap/modal-edit.png";
            aEdit.className = "aedit";
            aEdit.onclick = function() {
              $element.find(".map-main").removeClass("s");
            }

            aDel.appendChild(delImg);
            top.appendChild(aDel);
            aEdit.appendChild(editImg);
            top.appendChild(aEdit);
            //描述
            var desc2 = document.createElement("div");
            desc2.className = "form-inline form-group build-desc";
            var labeldesc = document.createElement("label");
            labeldesc.className = "title";
            labeldesc.innerHTML = "描述&nbsp;:&nbsp;";
            var spandesc = document.createElement("span");
            spandesc.className = "build-desc-span";
            spandesc.innerHTML = _markerData.marker.intro ? _markerData.marker.intro : "暂无描述";
            var labelfloors = document.createElement("label");
            labelfloors.className = "title floor";
            labelfloors.innerHTML = "楼层&nbsp;:&nbsp;";

            var dropdown = document.createElement("div");
            dropdown.className = "dropdown map-dropdown";
            if (noFloor) {
              var dropbtn = document.createElement("button");
              dropbtn.className = "btn btn-default dropdown-toggle";
              dropbtn.setAttribute("type", "button");
              dropbtn.setAttribute("id", "dropdownMenu2");
              dropbtn.setAttribute("data-toggle", "dropdown");
              dropbtn.setAttribute("aria-haspopup", "true");
              dropbtn.setAttribute("aria-expanded", "false");
              var floors = _.groupBy(_markerData.marker.preview, "floor");
              for (var floor in floors) {
                if (parseInt(floors[floor][0].floor) < 0) {
                  dropbtn.innerHTML = "B" + Math.abs(parseInt(floors[floor][0].floor));
                } else if (parseInt(floors[floor][0].floor) > 0) {
                  dropbtn.innerHTML = "F" + Math.abs(parseInt(floors[floor][0].floor));
                } else {
                  dropbtn.innerHTML = "室外";
                }

                $element.find(".thumbnailImg").attr("src", $scope.prefix + floors[floor][0].image);
                // $element.find(".build-nodata").css("background-image","url("+$scope.prefix + floors[floor][0].image+")");
                break;
              };

              var caret = document.createElement("span");
              caret.className = "s";
              dropbtn.appendChild(caret);

              var dropmenu = document.createElement("ul");
              dropmenu.className = "dropdown-menu";

              var floorsbak = {};
              var tmpc;
              for (var floor in floors) {
                if (parseInt(floor) === 0) {
                  tmpc = floors[floor];
                } else {
                  floorsbak[floor] = floors[floor];
                }
              }
              if (tmpc) floorsbak["z"] = tmpc;

              for (var floor in floorsbak) {
                var dropli = document.createElement("li");
                var dropa = document.createElement("a");
                if (parseInt(floorsbak[floor][0].floor) < 0) {
                  dropa.innerHTML = "B" + Math.abs(parseInt(floorsbak[floor][0].floor));
                } else if (floorsbak[floor][0].floor > 0) {
                  dropa.innerHTML = "F" + Math.abs(parseInt(floorsbak[floor][0].floor));
                } else {
                  dropa.innerHTML = "室外";
                }
                // dropa.innerHTML = (parseInt(floors[floor][0].floor) < 0 ? "B" + Math.abs(parseInt(floors[floor][0].floor)) : "F" + Math.abs(parseInt(floors[floor][0].floor)));
                dropli.appendChild(dropa);
                dropli.setAttribute("_f", (parseInt(floorsbak[floor][0].floor) < 0 ? "B" + Math.abs(parseInt(floorsbak[floor][0].floor)) : "F" + Math.abs(parseInt(floorsbak[floor][0].floor))));
                dropli.setAttribute("_img", floorsbak[floor][0].image);
                dropmenu.appendChild(dropli);
                dropli.onclick = function() {
                  dropbtn.innerHTML = this.getAttribute('_f') === "F0" ? "室外" : this.getAttribute('_f');
                  dropbtn.appendChild(caret);
                  $element.find(".thumbnailImg").attr("src", $scope.prefix + this.getAttribute('_img'));
                  // $element.find(".build-nodata").css("background-image","url("+$scope.prefix + this.getAttribute('_img')+")");
                }
              }

              var dropli = document.createElement("li");
              var dropa0 = document.createElement("a");

              dropdown.appendChild(dropbtn);
              dropdown.appendChild(dropmenu);
            } else {
              dropdown.innerHTML = "暂无楼层";
            }

            if (_markerData.marker.intro.length < 12) {
              desc2.appendChild(labeldesc);
              desc2.appendChild(spandesc);
            }

            desc2.appendChild(labelfloors);
            desc2.appendChild(dropdown);
            info.appendChild(desc2);

            var desc3 = document.createElement("div");
            desc3.className = "form-inline form-group build-desc2";
            desc3.innerHTML = "描述&nbsp;:&nbsp;" + (_markerData.marker.intro ? _markerData.marker.intro : "暂无描述");
            if (_markerData.marker.intro.length > 12) {
              desc2.className = "form-inline form-group build-desc d";
              info.appendChild(desc3);
            }

            aDel.onclick = function() {
              $element.find(".map-main").addClass("submitdel");
              // var delinfo = document.createElement("div");
              // delinfo.className = "delinfo";
              titleSpan.innerHTML = "提示";
              delinfo.innerHTML = "确认删除楼宇信息么？";
              // content.appendChild(delinfo);
              // submit.onclick = function() {
              //   delMapbuildMarker(_marker);
              // }
            };
          }

          // 定义中部内容
          var name = document.createElement("div");
          name.className = "form-inline form-group build-name";
          var label1 = document.createElement("label");
          label1.className = "title";
          label1.innerHTML = "名称&nbsp;:&nbsp;";
          var input = document.createElement("input");
          input.className = "build-input";

          if (!isEmpty) input.value = _markerData.marker.name;
          input.setAttribute('name', 'categoryName');
          input.setAttribute('placeholder', '请输入室内地图名称');
          input.setAttribute('maxlength', '10');
          var desc = document.createElement("div");
          desc.className = "form-inline form-group build-details";
          var label2 = document.createElement("label");
          label2.className = "title";
          label2.innerHTML = "详情&nbsp;:&nbsp;";
          var textarea = document.createElement("textarea");
          textarea.setAttribute('placeholder', '请输入详情描述');
          textarea.className = "build-details";
          textarea.setAttribute('rows', '3');
          if (!isEmpty) textarea.value = _markerData.marker.intro;
          var content = document.createElement("div");
          content.className = "info-content b";

          var showThum = document.createElement("div");
          showThum.className = "build-nodata";


          if (noFloor) {
            var thumbnail = document.createElement("img");
            thumbnail.className = "thumbnailImg";
            var floors = _.groupBy(_markerData.marker.preview, "floor");
            var firstImg;
            for (var floor in floors) {
              firstImg = floors[floor][0].image;
              break;
            }
            thumbnail.src = $scope.prefix + firstImg;
            showThum.appendChild(thumbnail);

            var showBigImg = document.createElement("a");
            showBigImg.className = "showBigImg";
            var bigspan = document.createElement("span");
            bigspan.innerHTML = "点击查看大图&nbsp;>";
            showBigImg.appendChild(bigspan);
            showThum.appendChild(showBigImg);

            var showMarkedImg = document.createElement("a");
            showMarkedImg.className = "showMarkedImg";
            var markedspan = document.createElement("span");
            markedspan.className = "markedspan";
            markedspan.innerHTML = "点击进入标点&nbsp;>";
            var markedimg = document.createElement("img");
            markedimg.src = "/public/images/gismap/modal-add.png";
            markedspan.innerHTML = "点击进入标点&nbsp;>";
            showMarkedImg.appendChild(markedimg);
            showMarkedImg.appendChild(markedspan);
            showThum.appendChild(showMarkedImg);

            showBigImg.onclick = function() {
              if (!input.value) {
                AppLog.error("请输入楼宇名称！", 1);
                return;
              }
              if (isEmpty) {
                _marker.getExtData().marker = {};
              }
              _marker.getExtData().marker.name = checkData(input.value);
              _marker.getExtData().marker.intro = checkData(textarea.value);

              geocoder.getAddress(_marker.getPosition(), function(status, result) {
                if (status == 'complete') {
                  _marker.getExtData().location = {
                    "type": "amap",
                    "latitude": _marker.getPosition().lat,
                    "longitude": _marker.getPosition().lng,
                    "name": result.regeocode.formattedAddress,
                    "address": result.regeocode.formattedAddress
                  }
                  _marker.editable = false;
                  $scope.$emit("currentMarker", _marker);
                  closeInfoWindow();
                } else {
                  AppLog.error("地图暂不支持该区域定位!", 1);
                }
              });

            };
            showMarkedImg.onclick = function() {
              if (!input.value) {
                AppLog.error("请输入楼宇名称！", 1);
                return;
              }
              // $scope.showBuildingDetail();
              if (isEmpty) {
                _marker.getExtData().marker = {};
              }
              _marker.getExtData().marker.name = checkData(input.value);
              _marker.getExtData().marker.intro = checkData(textarea.value);

              geocoder.getAddress(_marker.getPosition(), function(status, result) {
                if (status == 'complete') {
                  _marker.getExtData().location = {
                    "type": "amap",
                    "latitude": _marker.getPosition().lat,
                    "longitude": _marker.getPosition().lng,
                    "name": result.regeocode.formattedAddress,
                    "address": result.regeocode.formattedAddress
                  }
                  _marker.editable = true;
                  $scope.$emit("currentMarker", _marker);
                  closeInfoWindow();
                  // $scope.$emit("showAddMark", true);
                  // $scope.isbuildAdding = false; //电子地图添加楼宇状态
                  // $scope.$apply();
                } else {
                  AppLog.error("地图暂不支持该区域定位!", 1);
                }
              });
            };
          } else {
            var nodataImg = document.createElement("img");
            nodataImg.src = "/public/images/gismap/build-nodata.png";
            nodataImg.className = "noImg";
            var nodataSpan = document.createElement("span");
            nodataSpan.innerHTML = "暂无室内地图，请点击添加";
            showThum.appendChild(nodataImg);
            showThum.appendChild(nodataSpan);

            showThum.onclick = function() {
              if (!input.value) {
                AppLog.error("请输入楼宇名称！", 1);
                return;
              }
              // $scope.showBuildingDetail();
              if (isEmpty) {
                _marker.getExtData().marker = {};
              }
              _marker.getExtData().marker.name = checkData(input.value);
              _marker.getExtData().marker.intro = checkData(textarea.value);


              geocoder.getAddress(_marker.getPosition(), function(status, result) {
                if (status == 'complete') {
                  _marker.getExtData().location = {
                    "type": "amap",
                    "latitude": _marker.getPosition().lat,
                    "longitude": _marker.getPosition().lng,
                    "name": result.regeocode.formattedAddress,
                    "address": result.regeocode.formattedAddress
                  }
                  _marker.editable = true;
                  $scope.$emit("currentMarker", _marker);
                  closeInfoWindow();
                  // $scope.isbuildAdding = false; //电子地图添加楼宇状态
                  // $scope.$apply();
                } else {
                  AppLog.error("地图暂不支持该区域定位!", 1);
                }
              });
            };
          }
          var submit = document.createElement("a");
          submit.className = "btn submit";
          submit.innerHTML = "保存";
          var cancel = document.createElement("a");
          cancel.className = "btn cancel";
          cancel.innerHTML = "取消";

          var delinfo = document.createElement("div");
          delinfo.className = "delinfo";
          var titledel = document.createElement("span");
          top.className = "info-title";
          titledel.className = "title";


          delinfo.innerHTML = "确认删除已添加标注的楼宇吗？";
          var submitdel = document.createElement("a");
          submitdel.className = "btn submitdel";
          submitdel.innerHTML = "确定";
          var canceldel = document.createElement("a");
          canceldel.className = "btn canceldel";
          canceldel.innerHTML = "取消";

          submitdel.onclick = function() {
            $scope.isbuildAdding = false;
            $scope.$apply();
            delMapbuildMarker(_marker, true);
          }
          canceldel.onclick = function() {
            $element.find(".map-main").removeClass("submitdel");
            if (!isEmpty) titleSpan.innerHTML = _markerData.marker.name;
            else titleSpan.innerHTML = "点位详情";
          }

          submit.onclick = function() {
            if (!input.value) {
              AppLog.error("请输入楼宇名称！", 1);
              return;
            }
            if (isEmpty) {
              _marker.getExtData().marker = {};
            }
            _marker.getExtData().marker.name = checkData(input.value);
            _marker.getExtData().marker.intro = checkData(textarea.value);
            saveBuildInfo(_marker);
          }
          cancel.onclick = function() {
            if (_marker.getExtData().isbuildAdding) {
              if (_marker.getExtData().marker && _marker.getExtData().marker.bid) {
                // delMapbuildMarker(_marker,true);
                $element.find(".map-main").addClass("submitdel");
                titleSpan.innerHTML = "提示";
              } else {
                closeNewAddBuild();
                closeInfoWindow();
                // c_closed = true;
                // $scope.isbuildAdding = false;
                // $scope.$apply();
                // map.remove(_marker);
                // cluster.removeMarker(_marker);
              }
            } else {
              closeInfoWindow();
            }
          };
          name.appendChild(label1);
          name.appendChild(input);
          info.appendChild(name);
          desc.appendChild(label2);
          desc.appendChild(textarea);
          info.appendChild(desc);
          content.appendChild(showThum);
          content.appendChild(delinfo);
          info.appendChild(content);
          info.appendChild(cancel);
          info.appendChild(submit);
          info.appendChild(canceldel);
          info.appendChild(submitdel);


          // 定义底部内容
          var bottom = document.createElement("div");
          // bottom.className = "amap-info-sharp";
          // bottom.style.height = '23px';
          // info.appendChild(bottom);
          main.appendChild(info);
          main.appendChild(bottom);
          return main;
        };
        var closeNewAddBuild = function() {
          if (currentMarker && currentMarker.getExtData().isbuildAdding) {
            $scope.isbuildAdding = false;
            $scope.$apply();
            map.remove(currentMarker);
            c_closed = true;
            cluster.removeMarker(currentMarker);
            currentMarker = "";
            preMarker = "";
            isPan = false;
          }
        };
        //保存楼宇信息
        var saveBuildInfo = function(_marker) {
          $scope.isbuildAdding = false;

          closeInfoWindow();
          geocoder.getAddress(_marker.getPosition(), function(status, result) {
            if (status == 'complete') {
              var location = {
                "type": "amap",
                "latitude": _marker.getPosition().lat,
                "longitude": _marker.getPosition().lng,
                "name": result.regeocode.formattedAddress,
                "address": result.regeocode.formattedAddress
              }
              ProfileService.addMapBulid({
                "name": _marker.getExtData().marker.name,
                "intro": _marker.getExtData().marker.intro,
                "location": JSON.stringify(location),
                "bid": _marker.getExtData().marker.bid,
                "type": _marker.getExtData().marker.type || "0",
                "minfloor": _marker.getExtData().marker.minfloor || "-2",
                "maxfloor": _marker.getExtData().marker.maxfloor || "2",
                "preview": JSON.stringify(_marker.getExtData().marker.preview) || "[]"
              }).then(function(_data) {
                // _marker.getExtData().marker = _data.marker;
                _marker.setExtData(_data);
                markers.push(_marker);
                cluster.addMarker(_marker);
                _marker.setAnimation('AMAP_ANIMATION_NONE');
                changeMarkerStatus(_marker);
                // _marker.getExtData().isbuildAdding = false;

                if ($scope.editable) {
                  _marker.setDraggable(true);
                }
                // }
                AppLog.info("楼宇信息保存成功！", 1);
              })
            } else {
              AppLog.error("地图暂不支持该区域定位!", 1);
            }
          });
        };
        //关闭楼宇窗体
        var closeInfoWindow = function() {
          map.clearInfoWindow();
        };
        //构建摄像机窗口
        var createCameraWindow = function(_marker) {
          if (videoPlayerManager) videoPlayerManager.destroy();
          var info = document.createElement("div");
          info.className = "info camera";
          _deviceInfo = _marker.getExtData().marker;
          c_closed = false;
          //可以通过下面的方式修改自定义窗体的宽高
          //info.style.width = "400px";
          // 定义顶部标题
          var top = document.createElement("div");
          var closeX = document.createElement("i");
          var aclose = document.createElement("a");
          var titleSpan = document.createElement("span");
          top.className = "info-title";
          titleSpan.className = "title";
          aclose.className = "w-close";
          titleSpan.innerHTML = _deviceInfo.description;
          top.appendChild(titleSpan);
          closeX.className = "pic-close";
          aclose.onclick = function() {
            c_closed = true;
            closeCameraWindow();
          }

          var delImg = document.createElement("img");
          var aDel = document.createElement("a");
          aDel.className = "adel";
          delImg.src = "/public/images/gismap/modal-del.png";
          aDel.onclick = function() {
            c_closed = true;
            delMapMarker(_marker);
          };
          if ($scope.editable) aDel.style.display = "block";

          aclose.appendChild(closeX);
          top.appendChild(aclose);

          aDel.appendChild(delImg);
          top.appendChild(aDel);

          info.appendChild(top);

          // 定义中部内容
          var middle = document.createElement("div");
          middle.className = "info-content video";

          var showMonitor = document.createElement("a");
          showMonitor.className = "show-monitor";
          var monspan = document.createElement("span");
          monspan.innerHTML = "点击查看&nbsp;>";
          showMonitor.appendChild(monspan);
          middle.appendChild(showMonitor);
          showMonitor.onclick = function() {
            window.open(window.location.origin + "/monitor/" + _deviceInfo.deviceid);
          }

          info.appendChild(middle);
          initVideo(middle, _deviceInfo);
          return info;
        };
        var closeCameraWindow = function() {
          if (videoPlayerManager) videoPlayerManager.destroy();
          c_closed = true;
          map.clearInfoWindow();
        };
        var getMapAddr = function(_lnglat, _cfbn) {
          var location = {};
          geocoder.getAddress(_lnglat, function(status, result) {
            if (status == 'complete') {
              location = {
                "type": "amap",
                "latitude": _lnglat.lat,
                "longitude": _lnglat.lng,
                "name": result.regeocode.formattedAddress,
                "address": result.regeocode.formattedAddress
              }
              if (_cfbn) _cfbn(location);
            } else {
              AppLog.error("地图暂不支持该区域定位!", 1);
            }
          });
        };
        var initVideo = function(_wrap, _deviceInfo) {
          // $target = $element.find(".info-content");
          // targetClass = $target[0].className.split(" ")[0];
          // $target.empty();
          // $target.removeClass().addClass(targetClass);
          var w = $(".gis-context .camera .info-content").width();
          if (videoPlayerManager) videoPlayerManager.destroy();
          videoPlayerManager = new VideoPlayer({
            language: CURRENT_PROJECT_LANGUAGE,
            plugins: [],
            container: $(_wrap),
            width: w,
            height: w * 9 / 16,
            isPrivate: true,
            // yuntaiType: 1,
            controls: false,
            showMenu: false
          });
          videoPlayerManager.bindData(_deviceInfo);
        };
        //删除电子地图上的楼宇图标
        var delMapbuildMarker = function(_marker, _noinfo) {
          map.clearInfoWindow();
          map.remove(_marker);

          _marker.setMap(null);
          cluster.removeMarker(_marker);

          if (currentMarker) {
            currentMarker.setzIndex(100);
            c_closed = true;
            currentMarker = "";
            preMarker = "";
            // $scope.treeCurrentDevice = "";
          }

          for (var i = markers.length - 1; i >= 0; i--) {
            if (markers[i] === _marker) {
              markers.splice(i, 1);
            }
          };
          _.each(_marker.getExtData().marker.preview, function(_floorImg) {
            _.each(_floorImg.device, function(device) {
              device.isMarked = false;
              device.checked = false;
              $scope.$apply();
            });
          });


          ProfileService.delMapbuild({
            bid: _marker.getExtData().marker.bid
          }).then(function(_data) {
            c_closed = false;
            currentMarker = "";
            preMarker = "";
            if (!_noinfo) AppLog.info("楼宇删除成功！", 1);
          })
        };
        var delMapMarker = function(_marker) {
          map.clearInfoWindow();
          _marker.getExtData().marker.isMarked = false;
          _marker.getExtData().marker.checked = false;
          if (videoPlayerManager) videoPlayerManager.destroy();
          // changeTreeCamera(_marker.getExtData().marker.deviceid);
          $scope.$apply();
          // map.remove(_marker);
          // $scope.treeCurrentDevice = "";
          for (var i = markers.length - 1; i >= 0; i--) {
            if (markers[i].getExtData().marker.deviceid === _marker.getExtData().marker.deviceid) {
              markers.splice(i, 1);
            }
          };
          _marker.setMap(null);
          cluster.removeMarker(_marker);

          if (currentMarker) {
            currentMarker.setzIndex(100);
            c_closed = true;
            currentMarker = "";
            preMarker = "";
          }

          if (videoPlayerManager) videoPlayerManager.destroy();
          delUpdateMapList(_marker.getExtData().marker.deviceid);
          delMapDeviceIds.push(_marker.getExtData().marker.deviceid);
        };
        //聚合
        var addCluster = function() {
          if (cluster && cluster.length !== 0) cluster.removeMarkers(markers);
          var sts = [{
            url: "/public/images/gismap/clusterer.png",
            size: new AMap.Size(30, 42),
            offset: new AMap.Pixel(-16, -30),
            textColor: '#fff'
          }, {
            url: "/public/images/gismap/clusterer.png",
            size: new AMap.Size(30, 42),
            offset: new AMap.Pixel(-16, -30),
            textColor: '#fff'
          }, {
            url: "/public/images/gismap/clusterer.png",
            size: new AMap.Size(30, 42),
            offset: new AMap.Pixel(-24, -45),
            textColor: '#fff'
          }];
          map.plugin(["AMap.MarkerClusterer"], function() {
            cluster = new AMap.MarkerClusterer(map, markers, {
              styles: sts,
              maxZoom: 10
            });
          });
        };
        var mouseupEventListener = function(e) {
          _device = $scope.treeCurrentDevice;
          // e.target.lnglat = e.lnglat;

          map.off("mousemove", mousemoveEventListener);
          map.off("mouseup", mouseupEventListener);
          treeMarker.off('mouseup', mouseupEventListener);

          // cluster.addMarker(treeMarker);
          treeMarker = "";
          _device.isMarked = true;
          changeMarkerStatus(e.target);

          geocoder.getAddress(e.target.getPosition(), function(status, result) {
            if (status == 'complete') {
              markerAddr = result.regeocode.formattedAddress;
              updateMapList({
                deviceid: e.target.getExtData().marker.deviceid,
                location: {
                  "type": "amap",
                  "latitude": e.target.getPosition().lat,
                  "longitude": e.target.getPosition().lng,
                  "name": markerAddr,
                  "address": markerAddr
                }
              });
              // map.setZoomAndCenter(14, e.target.getPosition());
              addMapdeviceIds.push(e.target.getExtData().marker.deviceid);
            } else {
              AppLog.error("地图暂不支持该区域定位!", 1);
            }
          })
        }
        var mousemoveEventListener = function(e) {
          e.target.lnglat = e.lnglat;
          treeMarker.setPosition(e.lnglat);
        };
        var moveInMap = function(e) {
          var icon, _device;
          var icon_src = "/public/images/gismap/map-type-";
          // treeMarker = "";
          if (!$('.drag-wrap').is(".dragging") || !$scope.treeCurrentDevice || $scope.showBuildingManage || $scope.treeCurrentDevice.isMarked) return;
          closeInfoWindow();
          closeCameraWindow();
          _device = $scope.treeCurrentDevice;
          if (_device.bid) {
            icon_src += "building-n.png";
          } else if ((_device.status & 0x100) !== 0 && _device.devStatus !== "offline") {
            icon_src += "cloud.png";
          } else if (_device.devStatus === "offline") {
            icon_src += "xiaohei-gray-n.png";
          } else if (_device.devStatus !== "offline") {
            icon_src += "xiaohei-n.png";
          }
          icon = new AMap.Icon({
            image: icon_src,
            imageSize: new AMap.Size(30, 42)
          });
          treeMarker = new AMap.Marker({
            position: e.lnglat, //currentLnglat,
            map: map,
            icon: icon,
            draggable: true,
            offset: new AMap.Pixel(-30, -21),
            extData: {
              "marker": _device
            }
          });


          function markerClick(e) {
            // if (e.target.getExtData().marker.deviceid && e.target.getExtData().marker.deviceid === currentMarker.getExtData().marker.deviceid) return;
            // currentMarker = e.target;
            closeNewAddBuild();
            changeMarkerStatus(e.target);
            // infoWindow.setContent(createCameraWindow(e.target));
            // infoWindow.open(map, e.target.getPosition());
          }

          map.on('mouseup', mouseupEventListener);
          map.on('mousemove', mousemoveEventListener);

          // map.on('touchend', mouseupEventListener);
          // map.on('touchmove', mousemoveEventListener);
          treeMarker.on('click', markerClick);
          treeMarker.on('mouseup', mouseupEventListener);
          treeMarker.on('dragstart', function(MouseEvent) {
            // currentDeviceId = MouseEvent.target.getExtData().marker.deviceid;
            closeInfoWindow();
          });
          treeMarker.on('dragend', function(MouseEvent) {
            markerLnglat = MouseEvent.target.getPosition();
            geocoder.getAddress(markerLnglat, function(status, result) {
              if (status == 'complete') {
                markerAddr = result.regeocode.formattedAddress;
                updateMapList({
                  deviceid: MouseEvent.target.getExtData().marker.deviceid,
                  location: {
                    "type": "amap",
                    "latitude": markerLnglat.lat,
                    "longitude": markerLnglat.lng,
                    "name": markerAddr,
                    "address": markerAddr
                  }
                });
                console.info(updateMapDataList);
              } else {
                AppLog.error("地图暂不支持该区域定位!", 1);
              }
            })
          });
          // cluster.addMarker(treeMarker);
          markers.push(treeMarker);
        }
        var moveOutMap = function(e) {
          if (!$('.drag-wrap').is(".dragging") || !treeMarker || !$scope.treeCurrentDevice || $scope.showBuildingManage || $scope.treeCurrentDevice.isMarked) return;

          cluster.removeMarker(treeMarker);
          for (var i = markers.length - 1; i >= 0; i--) {
            if (markers[i].getExtData().marker.deviceid === treeMarker.getExtData().marker.deviceid) {
              markers.splice(i, 1);
            }
          };
          map.remove(treeMarker);


          // map.off('touchend', mouseupEventListener);
          // map.off('touchmove', mousemoveEventListener);
          map.off("mousemove", mousemoveEventListener);
          map.off("mouseup", mouseupEventListener);
          treeMarker.off('mouseup', mouseupEventListener);
          treeMarker = "";
          // $scope.treeCurrentDevice = "";
          // currentMarker = ""
        }
        map.on('mouseover', function(e) {
          moveInMap(e);
        });

        map.on('mouseout', function(e) {
          moveOutMap(e);
        });
        var cstatus = false;

        // map.on('touchstart', function(e) {
        //   console.info(111);
        // });
        // map.on('touchmove', function(e) {
        //   moveInMap(e);
        // });
        // map.on('touchend', function(e) {
        //   console.info("touchend");
        // });
        $(document).bind("touchend", function(e) {
          if ($scope.showBuildingManage || !$scope.treeCurrentDevice || $scope.showBuildingManage || $scope.treeCurrentDevice.isMarked) return;
          var _touch = e.originalEvent.changedTouches[0];

          var oLeft = _touch.pageX;
          var oTop = _touch.pageY;
          var mapLeft = $("#mapContainer").offset().left;
          var mapTop = $("#mapContainer").offset().top;

          if (oLeft > mapLeft && oTop > mapTop && cstatus) { // 
            e.target = treeMarker;
            mouseupEventListener(e);
            isPan = false;
            cstatus = false;
          }
        });
        $(document).bind("touchmove", function(e) {
          if ($scope.showBuildingManage || !$scope.treeCurrentDevice || $scope.showBuildingManage || $scope.treeCurrentDevice.isMarked) return;
          var touches = e.touches[0];
          var oLeft = touches.clientX;
          var oTop = touches.clientY;
          var mapLeft = $("#mapContainer").offset().left;
          var mapTop = $("#mapContainer").offset().top;
          var mapBottom = $("#mapContainer").offset().top + $("#mapContainer").height();
          if (oLeft > mapLeft && oTop > mapTop && oTop < mapBottom) { // 
            var ll = map.containTolnglat(new AMap.Pixel(oLeft - mapLeft, oTop - mapTop));
            e.lnglat = [ll.getLng(), ll.getLat()];
            if (!cstatus) AMap.event.trigger(map, 'mouseover', e);
            else {
              mousemoveEventListener(e);
            }
            cstatus = true;
          } else if ((oLeft < mapLeft || oTop < mapTop || oTop > mapBottom) && cstatus) {

            cstatus = false;

            AMap.event.trigger(map, 'mouseout');
          }
        });
        //电子地图加载摄像机列表
        $scope.$watch('categories', function(newVal, oldVal) {
          if (newVal === oldVal) return;
          closeCameraWindow();
          closeInfoWindow();
          var list = $scope.markerList;
          map.remove(markers);
          if (cluster && cluster.length !== 0) cluster.removeMarkers(markers);
          markers = [];

          for (var i = 0, marker; i < list.length; i++) {
            var icon_src = "/public/images/gismap/map-type-";
            var position = [];
            var _camera = list[i].marker;
            if (_camera.bid) {
              icon_src += "building-n.png";
            } else if ((_camera.status & 0x100) !== 0 && _camera.devStatus !== "offline") {
              icon_src += "cloud.png";
            } else if (_camera.devStatus === "offline") {
              icon_src += "xiaohei-gray-n.png";
            } else if (_camera.devStatus !== "offline") {
              icon_src += "xiaohei-n.png";
            }


            var icon = new AMap.Icon({
              image: icon_src,
              imageSize: new AMap.Size(30, 42)
            });
            var marker = new AMap.Marker({
              position: [list[i].location_longitude, list[i].location_latitude],
              offset: new AMap.Pixel(-30, -21),
              map: map,
              icon: icon,
              draggable: false,
              extData: list[i]
            });

            var markerClick = function(e) {
              // if (e.target.getExtData().marker.deviceid && e.target.getExtData().marker.deviceid === currentMarker.getExtData().marker.deviceid || e.target.getExtData().marker.bid && e.target.getExtData().marker.bid === currentMarker.getExtData().marker.bid) return;
              closeNewAddBuild();
              changeMarkerStatus(e.target);
            }
            marker.on('click', markerClick);
            marker.on('dragstart', function(e) {
              currentMarker = e.target;
              closeInfoWindow();
              if (marker.getExtData().marker.bid) {

              } else {
                // currentDeviceId = marker.getExtData().marker.deviceid;
              }
            });
            marker.on('dragend', function(e) {
              var markerLnglat = currentMarker.getPosition();
              var isBuild;
              if (e.target.getExtData().marker.bid) {
                isBuild = true;
              } else {
                isBuild = false;
                // currentDeviceId = marker.getExtData().marker.deviceid;
              };
              geocoder.getAddress(markerLnglat, function(status, result) {
                if (status == 'complete') {
                  markerAddr = result.regeocode.formattedAddress;
                  console.info(markerAddr, markerLnglat);
                  updateMapList(_.extend({
                    location: {
                      "type": "amap",
                      "latitude": markerLnglat.lat,
                      "longitude": markerLnglat.lng,
                      "name": markerAddr,
                      "address": markerAddr
                    }
                  }, isBuild ? {
                    name: e.target.getExtData().marker.name,
                    intro: e.target.getExtData().marker.intro,
                    type: e.target.getExtData().marker.type,
                    minfloor: e.target.getExtData().marker.minfloor,
                    maxfloor: e.target.getExtData().marker.maxfloor,
                    preview: JSON.stringify(e.target.getExtData().marker.preview),
                    bid: e.target.getExtData().marker.bid
                  } : {
                    deviceid: e.target.getExtData().marker.deviceid
                  }));
                  console.info(updateMapDataList);
                } else {
                  AppLog.error("地图暂不支持该区域定位!", 1);
                }
              })
            });
            markers.push(marker);
            if (cluster && cluster.length !== 0) cluster.addMarker(marker);
          }
          var newCenter = map.setFitView(markers);
          setTimeout(function() {
            addCluster(1);
          }, 100);
        });

        $scope.addNewBuilding = function() {
          addBuildingMarker();
        };
        //电子地图添加楼宇图标
        var addBuildingMarker = function() {
          var buildMarkerLng = "";
          if ($scope.isbuildAdding) return;
          $scope.isbuildAdding = true;

          closeCameraWindow();
          closeInfoWindow();
          if (preMarker) {
            preMarker.setMap(null);
            markers.push(preMarker);
            cluster.addMarker(preMarker);
            preMarker.setzIndex(100);
            if (preMarker.getExtData().marker.deviceid) preMarker.getExtData().marker.checked = false;

            if ($scope.editable && $scope.isIpad) {
              isPan = true;
              var _device = preMarker.getExtData().marker;
              var icon_src = "/public/images/gismap/map-type-";
              if (_device.bid) {
                icon_src += "building-n.png";
              } else if ((_device.status & 0x100) !== 0 && _device.devStatus !== "offline") {
                icon_src += "cloud.png";
              } else if (_device.devStatus === "offline") {
                icon_src += "xiaohei-gray-n.png";
              } else if (_device.devStatus !== "offline") {
                icon_src += "xiaohei-n.png";
              }
              preMarker.setIcon(icon_src);
            }
          }

          if ($scope.isIpad) {
            c_closed = false;
            // isPan = false;
          }

          var icon = new AMap.Icon({
            image: "/public/images/gismap/map-type-building-n.png",
            imageSize: new AMap.Size(30, 42)
          });
          var newbuildmarker = new AMap.Marker({
            position: $scope.isIpad ? map.center : "",
            map: map,
            icon: icon,
            draggable: false,
            offset: new AMap.Pixel(-30, -21),
            zIndex: 999,
            extData: {
              "isbuildAdding": true
            }
          });
          if ($scope.isIpad) {
            // newbuildmarker.setIcon("/public/images/gismap/current-location.png");
            newbuildmarker.setAnimation('AMAP_ANIMATION_DROP');
            isPan = true;
            currentMarker = newbuildmarker;
            setTimeout(function() {
              infoWindow.setContent(createInfoWindow(newbuildmarker));
              infoWindow.open(map, newbuildmarker.getPosition());
            }, 800);
          } else {
            newbuildmarker.setLabel({
              offset: new AMap.Pixel(30, 30),
              content: "点击添加标注，右键取消"
            });
            newbuildmarker.hide();
          }
          var clickBEventListener = function markerClick(e) {
            if (e.target.getExtData().isbuildAdding) {
              e.target.lnglat = e.lnglat;
              currentMarker = e.target;
            } else {
              changeMarkerStatus(e.target);
            }

            map.off("mousemove", mousemoveBEventListener);
            newbuildmarker.off('rightclick', rightclickBEventListener);
            newbuildmarker.setLabel("");
            infoWindow.setContent(createInfoWindow(e.target));
            infoWindow.open(map, e.target.getPosition());
          };

          //为地图注册mousemove事件获取鼠标点击出的经纬度坐标
          var mousemoveBEventListener = function(e) {
            newbuildmarker.show();
            e.target.lnglat = e.lnglat;
            newbuildmarker.setPosition(e.lnglat);
          };
          var rightclickBEventListener = function(e) {
            $scope.isbuildAdding = false;
            $scope.$apply();
            map.remove(newbuildmarker);
            cluster.removeMarker(newbuildmarker)
            map.off("mousemove", mousemoveBEventListener);
            newbuildmarker.off('rightclick', rightclickBEventListener);
          };
          var mouseoverBEventListener = function(e) {
            if (!$scope.currentDragingDevice) return;
            $scope.changeDraggingIcon(true);
            // $scope.isInMap = true;
          };
          var dragstartBEventListener = function(e) {
            infoWindow.close();
          };
          var dragendBEventListener = function(e) {
            // e.target.lnglat = e.lnglat;
            // infoWindow.open(map, e.target.getPosition());
            geocoder.getAddress(e.target.getPosition(), function(status, result) {
              if (status == 'complete') {
                markerAddr = result.regeocode.formattedAddress;
                // console.info(markerAddr, e.target.getPosition());
                updateMapList({
                  location: {
                    "type": "amap",
                    "latitude": e.target.getPosition().lat,
                    "longitude": e.target.getPosition().lng,
                    "name": markerAddr,
                    "address": markerAddr
                  },
                  name: e.target.getExtData().marker.name,
                  intro: e.target.getExtData().marker.intro,
                  type: e.target.getExtData().marker.type,
                  minfloor: e.target.getExtData().marker.minfloor,
                  maxfloor: e.target.getExtData().marker.maxfloor,
                  preview: JSON.stringify(e.target.getExtData().marker.preview),
                  bid: e.target.getExtData().marker.bid
                });

                console.info(updateMapDataList);
              } else {
                AppLog.error("地图暂不支持该区域定位!", 1);
              };
            });
          };
          map.on('mousemove', mousemoveBEventListener);
          newbuildmarker.on('rightclick', rightclickBEventListener);
          newbuildmarker.on('dragstart', dragstartBEventListener);
          newbuildmarker.on('dragend', dragendBEventListener);
          newbuildmarker.on('click', clickBEventListener);
        };

        var setMarkersDraggable = function() {
          if (currentMarker) {
            markers.push(currentMarker);
            currentMarker.setMap(null);
            cluster.addMarker(currentMarker);
            currentMarker.setzIndex(100);
          }
          for (var i = 0; i < markers.length; i++) {
            if ($scope.editable) {
              markers[i].setDraggable(true);
            } else {
              markers[i].setDraggable(false);
            }
          }
        };
        $scope.toggleEnableEdit = function() {
          $scope.editable = true; //!$scope.editable;
          $element.find("#mapContainer .camera .adel").show();
          $element.find("#mapContainer .camera .aedit").show();

          $scope.$emit("showAddMark", $scope.editable);
          if (currentMarker) {
            changeMarkerStatus(currentMarker, true);
          }
          if ($scope.isIpad) {

          } else {
            setMarkersDraggable();
          }
        };


        var delMapMarkerList = function() {
          if (delMapDeviceIds.length !== 0) {
            _.each(delMapDeviceIds, function(_deviceId) {
              ProfileService.delMapDeviceMarker({
                deviceid: _deviceId
              }).then(function(_data) {})
            });
            delMapDeviceIds = [];
          }
        };
        $scope.save = function() {
          // $scope.isbuildAdding = false; //电子地图添加楼宇状态
          closeCameraWindow();
          closeInfoWindow();
          // $scope.treeCurrentDevice = "";
          if (currentMarker) {
            changeMarkerStatus(currentMarker, true);
            markers.push(currentMarker);
            currentMarker.setMap(null);
            cluster.addMarker(currentMarker);
            currentMarker.setzIndex(100);
            currentMarker = "";
            preMarker = "";
          }

          if ($scope.isIpad) {
            c_closed = false;
          }
          if (updateMapDataList.length !== 0) {
            _.each(updateMapDataList, function(_item) {
              _item.location = JSON.stringify(_item.location);
              if (_item.bid) {
                ProfileService.addMapBulid(_item).then(function(_data) {

                })
              } else {
                ProfileService.addMapMarker(_item).then(function(_data) {

                })
              }
            });
          }
          delMapMarkerList();
          $scope.categorysBindData();
          updateMapDataList = [];
          addMapdeviceIds = [];
          $scope.editable = false;
          $scope.$emit("showAddMark", $scope.editable);
        };
        $scope.cancel = function() {
          closeCameraWindow();
          closeInfoWindow();
          // $scope.treeCurrentDevice ="";
          if (currentMarker) {
            changeMarkerStatus(currentMarker, true);
            markers.push(currentMarker);
            currentMarker.setMap(null);
            cluster.addMarker(currentMarker);
            currentMarker.setzIndex(100);
            currentMarker = "";
            preMarker = "";
          }
          if ($scope.isIpad) {
            c_closed = false;
            // isPan = false;
          }
          $scope.editable = false;
          $scope.$emit("showAddMark", $scope.editable);

          $element.find("#mapContainer .camera .adel").show();
          $element.find("#mapContainer .camera .aedit").show();

          // if ($scope.isIpad) {
          //   changePreMarker();
          //   // isPan = false;
          // }

          updateMapDataList = [];
          delMapDeviceIds = [];
          map.remove(markers);
          cluster.removeMarkers(markers);
          if ($scope.isIpad) {

          } else {
            setMarkersDraggable();
          }
          $scope.categorysBindData();
        };
        $scope.fullscreen = function() {
          $scope.isFullscreen = !$scope.isFullscreen;
          $scope.showLive = false;
          $scope.$emit("isFullscreen", $scope.isFullscreen);
        };



        AMap.event.addListener(map, 'zoomend', function(MouseEvent) {
          addCluster();
        });
      };

      var initMap = function() {
        var currentProvince;
        cluster = [];

        //获取用户所在城市信息
        var showCityInfo = function() {
          //实例化城市查询类
          var citysearch = new AMap.CitySearch();
          //自动获取用户IP，返回当前城市
          citysearch.getLocalCity(function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
              if (result && result.city && result.bounds) {
                var cityinfo = result.city;
                var citybounds = result.bounds;
                // document.getElementById('tip').innerHTML = '您当前所在城市：' + cityinfo;
                //地图显示当前城市
                map.setBounds(citybounds);
              }
            } else {
              // document.getElementById('tip').innerHTML = result.info;
            }
          });
        };

        showCityInfo();
        map = new AMap.Map('mapContainer', {
          resizeEnable: true,
          // center: [116.397428, 39.90923], //[107.05078125,29.53522956],
          zoom: 13 //4
        });

        map.plugin(["AMap.ToolBar"], function() {
          map.addControl(new AMap.ToolBar());
        });

        infoWindow = new AMap.InfoWindow({
          offset: new AMap.Pixel(-24, -20),
          autoMove: false //true
        });

        AMap.plugin('AMap.Geocoder', function() {
          geocoder = new AMap.Geocoder({
            city: "010" //城市，默认：“全国”
          });
        });

        AMap.event.addListener(map, 'mousemove', function(MouseEvent) {
          currentLnglat = MouseEvent.lnglat;
        });
      };

      var init = function() {
        $scope.editable = false;
        $scope.setMap = true;
        $scope.prefix = CURRENT_PROJECT_MODE === "develop" ? "/public/images/gismap/test/" : "http://www.iermu.com:8082/";

        initMap();
        bindEvent();
      };

      init();
    }
  ]);
  Controllers.controller("BuildingController", ["$scope", "$element", "$compile", "ProfileService",
    function($scope, $element, $compile, ProfileService) {
      var floorsTop, floors, floorsImgTop;
      var addMarkerPostionX, addMarkerPostionY;
      var videoPlayerManager;
      var updateImgDevices, delImgDevices;
      var updatedBuildData;
      var targetClass, $target
      var isdraging = false;
      var ischange = false;
      var isSaved = false;
      var isMarkedDevices = [];
      var currentMarkerDevices = [];
      var dragMarkerDevices = [];

      $scope.showModal = false;
      $scope.showModalLivePlay = false;
      var bindEvent = function() {


        $scope.$on("currentMarker", function(e, _currentMarker) {
          $scope.currentMarker = _currentMarker;
          $scope.editable = _currentMarker.editable;
          $scope.currentMarkerData = _.clone(_currentMarker.getExtData());
          $scope.$emit("showAddMark", $scope.editable);
          initBuildImg();
          getCurrentMarkerDevices();
          $scope.$apply();
        });

        //获取当前marker的摄像机
        var getCurrentMarkerDevices = function() {
          _.each($scope.currentMarker.getExtData().marker.preview, function(_floorImg) {
            var device = [];
            _.each(_floorImg.device || [], function(_inFloorImg) {
              currentMarkerDevices.push(_inFloorImg);
            });
          });
          console.info(currentMarkerDevices);
        };

        $scope.$on("draggable:start", function(e, _data) {
          $scope.currentDragingDevice = _data.data;
          isdraging = true;
        });

        var changeMarkeredDevices = function(_flag) {
          // console.info(isMarkedDevices);
          if (isMarkedDevices.length === 0) return;
          _.each(currentMarkerDevices, function(_device) {
            for (var i = isMarkedDevices.length - 1; i >= 0; i--) {
              if (_device.deviceid === isMarkedDevices[i]) {
                _device.isMarked = _flag;
              }
            };
          })
        };
        var changeDragMarkers = function() {
          // console.info(dragMarkerDevices);
          if (dragMarkerDevices.length === 0) return;
          _.each(dragMarkerDevices, function(_device) {
            _device.isMarked = false;
          })
        }
        $scope.showGisMap = function() {
          changeMarkeredDevices(true);
          changeDragMarkers();
          dragMarkerDevices = [];
          isMarkedDevices = [];

          if (videoPlayerManager) videoPlayerManager.destroy();
          $scope.$emit("currentBuildMarker", $scope.currentMarker);
        };
        $scope.onDropComplete = function(_data, e) {
          if (!_data) return;
          isdraging = false;
          if (_data.isMarked) {
            var _device = $scope.currentDragingDevice;
            _device.top = addMarkerPostionY;
            _device.left = addMarkerPostionX;
            updateBuildData("updateFloorImgDev", _device);
          } else {
            ischange = false;
            var icon_src = "/public/images/gismap/map-type-";
            var _device = $scope.currentDragingDevice;
            var icon_src = "/public/images/gismap/map-type-";
            if ((_device.status & 0x100) !== 0 && _device.devStatus !== "offline") {
              icon_src += "cloud.png";
            } else if (_device.devStatus === "offline") {
              icon_src += "xiaohei-gray-n.png";
            } else if (_device.devStatus !== "offline") {
              icon_src += "xiaohei-n.png";
            }
            _device.top = addMarkerPostionY;
            _device.left = addMarkerPostionX;
            _device.isMarked = true;
            _device.src = icon_src;
            _device.drag = true;
            $scope.currentFloorImage.device.push(_device);
            dragMarkerDevices.push(_device);
            updateBuildData("addFloorImgDev", _device);
            $scope.$apply();
          }
        };

        $(document).bind("mousemove touchmove", function(e) {
          if (!$scope.showBuildingManage || !$scope.treeCurrentDevice) return;
          var _x = $scope.isIpad ? e.originalEvent.changedTouches[0].pageX : e.pageX;
          var _y = $scope.isIpad ? e.originalEvent.changedTouches[0].pageY : e.pageY;

          var $target = $(e.target);
          // var _xi = $target.offset().left;// + 15 - _x ;
          // var _yi = $target.offset().top;// + 25 - _y;
          // // _x,_y
          // var _xp = $target.offset().left + 15;
          // var _yp = $target.offset().top + 25;
          // _x - $target.offset().left;
          // _y - $target.offset().top;


          addMarkerPostionX = (_x - $('.showImg').offset().left - (_x - $target.offset().left)) / $('.showImg').width(); //获取当前鼠标相对img的X坐标  
          addMarkerPostionY = (_y - $('.showImg').offset().top - (_y - $target.offset().top)) / $('.showImg').height(); //获取当前鼠标相对img的Y坐标  



          if ($scope.treeCurrentDevice.isMarked) return;

          if ($('.drag-over').length !== 0 && !$scope.treeCurrentDevice.isMarked && e.target) {
            console.info($('.drag-over').outerWidth(), e.pageX);
            $('.drag-over').css("left", $scope.treeCurrentDevice.treeleft);
          }
          $scope.treeCurrentDevice.top = addMarkerPostionY;
          $scope.treeCurrentDevice.left = addMarkerPostionX;
        });
        $(document).bind("mouseup touchend", function(e) {
          if (!$scope.treeCurrentDevice || $scope.treeCurrentDevice.isMarked || !$scope.showBuildingManage) return;
          var _x = $scope.isIpad ? e.originalEvent.changedTouches[0].pageX : e.pageX;
          var _y = $scope.isIpad ? e.originalEvent.changedTouches[0].pageY : e.pageY;
          addMarkerPostionX = (_x - $('.showImg').offset().left - 9.5) / $('.showImg').width(); //获取当前鼠标相对img的X坐标  
          addMarkerPostionY = (_y - $('.showImg').offset().top - 13.5) / $('.showImg').height(); //获取当前鼠标相对img的Y坐标  
          $scope.treeCurrentDevice.top = addMarkerPostionY;
          $scope.treeCurrentDevice.left = addMarkerPostionX;
        });

        var getbuildData = function() {
          var preview = [];
          updatedBuildData = {
            location: $scope.currentMarkerData.location,
            name: $scope.currentMarkerData.marker.name,
            intro: $scope.currentMarkerData.marker.intro,
            type: $scope.currentMarkerData.type || 0,
            bid: $scope.currentMarkerData.marker.bid || "",
            maxfloor: 2,
            minfloor: -2,
            preview: []
          };
          // preview  : $scope.currentMarkerData.marker.preview || []
          if (_.isEmpty($scope.currentMarkerData.marker.bid)) return;

          updatedBuildData.bid = $scope.currentMarkerData.marker.bid
          updatedBuildData.maxfloor = $scope.currentMarkerData.marker.maxfloor;
          updatedBuildData.minfloor = $scope.currentMarkerData.marker.minfloor;
          updatedBuildData.type = $scope.currentMarkerData.marker.currentSceneId;

          _.each($scope.currentMarkerData.marker.preview, function(_floorImg) {
            var device = [];
            _.each(_floorImg.device || [], function(_inFloorImg) {
              device.push({
                "deviceid": _inFloorImg.deviceid,
                "left": _inFloorImg.left,
                "top": _inFloorImg.top
              })
            })
            preview.push({
              "pid": _floorImg.pid,
              "floor": _floorImg.floor,
              "device": device
            });
          })
          updatedBuildData.preview = preview;
        };
        var updateBuildData = function(_type, _data) {
          if (_type === "floors") {
            //修改楼层数据          
            updatedBuildData.type = $scope.sceneData.currentSceneId;
            updatedBuildData.maxfloor = $scope.sceneData.maxfloor;
            updatedBuildData.minfloor = $scope.sceneData.minfloor;
            for (var i = updatedBuildData.preview.length - 1; i >= 0; i--) {
              var flag = false;
              if ($scope.sceneData.currentSceneId === "1") {
                if (parseInt(updatedBuildData.preview[i].floor) === 0 || parseInt(updatedBuildData.preview[i].floor) < parseInt($scope.sceneData.minfloor) || parseInt(updatedBuildData.preview[i].floor) > parseInt($scope.sceneData.maxfloor)) {
                  flag = true;
                }
              } else if ($scope.sceneData.currentSceneId === "0") {
                if (parseInt(updatedBuildData.preview[i].floor) < parseInt($scope.sceneData.minfloor) || parseInt(updatedBuildData.preview[i].floor) > parseInt($scope.sceneData.maxfloor)) {
                  flag = true;
                }
              } else {
                if (parseInt(updatedBuildData.preview[i].floor) !== 0) {
                  flag = true;
                }
              }

              if (flag) {
                for (var j = updatedBuildData.preview[i].device.length - 1; j >= 0; j--) {
                  updatedBuildData.preview[i].device.splice(j, 1);
                };
                updatedBuildData.preview.splice(i, 1);
              }
            }
          } else if (_type === "addFloorImg") {
            updatedBuildData.preview.push({
              "device": [],
              "pid": _data.pid,
              "floor": $scope.currentFloor.id
            });
          } else if (_type === "delFloorImg") {
            for (var i = updatedBuildData.preview.length - 1; i >= 0; i--) {
              if (updatedBuildData.preview[i].pid === _data.pid) {
                // for (var j = updatedBuildData.preview[i].device.length - 1; j >= 0; j--) {
                //   updatedBuildData.preview[i].device.splice(j, 1);
                // };
                updatedBuildData.preview.splice(i, 1);
              }
            }
          } else if (_type === "updateFloorImgDev") {
            var isFind = false;
            for (var i = 0; i < updatedBuildData.preview.length; i++) {
              for (var j = 0; j < updatedBuildData.preview[i].device.length; j++) {
                if (updatedBuildData.preview[i].device[j].deviceid === _data.deviceid) {
                  updatedBuildData.preview[i].device[j].left = _data.left;
                  updatedBuildData.preview[i].device[j].top = _data.top;
                  isFind = true;
                  break;
                }
              }
              if (isFind) break;
            };
          } else if (_type === "addFloorImgDev") {
            for (var i = 0; i < updatedBuildData.preview.length; i++) {
              if (updatedBuildData.preview[i].pid === $scope.currentFloorImage.pid) {
                updatedBuildData.preview[i].device.push({
                  "deviceid": _data.deviceid,
                  "left": _data.left,
                  "top": _data.top
                });
                break;
              }
            };
          } else if (_type === "delFloorImgDev") {
            var isFind = false;
            for (var i = 0; i < updatedBuildData.preview.length; i++) {
              if (updatedBuildData.preview[i].pid === $scope.currentFloorImage.pid) {
                for (var j = 0; j < updatedBuildData.preview[i].device.length; j++) {
                  if (updatedBuildData.preview[i].device[j].deviceid === _data) {
                    updatedBuildData.preview[i].device.splice(j, 1);
                    isFind = true;
                    break;
                  }
                };
                if (isFind) break;
              }
            };
          }
          console.info(updatedBuildData);
        };
        var initBuildImg = function(_flag) {
          if (_flag) $scope.currentMarkerData = _.clone($scope.currentMarker.getExtData());
          isSaved = false;
          $scope.sceneData = {
            currentSceneId: "0",
            scenes: [{
              id: "0",
              name: "室内和室外"
            }, {
              id: "1",
              name: "室内"
            }, {
              id: "2",
              name: "室外"
            }],
            minfloor: "-2",
            maxfloor: "2",
            floors: {},
            currentFloorImages: [],
            currentFloorImage: ""
          }
          $scope.currentFloorImage = "";
          $scope.floors = [{
            id: "0",
            name: "室外"
          }];
          $scope.currentFloor = $scope.floors[0];

          getbuildData();
          if (_.isEmpty($scope.currentMarkerData.marker.bid)) {
            loadFloor();
            return;
          }
          //初始化楼层
          $scope.sceneData.minfloor = $scope.currentMarkerData.marker.minfloor || -2;
          $scope.sceneData.maxfloor = $scope.currentMarkerData.marker.maxfloor || 2;
          $scope.sceneData.currentSceneId = $scope.currentMarkerData.marker.type || 0;

          loadFloor();
          if ($scope.currentMarkerData.marker.preview && $scope.currentMarkerData.marker.preview.length !== 0) {
            $scope.sceneData.floors = _.groupBy($scope.currentMarkerData.marker.preview, "floor");

            //获取第一层的第一张图片
            for (var floor in $scope.sceneData.floors) {
              $scope.sceneData.currentFloorImages = $scope.sceneData.floors[floor];

              break;
            }
            changeImgWrap($scope.sceneData.currentFloorImages[0]);
            // $scope.currentFloorImage = $scope.sceneData.currentFloorImages[0];
            $scope.currentFloor = getFloor($scope.currentFloorImage.floor);

            var img = new Image();
            var noload = false;
            img.src = $scope.prefix + $scope.currentFloorImage.image;

            //获取楼层上的摄像机
            $scope.showImageDevices();
            // }
          }
        };

        var setMarkersDraggable = function() {
          if (!$scope.currentFloorImage) return;
          for (var i = 0; i < $scope.currentFloorImage.device.length; i++) {
            if ($scope.editable) $scope.currentFloorImage.device[i].drag = true;
            else $scope.currentFloorImage.device[i].drag = false;
          }
        }
        $scope.showImageDevices = function(_image) {
          changeImgWrap(_image || $scope.currentFloorImage);
          if (!$scope.currentFloorImage) return;
          for (var i = 0; i < $scope.currentFloorImage.device.length; i++) {
            var icon_src = "/public/images/gismap/map-type-";
            var _device = $scope.currentFloorImage.device[i];
            if ((_device.status & 0x100) !== 0 && _device.devStatus !== "offline") {
              icon_src += "cloud.png";
            } else if (_device.devStatus === "offline") {
              icon_src += "xiaohei-gray-n.png";
            } else if (_device.devStatus !== "offline") {
              icon_src += "xiaohei-n.png";
            }

            // if (device.device_type === 1) {
            //   icon_src += "xiaohei.png";
            // } else if (device.device_type === 2) {
            //   icon_src += "dawei.png";
            // } else {
            //   icon_src += "gun.png";
            // };
            if ($scope.editable) $scope.currentFloorImage.device[i].drag = true;
            else $scope.currentFloorImage.device[i].drag = false;
            $scope.currentFloorImage.device[i].src = icon_src;
          }
        };
        $scope.delFloorImgDev = function() {
          $scope.showLive = false;
          for (var i = 0; i < $scope.currentFloorImage.device.length; i++) {
            var _device = $scope.currentFloorImage.device[i];
            if (_device.deviceid === $scope.currentDevice.deviceid) {
              $scope.currentFloorImage.device.splice(i, 1);
              $scope.currentDevice.isMarked = false;
              isMarkedDevices.push($scope.currentDevice.deviceid);
              if (videoPlayerManager) videoPlayerManager.destroy();
              break;
            }
          };
          changeMarkeredDevices(false);
          updateBuildData("delFloorImgDev", $scope.currentDevice.deviceid);
        };
        $scope.getStyle = function(_img) {
          return {
            "background-image": 'url("' + $scope.prefix + _img.image + '")',
            "background-repeat": "no-repeat",
            "background-position": "center center",
            "background-size": "cover"
          }
        };
        $scope.editBuildFloors = function() {
          $scope.showModal = true;
          if ($scope.sceneData.currentSceneId === "2") {
            $scope.sceneData.minfloor = "";
            $scope.sceneData.maxfloor = "";
          }
        };
        $scope.toggleEnableEdit = function() {
          $scope.editable = true; //!$scope.editable;
          $scope.showLive = false;
          $scope.$emit("showAddMark", $scope.editable);
          setMarkersDraggable();
        };
        $scope.openLive = function(e, _device) {
          if (isdraging) return;
          if (videoPlayerManager) videoPlayerManager.destroy();
          var markerPositionTop = $(e.target.parentElement).position().top;
          var markerPositionLeft = $(e.target.parentElement).position().left;
          var windowHeight = $element.find(".show-live").height();
          var windowWidth = $element.find(".show-live").width();
          var left = $(e.target.parentElement).offset().left - $(".img-content").offset().left;
          var right = $("body").width() - $(e.target.parentElement).offset().left - $(e.target.parentElement).width() - ($("body").width() - $(".img-content").offset().left - $(".img-content").width());
          var bottom = $("body").height() - $(e.target.parentElement).offset().top - $(e.target.parentElement).height() - ($("body").height() - $(".img-content").offset().top - $(".img-content").height());
          $scope.currentDevice = _device;
          initVideo(_device);
          if (markerPositionTop > windowHeight) {
            $element.find(".show-live").css({
              'top': markerPositionTop - windowHeight
            })
          } else {
            $element.find(".show-live").css({
              'top': bottom >= windowHeight ? markerPositionTop + 27 : markerPositionTop + 27 - windowHeight / 2
            })
          }
          if (markerPositionLeft > windowWidth) {
            $element.find(".show-live").css({
              'left': markerPositionLeft - windowWidth + 10
            })
          } else {
            $element.find(".show-live").css({
              'left': markerPositionLeft + 10
            })
          }
          $scope.showLive = true;
        };

        $scope.showMonitor = function() {
          window.open(window.location.origin + "/monitor/" + $scope.currentDevice.deviceid);
        }

        $scope.closeLive = function() {
          if (videoPlayerManager) videoPlayerManager.destroy();
          $scope.showLive = false;
        }
        var loadFloor = function() {
          floors = [];
          if ($scope.sceneData.currentSceneId === "1" || $scope.sceneData.currentSceneId === "0") {
            for (var i = Number($scope.sceneData.minfloor), j = $scope.sceneData.minfloor; i <= Number($scope.sceneData.maxfloor); i++, j++) {
              if (i < 0) floors.push({
                id: j + "",
                name: "B" + Math.abs(i)
              });
              else if (i === 0) {
                // j++;
                continue;
              } else floors.push({
                id: j + "",
                name: "F" + i
              });
            };
          }
          if ($scope.sceneData.currentSceneId === "2" || $scope.sceneData.currentSceneId === "0") {
            floors.push({
              id: "0",
              name: "室外"
            })
          }
          if (!$scope.currentFloor || $scope.currentFloor.id < $scope.sceneData.minfloor || $scope.currentFloor.id > $scope.sceneData.maxfloor) {
            $scope.currentFloor = floors[0];
          }
          $scope.floors = floors;
        }
        var delFloors = function() {
          for (var floor in $scope.sceneData.floors) {
            var flag = false;
            if ($scope.sceneData.currentSceneId === "1") {
              if (parseInt(floor) === 0 || parseInt(floor) < parseInt($scope.sceneData.minfloor) || parseInt(floor) > parseInt($scope.sceneData.maxfloor)) {
                flag = true;
              }
            } else if ($scope.sceneData.currentSceneId === "0") {
              if (parseInt(floor) < parseInt($scope.sceneData.minfloor) || parseInt(floor) > parseInt($scope.sceneData.maxfloor)) {
                flag = true;
              }
            } else {
              if (parseInt(floor) !== 0) {
                flag = true;
              }
            }
            if (flag) {
              for (var j = $scope.sceneData.floors[floor].length - 1; j >= 0; j--) {
                for (var k = $scope.sceneData.floors[floor][j].device.length - 1; k >= 0; k--) {
                  $scope.sceneData.floors[floor][j].device[k].isMarked = false;
                  isMarkedDevices.push($scope.sceneData.floors[floor][j].device[k].deviceid);
                  $scope.sceneData.floors[floor][j].device.splice(k, 1);
                }
              }
              delete $scope.sceneData.floors[floor];
            }
          }

          changeMarkeredDevices(false);
          if (JSON.stringify($scope.sceneData.floors) !== "{}") {
            for (var floor in $scope.sceneData.floors) {
              $scope.sceneData.currentFloorImages = $scope.sceneData.floors[floor];
              break;
            }
            $scope.currentFloorImage = $scope.sceneData.currentFloorImages[0];
            $scope.currentFloor = getFloor($scope.currentFloorImage.floor);

            $scope.showImageDevices();
          } else if ($scope.floors.length > 0) {
            $scope.currentFloor = $scope.floors[0];
            $scope.sceneData.currentFloorImages = [];
            $scope.currentFloorImage = "";
          }
          changeDragMarkers();
          updateBuildData("floors");
        }
        var getFloor = function(_floorId) {
          var floor;
          _.each($scope.floors, function(_floor) {
            if (_floor.id === _floorId) {
              floor = _floor;
              return false;
            }
          })
          return floor;
        };
        var adjustImgSize = function(img, boxWidth, boxHeight) {
          var tempImg = img;
          var imgWidth = tempImg.width;
          var imgHeight = tempImg.height;

          if ((boxWidth / boxHeight) >= (imgWidth / imgHeight)) {
            $(".img-content").width((boxHeight * imgWidth) / imgHeight);
            $(".img-content").height(boxHeight);
            $(".img-content").css("margin-top", 0);
            var margin = (boxWidth - $(".img-content").width()) / 2;
          } else {
            $(".img-content").width(boxWidth);
            $(".img-content").height((boxWidth * imgHeight) / imgWidth);
            var margin = (boxHeight - $(".img-content").height()) / 2;
            $(".img-content").css("margin-top", margin);
          }
        };
        var changeImgWrap = function(_img, $wrap) {
          if (!_img) {
            $scope.currentFloorImage = _img;
            return;
          }
          var url = $scope.prefix + _img.image;
          var img = new Image();
          var h = $('.wrap').height();
          img.src = url;
          img.onerror = function() {
            // alert(name + " 图片加载失败，请检查url是否正确");
            return false;
          };
          if (!h) {
            $element.find(".sl>.wrap").css("height", $element.find(".sl").height());
            // h = $('.wrap').height();
          }
          if (img.complete) {
            // console.log(img.width + " " + img.height);
            adjustImgSize(img, $('.wrap').width(), $('.wrap').height());
            $scope.currentFloorImage = _img;
            // $scope.$apply();
          } else {
            img.onload = function() {
              console.log(img.width + " " + img.height);
              adjustImgSize(img, $('.wrap').width(), $('.wrap').height());
              $scope.currentFloorImage = _img;
              $scope.$apply();
              img.onload = null; //避免重复加载
            }
          }
        };
        var uploader = WebUploader.create({
          auto: true,
          swf: '/public/js/ui/WebUploader/Uploader.swf',
          server: CURRENT_PROJECT_MODE === 'test' ? 'http://www.iermu.com:8006/api/v2/map/building' : 'https://www.iermu.com/api/v2/map/building',
          pick: '#filePicker',
          fileVal: "upfile",

          formData: {
            method: 'preview'
          },
          duplicate: true,
          accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: '*/*'
          },
          fileSingleSizeLimit: '8000000',
          method: 'POST',
        });
        uploader.on("error", function(type) {
          if (type == "Q_TYPE_DENIED") {
            AppLog.error("请上传正确的图片文件", 1);
          } else if (type == "F_EXCEED_SIZE") {
            AppLog.error("图片大小不能超过8M", 1);
          }
        });
        uploader.on('fileQueued', function(file) { // webuploader事件.当选择文件后，文件被加载到文件队列中，触发该事件。等效于 uploader.onFileueued = function(file){...} ，类似js的事件定义。  
          if ($scope.isUploading) {
            AppLog.error("图片上传中", 1);
            return;
          }
        });
        // 文件上传过程中创建进度条实时显示。  
        uploader.on('uploadStart', function(file, percentage) {
          $scope.isUploading = true;
          if (!$scope.currentFloorImage) {
            $scope.imgIsLoadding = true;
            $scope.$apply();
          }
        });

        // 文件上传成功，给item添加成功class, 用样式标记上传成功。  
        uploader.on('uploadSuccess', function(file, data) {

          $element.find("ul.floorImgs li:nth-child(3)").animate({
            marginTop: "0"
          }, 10);
          // data = JSON.parse(data);

          $scope.isUploading = false;
          $scope.sceneData.currentFloorImages.unshift({
            "device": [],
            "pid": data.pid,
            "floor": $scope.currentFloor.id,
            "image": data.image
          });
          $scope.sceneData.floors[$scope.currentFloor.id] = $scope.sceneData.currentFloorImages;
          if (!$scope.currentFloorImage) {
            $scope.imgIsLoadding = true;
            // $scope.currentFloorImage = $scope.sceneData.currentFloorImages[0];
            changeImgWrap($scope.sceneData.currentFloorImages[0]);
            $scope.$apply();
          }

          $scope.imgIsLoadding2 = true;
          $element.find(".showImg")[0].onload = function(e) {
            $scope.imgIsLoadding = false;
            $scope.$apply();
          }

          $scope.$apply();
          $element.find(".showthum")[0].onload = function(e) {
            $scope.imgIsLoadding2 = false;
            $scope.$apply();
          }
          updateBuildData("addFloorImg", data);
        });

        // 文件上传失败，显示上传出错。  
        uploader.on('uploadError', function(file) {
          $scope.isUploading = false;
        });

        // 完成上传完了，成功或者失败，先删除进度条。  
        uploader.on('uploadComplete', function(file) {
          console.info("唯一标识:" + file.id + "\r\n" +
            "文件名：" + file.name + "\r\n" +
            "文件大小：" + file.size + "\r\n" +
            "创建时间：" + file.creationdate + "\r\n" +
            "最后修改时间：" + file.modificationdate + "\r\n" +
            "文件类型：" + file.type
          );
        });
        $scope.setImgStyle = function(item, e) {
          if (!item) return;
          var url = $scope.prefix + item.image;
          var img = new Image();
          img.src = url;

          var tempImg = img;
          var imgWidth = tempImg.width;
          var imgHeight = tempImg.height;
          if (imgWidth > imgHeight) {
            console.info(1111);
          } else {
            console.info(222);
          }
          // if ((boxWidth / boxHeight) >= (imgWidth / imgHeight)) {
          //   $img.width((boxHeight * imgWidth) / imgHeight);
          //   $img.height(boxHeight);
          //   $img.css("margin-top", 0);
          //   var margin = (boxWidth - $img.width()) / 2;
          // } else {
          //   $img.width(boxWidth);
          //   $img.height((boxWidth * imgHeight) / imgWidth);
          //   var margin = (boxHeight - $img.height()) / 2;
          //   $img.css("margin-top", margin);
          // }


        };
        $scope.save = function() {
          if (videoPlayerManager) videoPlayerManager.destroy();
          $scope.showLive = false;
          var params = {
            name: updatedBuildData.name,
            intro: updatedBuildData.intro,
            type: updatedBuildData.type,
            minfloor: updatedBuildData.minfloor,
            maxfloor: updatedBuildData.maxfloor,
            location: JSON.stringify(updatedBuildData.location),
            preview: JSON.stringify(updatedBuildData.preview),
            bid: updatedBuildData.bid
          }
          ProfileService.addMapBulid(params).then(function(_data) {
            AppLog.info("楼宇信息保存成功！", 1);

            $scope.currentMarker.getExtData().marker.type = _data.marker.type;
            $scope.currentMarker.getExtData().marker.bid = _data.marker.bid;
            updatedBuildData.bid = _data.marker.bid;
            $scope.currentMarker.getExtData().marker.maxfloor = _data.marker.maxfloor;
            $scope.currentMarker.getExtData().marker.minfloor = _data.marker.minfloor;
            if (JSON.stringify($scope.sceneData.floors) === "{}") return;
            isMarkedDevices = [];
            dragMarkerDevices = [];
            $scope.currentMarker.getExtData().marker.preview = [];
            for (var floor in $scope.sceneData.floors) {
              for (var i = $scope.sceneData.floors[floor].length - 1; i >= 0; i--) {
                $scope.currentMarker.getExtData().marker.preview.push($scope.sceneData.floors[floor][i]);
              }
            }


            isMarkedDevices = [];
            isSaved = true;
          })
          $scope.editable = false;
          $scope.$emit("showAddMark", $scope.editable);
          setMarkersDraggable();
        };
        $scope.cancel = function() {
          $scope.editable = false;
          $scope.showLive = false;
          closeCameraWindow();
          closeInfoWindow();
          $scope.$emit("showAddMark", $scope.editable);
          setMarkersDraggable();
          initBuildImg(true);
          changeMarkeredDevices(true);
          changeDragMarkers();
          dragMarkerDevices = [];
          isMarkedDevices = [];
          // updatedBuildData = {};
          // $scope.categorysBindData();
        };
        $scope.fullscreen = function() {
          $scope.isFullscreen = !$scope.isFullscreen;
          $scope.$emit("isFullscreen", $scope.isFullscreen);
        };

        $scope.selectFloor = function(_floor) {
          $scope.currentFloor = _floor;
          $scope.sceneData.currentFloorImages = $scope.sceneData.floors[_floor.id] || [];
          if ($scope.sceneData.currentFloorImages) {
            $scope.currentFloorImage = $scope.sceneData.currentFloorImages[0];
            changeImgWrap($scope.sceneData.currentFloorImages[0]);
            $scope.showImageDevices();
          } else {
            $scope.currentFloorImage = [];
          }
        };
        $scope.floorImgsUp = function() {
          if ($scope.sceneData.currentFloorImages.length === 0) return;
          var unitTop = $(".image-item").outerHeight() + Number($(".image-item").css("margin-bottom").replace("px", ""));
          floorsImgTop = Number($element.find("ul.floorImgs li:nth-child(3)").css("marginTop").replace('px', ''));
          if (floorsImgTop <= -unitTop) {
            floorsImgTop += unitTop;
            $element.find("ul.floorImgs li:nth-child(3)").animate({
              marginTop: floorsImgTop + 'px'
            }, 10);
          }
        }
        $scope.floorImgsDown = function() {
          if ($scope.sceneData.currentFloorImages.length === 0) return;
          // var maxTop = ($scope.floors.length - 6) * -30;
          var unitTop = $(".image-item").outerHeight() + Number($(".image-item").css("margin-bottom").replace("px", ""));
          var ulHeight = $element.find(".ul-wrap").height();
          var lastlitop = $element.find("ul.floorImgs li:last-child").offset().top;
          var ultop = $element.find("ul.floorImgs").offset().top;
          if (lastlitop + unitTop < ulHeight + ultop) return;
          floorsImgTop = Number($element.find("ul.floorImgs li:nth-child(3)").css("marginTop").replace('px', ''));
          if (floorsImgTop <= 0) {
            floorsImgTop -= unitTop;
            $element.find("ul.floorImgs li:nth-child(3)").animate({
              marginTop: floorsImgTop + 'px'
            }, 10);
          }
        }
        $scope.floorDown = function() {
          var maxTop = ($scope.floors.length - 6) * -30;
          floorsTop = Number($element.find("ul.floors li:first").css("marginTop").replace('px', ''));
          if (floorsTop <= 0 && floorsTop > maxTop) {
            floorsTop -= 30;
            $element.find("ul.floors li:first").animate({
              marginTop: floorsTop + 'px'
            }, 15);
          }
        };
        $scope.submitDelFloorImg = function(_img) {
          $scope.delFloorImgData = _img;
          $scope.showModal2 = true;
        }
        $scope.delFloorImgCancel = function() {
          $scope.showModal2 = false;
          $scope.delFloorImg = "";
        }
        $scope.delFloorImg = function(_img, $event) {
          $event.stopPropagation();
          for (var i = _img.device.length - 1; i >= 0; i--) {
            _img.device[i].isMarked = false;
          }
          for (var i = $scope.sceneData.currentFloorImages.length - 1; i >= 0; i--) {
            if ($scope.sceneData.currentFloorImages[i].pid === _img.pid) {
              for (var j = $scope.sceneData.currentFloorImages[i].device.length - 1; j >= 0; j--) {
                isMarkedDevices.push($scope.sceneData.currentFloorImages[i].device[j].deviceid);
                $scope.sceneData.currentFloorImages[i].device.splice(j, 1);
              };
              $scope.sceneData.currentFloorImages.splice(i, 1);
            };
          };
          changeMarkeredDevices(false);
          changeDragMarkers();
          if (_img.pid === $scope.currentFloorImage.pid) {
            if ($scope.sceneData.currentFloorImages.length === 0) {
              $scope.currentFloorImage = "";

            } else {
              changeImgWrap($scope.sceneData.currentFloorImages[0]);
            }
          }
          updateBuildData("delFloorImg", _img);
          $scope.showModal2 = false;
        }
        $scope.floorUp = function() {
          floorsTop = Number($element.find("ul.floors li:first").css("marginTop").replace('px', ''));
          if (floorsTop <= -30) {
            floorsTop += 30;
            $element.find("ul.floors li:first").animate({
              marginTop: floorsTop + 'px'
            }, 15);
          }
        }
        $scope.floorChange = function() {
          // alert($scope.sceneData.currentSceneId);
          if ($scope.sceneData.currentSceneId === "0" || $scope.sceneData.currentSceneId === "1") {
            $scope.sceneData.minfloor = -2;
            $scope.sceneData.maxfloor = 2;
            $scope.isdisable = false;
          } else {
            $scope.isdisable = true;
            $scope.sceneData.minfloor = "";
            $scope.sceneData.maxfloor = "";
          }
        }
        $scope.sceneCancel = function() {
          $scope.showModal = false;
          $scope.sceneData.minfloor = -2;
          $scope.sceneData.maxfloor = 2;
          $scope.sceneData.currentSceneId = "0";
          if (_.isEmpty($scope.currentMarkerData.marker.bid)) return;
          //初始化楼层
          $scope.sceneData.minfloor = $scope.currentMarkerData.marker.minfloor || -2;
          $scope.sceneData.maxfloor = $scope.currentMarkerData.marker.maxfloor || 2;
          $scope.sceneData.currentSceneId = $scope.currentMarkerData.marker.type || "0";
        };
        $scope.sceneSubmit = function() {
          if ($scope.sceneData.currentSceneId === "0" || $scope.sceneData.currentSceneId === "1") {
            var reg = /^-?\d+$/;
            if (!reg.test($scope.sceneData.minfloor) || !reg.test($scope.sceneData.maxfloor)) {
              AppLog.error("请输入合法数字", 1);
              return;
            }
            if (parseInt($scope.sceneData.minfloor) > parseInt($scope.sceneData.maxfloor)) {
              AppLog.error("起始楼层不能大于结束楼层", 1);
              return;
            }
          }
          loadFloor();
          delFloors();
          // updateBuildData("floor");
          $scope.showModal = false;
        };

        var initVideo = function(_deviceInfo) {
          $target = $element.find(".info-content");
          targetClass = $target[0].className.split(" ")[0];
          $target.empty();
          $target.removeClass().addClass(targetClass);
          if (videoPlayerManager) videoPlayerManager.destroy();
          var w = $(".context .info .info-content").width();
          videoPlayerManager = new VideoPlayer({
            language: CURRENT_PROJECT_LANGUAGE,
            plugins: [""],
            container: $element.find(".info-content"),
            width: w,
            height: w * 9 / 16,
            isPrivate: true,
            showMenu: false
          });
          videoPlayerManager.bindData(_deviceInfo);
        };
      };

      var init = function() {
        updateImgDevices,
        delImgDevices = [];
        updatedBuildData = {};
        $scope.building = null;
        $scope.currentFloor = {};
        $scope.editable = false;
        $scope.imgIsLoadding2 = false;

        $scope.images = [];
        $scope.prefix = CURRENT_PROJECT_MODE === "develop" ? "/public/images/gismap/test/" : "http://www.iermu.com:8082/";
        floorsTop = 0,
        floors = [];
        $scope.sceneData = {
          currentSceneId: "0",
          scenes: [{
            id: "0",
            name: "室内和室外"
          }, {
            id: "1",
            name: "室内"
          }, {
            id: "2",
            name: "室外"
          }],
          minfloor: "-3",
          maxfloor: "8",
          floors: {},
          currentFloorImages: [],
          currentFloorImage: ""
        }



        bindEvent();
      };

      init();
    }
  ]);
});