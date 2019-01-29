define(["app", "d_modal", "emobile"], function(Directives) { //, "angularAnimate"
  Directives.directive("cameraTreeList", ["ProfileService", "$timeout",
    function(ProfileService, $timeout) {
      return {
        template: CURRENT_PROJECT_DIRECTIVES["d-camera-tree-list"],
        restrict: "A",
        replace: true,
        transclude: false,
        scope: {
          enableRudder: "=",
          videoPlayerManager: "=?",

          showAddMark: "=",
          onSelectItem: "=?",
          selectItem: "=?",
          multiType: "=",
          onSelectCategorys: "=?",
          cancelSelectCategorys: "=?",
          setMulti: "=?",
          single: "=?",

          setMap: "=?",
          editAble: "=?",
          multiCids: "=?",
          getCamerasByCids: "=?",
          videosList: "=?",
          categories: "=?",
          changeDraggingIcon: "=?",
          isInMap: "=?",
          categorysBindData: "=?",
          treeCurrentDevice: "=?",
          markerList: "=?",
          selectCamera: "=?"
        },
        link: function($scope, $elem, $attr) {
          var caVideosList, allVideosList;
          var currentEditCategory, categoryName;
          var playingCameraIds;
          var isLoading;
          var languages = {
            "zh-cn": {
              "lp1": "摄像机删除成功",
              "lp2": "请输入摄像机分类名称!",
              "lp3": "字数不能超过10个!",
              "lp4": "请选择摄像机!",
              "lp5": "摄像机分类删除成功",
              "lp6": "摄像机分类修改成功",
              "lp7": "摄像机分类添加成功",
              "lpy1": "保存成功！",
              "lpy2": "参数设置失败，请重试！",
              "lpy3": "请设置参数！",
              "lpy4": "预置位修改失败！",
              "lpy5": "预置位添加失败！",
              "lpy6": "预置位修改成功！",
              "lpy7": "预置位添加成功！",
              "lpy8": "预置位删除失败！",
              "lpy9": "预置位删除成功！",
              "lpy10": "请停止云台自动旋转！",
              "lpy11": "常用位置不能多于6个！",
              "lpy15": "请输入常用位置名称！",
              "lpy16": "获取预置位缩略图失败！"
            },
            "en": {
              "lp1": "摄像机删除成功",
              "lp2": "Please enter a video camera to classify the names",
              "lp3": "Words can not exceed 10",
              "lp4": "Please select a camera!",
              "lp5": "摄像机分类删除成功",
              "lp6": "摄像机分类修改成功",
              "lp7": "摄像机分类添加成功",
              "lpy1": "Save success",
              "lpy2": "Parameter setting failed, please try again!",
              "lpy3": "Please set parameters!",
              "lpy4": "Preset position modify failed.",
              "lpy5": "Preset position add failed.",
              "lpy6": "Preset position modify successfully.",
              "lpy7": "Preset position add successfully.",
              "lpy8": "Preset position delete failed.",
              "lpy9": "Preset position delete successfully.",
              "lpy10": "Please stop PTZ automatic rotation!",
              "lpy11": "Commonly used position can not be more than 6!",
              "lpy15": "Please enter the preset a name!",
              "lpy16": "获取预置位缩略图失败！"
            }
          };
          var playingCameras = [];
          var byCategoryData = [];
          $scope.multiCids = [];
          $scope.isAuto = false;

          // var myElement = document.getElementById('myElement');
          // var mc = new Hammer.Manager(myElement);

          var time = 0,
            touchtime = 0;
          $scope.aa = function() {
            // time++;
            // if (time === 1) {
            //   touchtime = new Date().getTime();
            // }
            // if (time === 2) {
            //   if ((new Date().getTime() - touchtime) < 500) {
            //     alert("dblclick");
            //   }
            //   time = 0;
            // }

            // alert(1);
          }

          $scope.dragCameraFn = function(e) {};
          $scope.cc = function() {
            // alert(3);
            //   var touchtime = new Date().getTime();
            // // $("#btn1").on("click", function() {
            //   console.info(new Date().getTime() - touchtime);
            //   if (new Date().getTime() - touchtime < 500) {

            //   } else {
            //     touchtime = new Date().getTime();
            //     console.log("click")
            //   }
            // });
          };
          $scope.categorysBindData = function() { //获取分类列表以及分类下的摄像机
            if (CURRENT_USERINFO.domain === 'zyy') {
              $scope.isZyy = true;
            }
            var categorysList = "",
              videoList = "",
              itemsMarkedList = "";
            var flag = 0,
              ci_no = {
                cid: "none",
                name: "未分组",
                cameraOnlineCount: 0,
                cameras: [],
                noCategory: true
              };
            var ci_all = {
              cid: "all",
              name: $scope.isZyy ? "智慧云眼" : "我的爱耳目",
              cameraOnlineCount: 0,
              cameras: [],
              allCategory: true
            }
            var params = {
              list_type: "all",
              data_type: "none"
            };
            if (isLoading) return;
            isLoading = true;
            $scope.videosList = "";
            caVideosList = [];
            allVideosList = [];
            byCategoryData = [];
            $scope.markerList = [];


            ProfileService.getMyCameraGroups({}).then(function(_data) {
              categorysList = _data.list;
            }).then(function(_data) {
              // bindDevInfoSum(true);
              ProfileService.getMyCameras(params).then(function(_data) {
                videoList = _data.list;
              }).then(function(_data) {
                ProfileService.getMapMarkerList().then(function(_data) {
                  itemsMarkedList = _data.list;
                  isLoading = false;
                  _.each(itemsMarkedList, function(_markedItem) {
                    if (_markedItem.marker.bid) { //获取电子地图上标记的楼宇
                      // _markedItem.marker.preview = _.groupBy(_markedItem.marker.preview, "floor");
                      _.each(_markedItem.marker.preview, function(_buildFloor) { //楼宇标记的
                        _.each(_buildFloor.device, function(_floorDevice, $index) {
                          _.each(videoList, function(_video) {
                            if (_floorDevice.deviceid === _video.deviceid) {
                              _video.isMarked = true;
                              _floorDevice.isMarked = true;
                              _floorDevice = _.extend(_video, _floorDevice);
                              _buildFloor.device[$index] = _floorDevice;
                            }
                          })
                        })
                      })
                      $scope.markerList.push(_markedItem);
                    } else {
                      _.each(videoList, function(_video) {
                        if (_video.deviceid === _markedItem.marker.deviceid) { //获取电子图上标注的摄像机
                          _video.isMarked = true;
                          _video = _.extend(_video, _markedItem.marker);
                          _markedItem.marker = _.extend(_video, _markedItem.marker)
                          $scope.markerList.push(_markedItem);
                        }
                      });
                    }
                  });

                  if (categorysList.length === 0) {
                    _.each(videoList, function(_video) {
                      if (!$scope.setMult && !$scope.setMap && CURRENT_PROJECT_DATA.meta && CURRENT_PROJECT_DATA.meta.deviceid === _video.deviceid) {
                        _video.checked = true;
                      }
                      ci_all.cameras.push(_video);
                      if (_video.status !== "0") { //统计非离线
                        ci_all.cameraOnlineCount++;
                      }
                      if (_video.cid.length === 0) {
                        ci_no.cameras.push(_video);
                        if (_video.status !== "0") { //统计非离线
                          ci_no.cameraOnlineCount++;
                        }
                      }
                    });
                  } else {
                    _.each(categorysList, function(_category) {
                      var cameras = [],
                        ci = {};
                      ci.cid = _category.cid;
                      ci.name = _category.category;
                      ci.cameraOnlineCount = 0;
                      flag++;
                      _.each(videoList, function(_video) {
                        if (!$scope.setMult && !$scope.setMap && CURRENT_PROJECT_DATA.meta && CURRENT_PROJECT_DATA.meta.deviceid === _video.deviceid) {
                          _video.checked = true;
                        }
                        if (_.contains(_video.cid, _category.cid)) {
                          cameras.push(_video);
                          if (_video.status !== "0") { //统计非离线
                            ci.cameraOnlineCount++;
                          }
                        }
                        if (flag === 1) { //未分组的摄像机
                          ci_all.cameras.push(_video);
                          if (_video.status !== "0") { //统计非离线
                            ci_all.cameraOnlineCount++;
                          }
                          if (_video.cid.length === 0) {
                            ci_no.cameras.push(_video);
                            if (_video.status !== "0") { //统计非离线
                              ci_no.cameraOnlineCount++;
                            }
                          }
                        };
                      });
                      ci.cameras = cameras;
                      caVideosList.push(ci);
                    });
                  }

                  caVideosList.push(ci_no);
                  allVideosList.push(ci_all);
                  $scope.videosList = ci_all.cameras;
                  if ($scope.showType === "all") {
                    $scope.categories = allVideosList;
                  } else {
                    $scope.categories = caVideosList;
                  }
                  byCategoryData = allVideosList.concat(caVideosList);
                  _.each($scope.categories, function(category) {
                    if (_.contains($scope.multiCids, category.cid)) {
                      category.checked = true;
                    } else {
                      category.checked = false;
                    }
                  });
                })
              });
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
            // $(document).bind("mousedown", function(){
            //   console.info(arguments[0].clientX);
            // })

            $scope.$on("draggable:start", function(e, _data) {
              $scope.treeCurrentDevice = _data.data;
              $scope.treeCurrentDevice.treeleft = _data.event.pageX - 19 / 2;
              $scope.$apply();
              // $scope.$broadcast("currentMarker", $scope.currentMarker);
            });
            $scope.onDragSuccess = function(data, evt) {};
            $scope.$on("draggable:end", function(e, _data) {
              $scope.treeCurrentDevice = null;
              $scope.$apply();
              // $scope.$broadcast("currentMarker", $scope.currentMarker);
            });
            $scope.changeDraggingIcon = function(_flag) {
              if ($scope.isInMap === _flag) return;
              if ($elem.find(".pic-type").hasClass('dragging')) {
                $scope.isInMap = _flag;
                $scope.$apply();
              }
            }
            $scope.getCamerasByCids = function(cids) {
              var camerasList = [];
              _.each($scope.categories, function(category) {
                if (_.contains(cids, category.cid) || cids[0] === "all") {
                  camerasList = camerasList.concat(category.cameras);
                }
              });
              return camerasList;
            };

            $scope.myFilter = function(item) {
              if ($scope.filterStatus === "offline") {
                return item.devStatus === "offline" && item.description.indexOf($scope.keywords) > -1;
              } else if ($scope.filterStatus === "off") {
                return item.devStatus === "shutdown" && item.description.indexOf($scope.keywords) > -1;
              } else if ($scope.filterStatus === "all") {
                return true && item.description.indexOf($scope.keywords) > -1;
              } else {
                return (item.devStatus !== "offline" && item.devStatus !== "shutdown") && item.description.indexOf($scope.keywords) > -1;
              }
            };

            $scope.filterByStatus = function(_status) {
              $scope.filterStatus = _status;
            };

            $scope.collapseCategory = function(_index) {
              if ($scope.collapseCategoryIndex === _index) {
                $scope.collapseCategoryIndex = -1;
                return;
              }
              $scope.collapseCategoryIndex = _index;
            };

            $scope.toggleShowType = function(_type) {
              if ($scope.showType === _type) return;
              $scope.showType = _type;
              $scope.filterStatus = "all";
              $timeout(function() {
                resize();
              }, 0, true);

              if ($scope.showType === "all") {
                $scope.categories = allVideosList;
              } else {
                $scope.categories = caVideosList;
              }
              if (!$scope.setMulti) return;
              _.each($scope.categories, function(category) {
                if (_.contains($scope.multiCids, category.cid)) {
                  category.checked = true;
                } else {
                  category.checked = false;
                }
              });
              // if ($scope.setMulti) $scope.cancelSelectCategorys();
            };

            $scope.filterByKeywords = function() {
              //todo: filter camera list
            };

            $scope.closeModal = function() {
              $scope.categoryModalVisible = false;
            }

            $scope.setListStyle = function(_camera) {
              if ((_camera.status & 0x100) !== 0) {
                if (_camera.devStatus === "offline") return "yuntai-offline"
                else return "yuntai-online"
              } else {
                if (_camera.devStatus === "offline") return "camera-offline"
                else return "camera-online"
              }
            };

            $scope.setMoveInMapStyle = function(_camera) {
              return "aaaa";
            }

            //编辑多画面
            $scope.selectCategorysFn = function(_category, $event) {
              $event.stopPropagation();
              if (!_.contains($scope.multiCids, _category.cid)) {
                if (_category.cid === "all" || $scope.multiCids[0] === "all") {
                  $scope.cancelSelectCategorys();
                }
                $scope.multiCids.push(_category.cid);
                _category.checked = true;
              } else {
                removeArr($scope.multiCids, _category.cid);
                _category.checked = false;
              }
              // getCamerasBycids($scope.multiCids);
              // $scope.onSelectCategorys($scope.multiCids,getCamerasBycids($scope.multiCids));
            }

            $scope.cancelSelectCategorys = function(_cids) {
              if (_cids) {
                $scope.multiCids = _cids;
                _.each($scope.categories, function(_category) {
                  if (_.contains($scope.multiCids, _category.cid)) {
                    _category.checked = true;
                  } else {
                    _category.checked = false;
                  }
                })
              }
              _.each($scope.categories, function(_category) {
                _category.checked = false;
              })
              $scope.multiCids = [];
              // $scope.onSelectCategorys($scope.multiCids,getCamerasBycids($scope.multiCids));
            };

            $(window).resize(function() {
              resize();
            });
          };

          var bindCategoryEvent = function() {
            $scope.searchFilter = function(item) {
              return item.description.indexOf($scope.currentEditCategory.searchName) > -1;
            }

            $scope.editCategoryModal = function(category, $event) {
              if ($event) $event.stopPropagation();
              $scope.categoryModalVisible = true;
              if (category) {
                currentEditCategory = category;
                $scope.currentEditCategory.categoryName = category.name;
                cameraIds = [];
                _.each(category.cameras, function(_camera) {
                  cameraIds.push(_camera.deviceid);
                  _camera.checkboxIschecked = true;
                })
              }
            };

            $scope.ckIschecked = function(_item) {
              _item.checkboxIschecked = !_item.checkboxIschecked;
              $scope.getSelectedIds(_item);
            };
            $scope.getSelectedIds = function(_item) {
              if (cameraIds.length !== 0) {
                removeArr(cameraIds, _item.deviceid); //_.difference
              }
              if (_item.checkboxIschecked) {
                cameraIds.push(_item.deviceid);
              }
            };

            //添加摄像机分类
            var rAddCategory = function() {
              ProfileService.addMyCameraGroups({
                deviceid: cameraIds.join(),
                category: $scope.currentEditCategory.categoryName
              }).then(function() {
                // $scope.isLoading = false;
                // $scope.isAddTag = false;
                $scope.categorysBindData();
                $scope.categoryModalVisible = false;
                cameraIds = [];
                $scope.currentEditCategory = {
                  categoryName: "",
                  searchName: ""
                };
                currentEditCategory = "";
                AppLog.error(languages[CURRENT_PROJECT_LANGUAGE].lp7, 1);
              });
            };
            var rUpdateCategory = function(categoryName, _t) { //删除分类下的摄像机
              ProfileService.addMyCameraGroups({
                method: "updatecategory",
                cid: currentEditCategory.cid,
                category: categoryName,
                deviceid: cameraIds.join()
              }).then(function() {
                if (_t) {
                  AppLog.error(languages[CURRENT_PROJECT_LANGUAGE].lp1, 1);
                } else {
                  $scope.categoryModalVisible = false;
                  AppLog.error(languages[CURRENT_PROJECT_LANGUAGE].lp6, 1);
                }
                cameraIds = [];
                currentEditCategory = "";
                $scope.categorysBindData();
                $scope.currentEditCategory = {
                  categoryName: "",
                  searchName: ""
                };
              });
            };

            $scope.cancelEditCategory = function() {
              $scope.categorysBindData();
              $scope.categoryModalVisible = false;
              $scope.currentEditCategory = {
                categoryName: "",
                searchName: ""
              };
              currentEditCategory = "";
              cameraIds = [];
            }

            //新增修改分类提交
            $scope.saveEditCategory = function() {
              categoryName = $scope.currentEditCategory.categoryName;
              if (categoryName.length === 0) {
                AppLog.error(languages[CURRENT_PROJECT_LANGUAGE].lp2, 1);
                return;
              }
              if (categoryName.length > 10) {
                AppLog.error(languages[CURRENT_PROJECT_LANGUAGE].lp3, 1);
                return;
              }
              if (cameraIds.length === 0) {
                AppLog.error(languages[CURRENT_PROJECT_LANGUAGE].lp4, 1);
                return;
              }
              if (typeof(currentEditCategory) === 'undefined' || currentEditCategory === "") {
                rAddCategory(categoryName);
              } else {
                rUpdateCategory(categoryName);
              }
            };

            $scope.deleteFromCategory = function(camera, category, $event) {
              if ($event) $event.stopPropagation();
              currentEditCategory = category;
              cameraIds = [];
              _.each(category.cameras, function(_camera) {
                if (_camera.deviceid !== camera.deviceid) {
                  cameraIds.push(_camera.deviceid);
                }
              });
              if (cameraIds.length === 0) {
                $scope.deleteCategory(category.cid);
              } else {
                rUpdateCategory(category.name, true);
              }
            };

            $scope.deleteCategory = function(_cid, $event) { //删除分类
              if ($event) $event.stopPropagation();
              ProfileService.delMyCameraGroups({
                cid: _cid
              }).then(function() {
                // $scope.currentCid = 0;
                AppLog.error(languages[CURRENT_PROJECT_LANGUAGE].lp5, 1);
                currentEditCategory = "";
                $scope.categorysBindData();
                // $scope.cancelAddCategory();
              });
            };
          };

          var bindYuntaiPreset = function() {
            var currentMaxPresetIndex = 0;
            var getCameraPlat, moveCloud, bindPreset, addYuntaiPreset, delYuntaiPreset;
            var c_sid, errornum = 0;
            var timeTrigger;
            $scope.labels = [{
              "id": 0,
              "desc": "门口"
            }, {
              "id": 1,
              "desc": "窗户"
            }, {
              "id": 2,
              "desc": "收银台"
            }];


            getCameraPlat = function() {
              ProfileService.getDevPlat({
                deviceid: $scope.currentDevice.deviceid
              }).then(function(_data) {
                if (_data.error_code) {
                  AppLog.error("获取摄像机云台信息失败");
                  return;
                }
                $scope.currentDevice.isCloud = _data.plat !== "0" ? 1 : 0;
                if (_data.plat_rotate_status === "1") {
                  $scope.isAuto = true;
                }
                if ($scope.currentDevice.isCloud === 1) {
                  $scope.showRudder = true;
                  $scope.enableRudder = true;
                  bindPreset();
                } else {
                  $scope.enableRudder = false;
                }
                $timeout(function() {
                  resize();
                }, 0, true);
              });
            }
            moveCloud = function(_preset) {
              ProfileService.byPresetMove({
                method: "move",
                deviceid: $scope.currentDevice.deviceid,
                preset: _preset
              }).then(function() {
                //todo
              });
            };

            //获取云台预置位列表
            bindPreset = function() {
              // var temp,flag;
              ProfileService.getYuntaiPresetList({
                deviceid: $scope.currentDevice.deviceid
              }).then(function(_data) {
                $scope.presetList = _data.list;
                $scope.presetCount = _data.count;
                currentMaxPresetIndex = _data.currentMaxPresetIndex;
                if (_data.count > 0) {
                  $scope.noHasPreset = false;
                  $scope.hasPreset = true;
                  $scope.editPreset = false;
                } else {
                  $scope.hasPreset = false;
                  $scope.noHasPreset = true;
                  $scope.editPreset = false;
                }
              });
            };
            //添加
            addYuntaiPreset = function(_preset, _title, _isUp) {
              ProfileService.addYuntaiPreset({
                deviceid: $scope.currentDevice.deviceid,
                preset: _preset,
                title: _title
              }).then(function(_data) {
                if (_data.error_code) {
                  // AppLog.error(_isUp ? languages[CURRENT_PROJECT_LANGUAGE].lp4 : languages[CURRENT_PROJECT_LANGUAGE].lp5, 1);
                  $scope.videoPlayerManager.showPlayerTopMsg(_isUp ? languages[CURRENT_PROJECT_LANGUAGE].lpy4 : languages[CURRENT_PROJECT_LANGUAGE].lpy5, 'fail');
                  $scope.isLoadding = false;
                  return;
                }
                $scope.textValue = "";
                // setTimeout(function() {
                $scope.videoPlayerManager.showPlayerTopMsg(_isUp ? languages[CURRENT_PROJECT_LANGUAGE].lpy6 : languages[CURRENT_PROJECT_LANGUAGE].lpy7, 'success');
                // AppLog.success(_isUp ? languages[CURRENT_PROJECT_LANGUAGE].lp6 : languages[CURRENT_PROJECT_LANGUAGE].lp7, 1);
                $scope.editPresetStatus = false;
                $scope.isLoadding = false;
                // bindPreset();
                // }, 2500);
              }).then(function() {
                bindPreset();
              });
            };
            //删除
            delYuntaiPreset = function(_preset) {
              ProfileService.delYuntaiPreset({
                method: "droppreset",
                deviceid: $scope.currentDevice.deviceid,
                preset: _preset
              }).then(function(_data) {
                if (_data.error_code) {
                  // AppLog.error(languages[CURRENT_PROJECT_LANGUAGE].lp8, 1);
                  $scope.videoPlayerManager.showPlayerTopMsg(languages[CURRENT_PROJECT_LANGUAGE].lpy8, "fail");
                  return;
                }
                // AppLog.success(languages[CURRENT_PROJECT_LANGUAGE].lp9, 1);
                $scope.videoPlayerManager.showPlayerTopMsg(languages[CURRENT_PROJECT_LANGUAGE].lpy9, "success");
              }).then(function() {
                bindPreset();
              });
            };
            //获取添加预置位缩略图
            getSnapInfo = function() {
              ProfileService.getSnapshotInfo({
                deviceid: $scope.currentDevice.deviceid,
                sid: c_sid
              }).then(function(_data) {
                if (_data.error_code) {
                  errornum++;
                  if (errornum > 10) {
                    errornum = 0;
                    $scope.picLoading = false;
                    $scope.videoPlayerManager.showPlayerTopMsg(languages[CURRENT_PROJECT_LANGUAGE].lpy16, "fail");
                    return;
                  }
                  if ($scope.editPreset) getSnapInfo();
                  else {
                    $scope.picLoading = false;
                    errornum = 0;
                  }
                  return;
                }
                $scope.picLoading = false;
                errornum = 0;
                // currentSnap = _data;
                $scope.cThumbnail = _data.url;
                // getImgUrl();
              });
            };
            //添加预置位缩略图
            addSnapInfo = function(cbFn) {
              ProfileService.addDeviceSnapshot({
                deviceid: $scope.currentDevice.deviceid
              }).then(function(_data) {
                if (_data.error_code) {
                  $scope.picLoading = false;
                  // if($scope.editYuntaiConfig) videoPlayerManager.showPlayerTopMsg(languages[CURRENT_PROJECT_LANGUAGE].lp72, "fail");
                  return;
                }
                c_sid = _data.sid;
                if (cbFn) setTimeout(cbFn, 1000);
              });
            };
            $scope.delPresetFn = function(_preset, $event) {
              if ($event) $event.stopPropagation();
              delYuntaiPreset(_preset.preset);
            };
            $scope.showYuntai = function() {
              $scope.enableRudder = false;
              $scope.showPreset = false;
              $scope.noHasPreset = false;
              $scope.editPreset = false;
              $scope.hasPreset = false;
              $scope.showRudder = true;
              $scope.enableRudder = true;
              $scope.showDelBtn = false;
            }
            $scope.selectCamera = function(_camera, _isChangeTree, e) {
              // alert(1);
              console.info(11111111);
              if (!_camera) {
                $scope.currentDevice = "";
                $scope.$apply();
                return;
              }
              if (!_camera.isMarked && !$scope.showAddMark) {
                AppLog.error("摄像机未设置位置信息", 1, 500);
                return;
              }
              if (!_isChangeTree) $scope.treeCurrentDevice = _camera;
              $scope.currentDevice = _camera;
              if (!_camera.checked && _camera.isMarked) {
                // playingCameras.push(_device.deviceid);
                _camera.checked = true;
              }

              // if (_camera.cid.length === 0) {
              //   $scope.collapseCategoryIndex = -1;
              // }
              if (_isChangeTree) {
                for (var i = $scope.categories.length - 1; i >= 0; i--) {
                  if (_camera.cid[0] === $scope.categories[i].cid) {
                    $scope.collapseCategoryIndex = i;
                  }
                };
                $scope.$apply();
                return;
              }
              $scope.onSelectItem(_camera);
            }
            $scope.selectItem = function(_device) {
              if ($scope.single) {
                return false;
              } else{
                $scope.enableRudder = false;
                $scope.showPreset = false;
                $scope.noHasPreset = false;
                $scope.editPreset = false;
                $scope.hasPreset = false;
                $scope.currentDevice = _device;
                if (!_.contains(playingCameras, _device.deviceid)) {
                  _device.checked = true;
                }
                getCameraPlat();
                $scope.onSelectItem(_device, _device.checked);
              } 
            };
            // $scope.selectPreset = function(_preset) {
            //   $scope.currentPreset = _preset;
            // }
            if (CURRENT_PROJECT_DATA.meta) {
              CURRENT_PROJECT_DATA.meta.checked = true;
              $scope.selectItem(CURRENT_PROJECT_DATA.meta);
            }
            $scope.getTextValue = function(_label) {
              $scope.textValue = _label.desc;
            };

            $scope.toggleExpand = function() {
              $scope.showRudder = !$scope.showRudder;
              $timeout(function() {
                resize();
              }, 0, true);
            };
            $scope.showPresetFn = function() {
              if ($scope.presetCount > 0) {
                $scope.hasPreset = true;
                $scope.noHasPreset = false;
                $scope.editPreset = false;
              } else {
                $scope.hasPreset = false;
                $scope.noHasPreset = true;
                $scope.editPreset = false;
              }
              $scope.showPreset = $scope.noHasPreset || $scope.editPreset || $scope.hasPreset;
            };
            // $scope.addPresetFn = function() {
            //   if ($scope.isAuto) {
            //     $scope.videoPlayerManager.showPlayerTopMsg(languages[CURRENT_PROJECT_LANGUAGE].lpy10, "fail");
            //     return;
            //   }
            //   $scope.noHasPreset = false;
            //   $scope.editPreset = true;
            //   $scope.hasPreset = false;
            // }

            $scope.showDelBtnFn = function() {
              $scope.showDelBtn = !$scope.showDelBtn;
            }
            $scope.editPresetFn = function(_preset, $event) { //_item
              if ($event) $event.stopPropagation();
              if ($scope.isAuto && !_preset) {
                $scope.videoPlayerManager.showPlayerTopMsg(languages[CURRENT_PROJECT_LANGUAGE].lpy10, "fail");
                return;
              }
              if ($scope.presetCount >= 6 && !_preset) {
                // AppLog.error(languages[CURRENT_PROJECT_LANGUAGE].lp11, 1);
                $scope.videoPlayerManager.showPlayerTopMsg(languages[CURRENT_PROJECT_LANGUAGE].lpy11, "fail");
                return;
              }
              $scope.textValue = "";
              $scope.noHasPreset = false;
              $scope.editPreset = true;
              $scope.hasPreset = false;
              $scope.showDelBtn = false;
              if (_preset) {
                $scope.textValue = _preset.title;
                $scope.cThumbnail = _preset.thumbnail;
                return;
              }
              $scope.picLoading = true;
              addSnapInfo(getSnapInfo);
            };
            $scope.cancelEditPreset = function() { //_item
              $scope.editPresetStatus = false;
              $scope.picLoading = false;
              $scope.cThumbnail = "tttt";
              $scope.textValue = "";
            };
            $scope.submitEditPreset = function(_preset, _title) { //_item

              // $scope.submitEditPreset(editPresetId, $scope.textValue);
              // setTimeout(function() {
              //   $scope.textValue = "";
              //   $scope.cThumbnail = "ttt";
              // },2000);

              // if ($scope.isLoadding) return;
              $scope.picLoading = false;
              $scope.cThumbnail = "tttt";
              if (!$scope.textValue) {
                $scope.videoPlayerManager.showPlayerTopMsg(languages[CURRENT_PROJECT_LANGUAGE].lpy15, "fail");
                return;
              }
              $scope.isLoadding = true;
              $scope.hasPreset = true;
              $scope.editPreset = false;

              if (!_preset) {
                addYuntaiPreset(currentMaxPresetIndex, $scope.textValue);
              } else {
                addYuntaiPreset(_preset, $scope.textValue, true);
              }
            };

            $scope.moveByPresetFn = function(_preset, _index) {
              if ($scope.currentPreset && $scope.currentPreset.preset === _preset.preset) return;
              if (timeTrigger) clearTimeout(timeTrigger);
              $scope.currentPreset = _preset.preset;
              // $scope.currentIndex = _index;
              // $scope.presetLoading = true;
              timeTrigger = setTimeout(function() {
                $scope.presetLoading = false;
                $scope.$apply();
              }, 2000);

              $scope.delPresetsStatus = false;
              moveCloud(_preset.preset);
              // videoPlayerManager.manualYuntai();
              // videoPlayerManager.trigger("control-yuntai-oper", "yuntai-manua");
              // $element.find("div.yuntai-ops-wrap .yuntai-auto").removeClass("yuntai-stop");
            };

            //操作云台
            //云台操作
            $scope.cloudUp = function() {
              $scope.isAuto = false;
              $scope.videoPlayerManager.trigger("control-yuntai-oper", "yuntai-manua-up");
            }
            $scope.cloudRight = function() {
              $scope.videoPlayerManager.trigger("control-yuntai-oper", "yuntai-manua-right");
            }
            $scope.cloudDown = function() {
              $scope.videoPlayerManager.trigger("control-yuntai-oper", "yuntai-manua-down");
            }
            $scope.cloudLeft = function() {
              $scope.videoPlayerManager.trigger("control-yuntai-oper", "yuntai-manua-left");
            }
            $scope.cloudLeftUp = function() {
              $scope.videoPlayerManager.trigger("control-yuntai-oper", "yuntai-manua-leftup");
            }
            $scope.cloudRightUp = function() {
              $scope.videoPlayerManager.trigger("control-yuntai-oper", "yuntai-manua-rightup");
            }
            $scope.cloudLeftDown = function() {
              $scope.videoPlayerManager.trigger("control-yuntai-oper", "yuntai-manua-leftdown");
            }
            $scope.cloudRightDown = function() {
              $scope.videoPlayerManager.trigger("control-yuntai-oper", "yuntai-manua-rightdown");
            }
            $scope.yuntaiAuto = function() {
              $scope.isAuto = true;
              $scope.videoPlayerManager.trigger("control-yuntai-oper", "yuntai-auto");
            }
            $scope.yuntaiStop = function() {
              $scope.isAuto = false;
              $scope.videoPlayerManager.trigger("control-yuntai-oper", "yuntai-stop");
            }
          };

          $scope.$watch("multiType", function(_v, _ov) {
            if (_v !== _ov) {
              _.each($scope.categories, function(category) {
                if (_.contains($scope.multiCids, category.cid)) {
                  category.checked = true;
                } else {
                  category.checked = false;
                }
              });
            }
          });

          $scope.$watch("setMulti", function(_v, _ov) {
            if (_v !== _ov) {
              $timeout(function() {
                resize();
              }, 0, true);

            }
          });

          var resize = function() {
            var h = $scope.showType === "all" ? $elem.find(".status-wrap").outerHeight(true) : $elem.find(".category-edit-wrap").outerHeight(true);
            // $elem.find(".list-wrap").height($elem.height() - $elem.find(".btn-group-justified").outerHeight() - $elem.find(".camera-search-wrap").outerHeight() - $elem.find(".category-edit-wrap").outerHeight(true) - $elem.find(".ctlcloud").outerHeight(true) - 14);
            $('.list-wrap').height($(window).height() - $('.pro-top-header').height() - $(".btn-group-justified").outerHeight() - $(".camera-search-wrap").height() - h - $(".ctlcloud").outerHeight(true) - 14);
          };



          var init = function() {
            // $scope.enableRudder = true;
            $scope.currentPreset = "";

            var isLoading = false;
            $scope.categories = [];
            $scope.filterStatus = "all";
            $scope.collapseCategoryIndex = 0;
            $scope.showType = "byCategory";
            $scope.keywords = "";
            $scope.showRudder = true;
            $scope.categoryModalVisible = false;
            $scope.isInMap = false;
            $scope.markerList = [];
            $scope.currentEditCategory = {
              categoryName: "",
              searchName: ""
            };


            bakCameras = [];
            caVideosList = [];
            allVideosList = [];

            currentEditCategory = "";
            cameraIds = [];
            playingCameraIds = [];


            $scope.categorysBindData();
            bindEvent();
            bindCategoryEvent();
            bindYuntaiPreset();
            $timeout(function() {
              resize();
            }, 100, true);
          };

          init();
        }
      };
    }
  ]);
});