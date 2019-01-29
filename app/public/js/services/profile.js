define(["app", "underscore", "f_servicecallback"], function (Services) {
	Services.service("ProfileService", ["$q", "ServiceCallBack", "camera_my_cameras_callserver", "profile_user_info_callserver",
		"video_collect_videos_callserver", "camera_my_camera_groups_callserver", "camera_getConfigInfo_callserver",
		"profile_personal_videos_callserver", "profile_personal_videos_callserver", "camera_camerainfo_meta_callserver", "camera_camerainfo_meta_callserver",
		"camera_config_status_callserver", "camera_config_cvr_callserver", "camera_config_info_callserver", "camera_config_plat_callserver",
		"camera_getConfigCvr_callserver", "search_search_history_callserver", "search_search_history_callserver", "video_query_history_callserver", "video_query_history_callserver",
		"camera_camerainfo_callserver", "user_login_callserver", "camera_video_list_callserver", "camera_token_callserver", "camera_my_devsum_callserver",
		"camera_yuntaipreset_callserver", "camera_yuntaipreset_callserver", "camera_yuntaipreset_callserver", "video_play_list_callserver", //个人播放页云台
		"camera_shareCamera_ly_callserver", "camera_shareCamera_callserver", "camera_cancelShare_callserver", "video_add_view_count_callserver", "camera_ly_cloud_list_callserver",
		"profile_add_snapshot_callserver", "profile_snapshot_info_callserver", "video_submit_reply_callserver", "profile_submit_multitype_callserver", "profile_submit_multiplayinfo_callserver", "profile_get_multitypes_callserver", "profile_get_multidisplays_callserver",
		"profile_map_marker_callserver", "profile_add_map_marker_callserver", "profile_del_map_device_callserver", "profile_del_map_build_callserver", "profile_add_map_build_callserver", "camera_yuntai_result_callserver",
		"profile_analysis_user_totle_callserver", "camera_my_ai_cameras_callserver", "camera_my_ai_counted_cameras_callserver", "camera_add_ai_cameras_callserver", "camera_my_ai_report_callserver", "camera_my_ai_survey_callserver", "camera_my_ai_last_survey_callserver", "camera_my_ai_faces_callserver", "camera_my_update_face_callserver",
		"camera_my_ai_token_callserver", "camera_julei_callserver", "camera_po_julei_callserver", "camera_juman_callserver", "camera_jupeople_callserver", "camera_app_ai_faces_callserver", "camera_add_app_ai_faces_callserver", "camera_del_ai_faces_callserver", "camera_update_ai_faces_callserver", "camera_get_ai_faces_callserver",
		"camera_get_meeting_id_callserver", "camera_add_meeting_id_callserver", "camera_get_ai_devices_callserver", "camera_add_meeting_device_callserver", "camera_del_meeting_device_callserver", "camera_update_meeting_id_callserver", "camera_del_meeting_id_callserver", "camera_update_signwall_status_callserver", 
		"camera_get_meeting_ai_devices_callserver", "camera_getmember_callserver", "camera_update_set_push_callserver", "camera_config_server_callserver", "camera_save_server_callserver",

		function ($q, ServiceCallBack, MyCamerasCallServer, PersonalCallServer, PersonalCollectVideosCallServer, MyCamerasCategoryCallServer, cameraConfigInfoCallserver, DelCamerasCategoryCallServer,
			AddCamerasCategoryCallServer, updateCameraCallServer, cameraBaseInfoCallServer, devConfigStatusCallserver, devConfigCvrCallserver, devConfigInfoCallserver, devConfigPlatCallserver, cameraConfigCvrCallserver, SearchHistoryCallServer, DelHistoryCallServer, QueryHistoryCallServer, DelBoFangCallServer,
			camera_likeCamera, UserLoginCallServer, PersonalVideosCallServer, DeviceTokenCallServer, PersonalDevInfoSumCallServer,
			yuntaiPresetCallServer, addYuntaiPresetCallServer, delYuntaiPresetCallServer, videoYuntaiCallServer, shareLyCameraCallServer, shareCameraCallServer, cancelShareCameraCallServer, addViweNumCallServer, getLyCloudLIstCallServer,
			addSnapshotCallServer, snapshotInfoCallServer, submitReplyCallserver, submitMultiTypeCallserver, submitMultiPlayInfoCallserver, getMultiTypesCallserver, getMultiDisplaysCallserver, getMapMarkerCallserver,
			addMapMarkerCallserver, delMapDeviceCallserver, delMapBuildCallserver, addMapBuildCallserver, yuntaiAutoCallServer, AnalysisCallserver, MyAiCamerasCallServer, MyAiCountedCamerasCallServer, AddMyAiCamerasCallServer, GetMyAiReportCallServer, GetMyAiSurveyCallServer, getMyAiLastSurveyCallServer,
			GetMyAiFacesCallServer, EditMyAiFacesCallServer, MyAiTokenCallServer, JuleiCallServer, PoJuleiCallServer, JumanCallServer, JupeopleCallServer, AppAiFacesCallServer, AddAppAiFacesCallServer, DelAiFacesCallServer, UpdateAiFacesCallServer, GetAiFacesCallServer, GetMeetingIdCallServer, AddMeetingIdCallServer, GetAiDevicesCallServer, AddMeetingDeviceCallServer,
			DelMeetingDeviceCallServer, UpdateMeetingIdCallServer, DelMeetingIdCallServer, UpdateSignwallStatusCallServer, GetMeetingAiDevicesCallServer, GetmemberCallServer, UpdateSetPushCallServer, devConfigServerCallServer, devSaveServerCallServer) {
			var languages = {
				"zh-cn": {
					"lp1": "离线",
					"lp2": "关机",
					"lp3": "在线",
					"lp4": "过期",
					"lp5": "天",
					"lp6": "私密分享",
					"lp7": "公开分享",
					"lp8": "授权分享",
					"lp9": "被授权",
					"lp10": "未分享"
				},
				"en": {
					"lp1": "offline",
					"lp2": "Off",
					"lp3": "online",
					"lp4": "Overdue",
					"lp5": "days",
					"lp6": "Private sharing",
					"lp7": "Public shared",
					"lp8": "Grant me",
					"lp9": "Authorized",
					"lp10": "Not shared"
				}
			};
			// var pageSize;
			// var devCount;
			// var lackCount, myDevMaxPage, grantnum, currentPageIndex = 1;//maxPageIndex, isRequestLastPage,
			// var isconcat, mygparams;


			var filterFn = function (_data, _language) {
				var i, cd, j;

				if (!_data) return [];
				for (j = 0; j < _data.length; j++) {
					if (_data[j].data_type === 0) {
						if (_data[j].grantnum > 0) {
							_data[j].accreditStatus = 19;
						} else {
							_data[j].accreditStatus = 20;
						}
						_data[j].isGranted = false;
					} else if (_data[j].data_type === 1) {
						_data[j].accreditStatus = 18;
						_data[j].isGranted = true;
					} else {
						_data[j].accreditStatus = 20;
						_data[j].isGranted = false;
					}
				}
				for (i = 0; i < _data.length; i++) {
					_data[i].checkboxIsDisable = false;
					if (Number(_data[i].status) === 0) {
						_data[i].devStatus = "offline";
						_data[i]._clz = "item-disable";
						_data[i].devStatusC = languages[_language].lp1;
						_data[i].checkboxIsDisable = true;
					} else if ((_data[i].status & 0x4) === 0) {
						_data[i].devStatus = "shutdown";
						_data[i].devStatusC = languages[_language].lp2;
					} else {
						_data[i].devStatus = "online";
						_data[i].devStatusC = languages[_language].lp3;
					}
					//_data[i].devStatus = "none";
				}

				for (i = 0; i < _data.length; i++) {
					if (Number(_data[i].connect_type === "1")) {
						if (Number(_data[i].cvr_day) === 0) {
							_data[i].cloudStatus = "out";
							_data[i].cloudValidDays = languages[_language].lp4;
						} else {
							_data[i].cloudStatus = "valid";
							if (_data[i].cvr_day >= 90) {
								cd = 90;
							} else if (_data[i].cvr_day >= 30) {
								cd = 30;
							} else {
								cd = _data[i].cvr_day;
							}
							_data[i].cloudValidDays = cd + languages[_language].lp5;
						}
					} else {
						if (Number(_data[i].cvr_type) === 0) {
							_data[i].cloudStatus = "ly-free";
						} else if (Number(_data[i].cvr_type) === 1) {
							_data[i].cloudStatus = "ly-event";
						} else if (Number(_data[i].cvr_type) === 2) {
							_data[i].cloudStatus = "ly-continue";
						}
						if (_data[i].cvr_day >= 90) {
							cd = 90;
						} else if (_data[i].cvr_day >= 30) {
							cd = 30;
						} else {
							cd = _data[i].cvr_day;
						}
						_data[i].cloudValidDays = cd + languages[_language].lp5;
					}

				}
				//公开分享1 ，私密分享 2 ，公开分享带录像3，私密分享带录像4
				for (i = 0; i < _data.length; i++) {
					if (Number(_data[i].accreditStatus) === 18) {
						_data[i].shareStatus = "accredit";
						_data[i].shareStatusC = languages[_language].lp9;
						_data[i].ismu = false;
					} else if ((Number(_data[i].share) === 2 || (Number(_data[i].share) === 4)) && Number(_data[i].accreditStatus) !== 19) {
						_data[i].shareStatus = "secret";
						_data[i].shareStatusC = languages[_language].lp6;
						_data[i].ismu = false; //是否显示多种状态
					} else if ((Number(_data[i].share) === 1 || Number(_data[i].share) === 3) && Number(_data[i].accreditStatus) === 19) {
						_data[i].shareStatus = "public";
						_data[i].shareStatusC = languages[_language].lp7;
						_data[i].shareStatus2 = "accredited";
						_data[i].shareStatusC2 = languages[_language].lp8;
						_data[i].ismu = true;
					} else if ((Number(_data[i].share) === 1 || Number(_data[i].share) === 3) && Number(_data[i].accreditStatus) !== 19) {
						_data[i].shareStatus = "public";
						_data[i].shareStatusC = languages[_language].lp7;
						_data[i].ismu = false;
					} else if ((Number(_data[i].share) === 2 || (Number(_data[i].share) === 4)) && Number(_data[i].accreditStatus) === 19) {
						_data[i].shareStatus = "secret";
						_data[i].shareStatusC = languages[_language].lp6;
						_data[i].shareStatus2 = "accredited";
						_data[i].shareStatusC2 = languages[_language].lp8;
						_data[i].ismu = true;
					} else if ((Number(_data[i].share) === 1 || Number(_data[i].share) === 3) && Number(_data[i].accreditStatus) === 19) {
						_data[i].shareStatus = "public";
						_data[i].shareStatusC = languages[_language].lp7;
						_data[i].shareStatus2 = "accredited";
						_data[i].shareStatusC2 = languages[_language].lp8;
						_data[i].ismu = true;
					} else if (Number(_data[i].accreditStatus) === 18 && Number(_data[i].share) === 0) {
						_data[i].shareStatus = "accredit";
						_data[i].shareStatusC = languages[_language].lp9;
						_data[i].ismu = false;
					} else if (Number(_data[i].accreditStatus) === 19 && Number(_data[i].share) === 0) {
						_data[i].shareStatus = "accredited";
						_data[i].shareStatusC = languages[_language].lp8;
						_data[i].ismu = false;
					} else {
						_data[i].shareStatus = "none";
						_data[i].shareStatusC = languages[_language].lp10;
					}
				}

				return _data;
			};
			var _this = this;

			//设置提醒开关接口
			this.updateSetPush = function(_params) {
				return UpdateSetPushCallServer.save(_.extend({
					method: 'update',
					list_type: 'all'
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, true);
					return _data;
				})
			}
			//获取人脸图库推送列表
			this.getFaceLibrary = function (_params) {
				return JuleiCallServer.query(_.extend({
					method: "list"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, true);
					return _data;
				})
			}
			//新增客户数统计

			this.getJuman = function (_params) {
				return JumanCallServer.query(_.extend({
					method: "count",
					is_strange: 1,
					day: 1
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, true);
					return _data;
				})
			}
			//到店人数统计

			this.getJupeople = function (_params) {
				return JupeopleCallServer.query(_.extend({
					method: "count",
					day: 1
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, true);
					return _data;
				})
			}
			//获取人脸推送列表
			this.getJulei = function (_params) {
				return JuleiCallServer.query(_.extend({
					is_strange: 1,
					method: "list"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, true);
					return _data;
				})
			}
			//获取人脸事件列表
			this.getPoJulei = function (_params) {
				return PoJuleiCallServer.query(_.extend({
					event_type: 0,
					method: "list"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, true);
					return _data;
				})
			}

			//获取ai登录的token
			this.getAiToken = function (_params) {
				return MyAiTokenCallServer.query(_.extend({
					push_type: 'ws',
					method: "listpushserver"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, true);
					return _data;
				})
			}

			//数据分析-人流量

			this.getAnalysis = function (_params) {
				return AnalysisCallserver.query(_.extend({
					method: 'list'
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, true);
					return _data;
				})
			}
			//获取app人数和本地人数
			this.getnumber = function (_params) {
				return GetmemberCallServer.save(_.extend({
					method: 'membercount'
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, true);
					_data.list = filterFn(_data.list, CURRENT_PROJECT_LANGUAGE);
					return _data;
				})
			};
			//获取AI摄像机列表
			this.getAiDevices = function (_params) {
				return GetAiDevicesCallServer.query(_.extend({
					method: 'listaidevice'
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, true);
					_data.list = filterFn(_data.list, CURRENT_PROJECT_LANGUAGE);
					return _data;
				})
			};
			//获取会议中用到的设备
			this.getMeetingDevices = function (_params) {
				return GetMeetingAiDevicesCallServer.save(_.extend({
					method: 'listdevice'
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, true);
					return _data;
				})
			};
			//获取会议人脸列表
			this.getSignwallFace = function(_params) {
				return GetAiFacesCallServer.save(_.extend({
					method: 'listmember',
					list_type: 'all'
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, true);
					return _data;
				})
			};
			//添加会议设备
			this.addMeetingDevice = function (_params) {
				return AddMeetingDeviceCallServer.save(_.extend({
					method: 'adddevice'
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				})
			}
			//删除会议设备
			this.delMeetingDevice = function (_params) {
				return DelMeetingDeviceCallServer.save(_.extend({
					method: 'dropdevice'
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				})
			}
			//获取会议列表
			this.getMeetingId = function (_params) {
				return GetMeetingIdCallServer.save(_.extend({
					method: 'list'
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				})
			}
			//添加会议
			this.addMeetingId = function (_params) {
				return AddMeetingIdCallServer.save(_.extend({
					method: 'add'
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, true);
					return _data;
				})
			}
			//删除会议
			this.delMeetingId = function (_params) {
				return DelMeetingIdCallServer.save(_.extend({
					method: 'drop'
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, true);
					return _data;
				})
			}
			//修改会议
			this.updateMeetingId = function (_params) {
				return UpdateMeetingIdCallServer.save(_.extend({
					method: 'update'
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, true);
					return _data;
				})
			}
			//获取app人脸列表
			this.getAppAiFace = function (_params) {
				return AppAiFacesCallServer.save(_.extend({//save
					method: 'list',
					list_type: 'all'
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				});
			} 
			//添加app中的人脸
			this.addAppAiFace = function (_params) {
				return AddAppAiFacesCallServer.save(_.extend({
					method: "addmember"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				})
			}
			//删除签到人员
			this.delAiFace = function (_params) {
				return DelAiFacesCallServer.save(_.extend({
					method: 'dropmember'
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				})
			}
			//修改签到人员
			this.updateAiFace = function (_params) {
				return UpdateAiFacesCallServer.save(_.extend({
					method: 'updatemember'
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				})
			}
			//用户签到状态修改
			this.updateSignwllStatus = function (_params) {
				return UpdateSignwallStatusCallServer.save(_.extend({
					method: 'signinmember'
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				})
			}
			//获取个人ai摄像机 ——
			this.getMyAiCameras = function (_params) {
				return MyAiCamerasCallServer.query(_.extend({
					method: 'listalldevice'
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, true);
					_data.list = filterFn(_data.list, CURRENT_PROJECT_LANGUAGE);
					return _data;
				});
			};
			//获取个人被统计的ai摄像机 ——
			this.getMyAiCountedCameras = function (_params) {
				return MyAiCountedCamerasCallServer.query(_.extend({
					method: 'listdevice'
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, true);
					_data.list = filterFn(_data.list, CURRENT_PROJECT_LANGUAGE);
					return _data;
				});
			};

			//添加个人被统计的ai摄像机
			this.addMyAiCameras = function (_params) {
				return AddMyAiCamerasCallServer.query(_.extend({
					method: 'editdevice'
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				});
			};
			//个人ai摄像机统计报表
			this.getMyAiReport = function (_params) {
				return GetMyAiReportCallServer.query(_.extend({
					method: 'cartogram'
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				});
			};
			//个人ai摄像机统计报表app
			this.getMyAiSurveyApp = function (_params) {
				return GetMyAiSurveyCallServer.query(_.extend({
					method: 'datetimestatistics'
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				});
			};
			// 个人ai摄像机统计报表增量数据
			this.getMyAiLastSurvey = function (_params) {
				return getMyAiLastSurveyCallServer.query(_.extend({
					method: 'quantumtime'
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				});
			};

			//个人ai摄像机统计报表
			this.getMyAiSurvey = function (_params) {
				return GetMyAiSurveyCallServer.query(_.extend({
					method: 'collect'
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				});
			};
			//获取个人ai摄像机已识别人脸列表
			this.getMyAiFaces = function (_params) {
				return GetMyAiFacesCallServer.query(_.extend({
					method: 'list',
					list_type: 'all'
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				});
			};
			//获取个人ai摄像机已识别人脸列表
			this.editMyAiFaces = function (_params) {
				return EditMyAiFacesCallServer.query(_.extend({
					method: 'update'
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				});
			};

			//获取个人页面 ——我的爱耳目列表
			this.getMyCameras = function (_params) {
				return MyCamerasCallServer.query(_.extend({
					method: 'list'
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, true);
					_data.list = filterFn(_data.list, CURRENT_PROJECT_LANGUAGE);
					return _data;
				});
			};
			//根据cid获取分类摄像机列表
			this.getCamerasByCid = function (_cid) {
				return $q.all([
					_this.getMyCameras({
						method: "list",
						list_type: "all",
						data_type: "my",
						category: _cid
					}),
					_this.getMyCameras({
						method: "list",
						list_type: "all",
						data_type: "grant",
						category: _cid
					})
				]).then(function (res) {
					return {
						list: res[0].list.concat(res[1].list),
						page: {
							total: res[0].count + res[1].count
						},
						error_code: (res[0].error_code || res[1].error_code) ? "error" : ""
					};
				});
			};
			this.getMyCamerasSum = function (_params) {
				return PersonalDevInfoSumCallServer.query(_.extend({
					method: "sum"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				});
			};
			//获取个人摄像机云台预置位列表
			this.getYuntaiPresetList = function (_params) {
				var flag = false,
					i;
				return yuntaiPresetCallServer.query(_.extend({
					method: "listpreset"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, true);
					if (_data.count !== 0) {
						_data.list = _.sortBy(_data.list, function (data) {
							return data.preset;
						});
						for (i = 1; i <= _data.list.length; i++) {
							if (Number(_data.list[i - 1].preset) != i) {
								_data.addPresetIndex = i;
								flag = true;
								break;
							}
						}
						if (!flag) {
							_data.addPresetIndex = _data.count + 1;
						}
					} else {
						_data.addPresetIndex = 1;
					}
					return _data;
				});
			};

			//添加个人摄像机云台预置位
			this.addYuntaiPreset = function (_params) {
				return addYuntaiPresetCallServer.query(_.extend({
					method: "addpreset"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				});
			};
			//删除个人摄像机云台预置位
			this.delYuntaiPreset = function (_params) {
				return delYuntaiPresetCallServer.query(_.extend({
					method: "droppreset"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
					// return _this.getYuntaiPresetList({ deviceid: _params.deviceid }).then(function(_data) {
					//   _data = ServiceCallBack.renderData(_data, false);
					//   return _data;
					// });
				});
			};
			//个人摄像机云台预置位移动
			this.byPresetMove = function (_params) {
				return videoYuntaiCallServer.query(_.extend({
					method: "move"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				});
			};
			//云台自动旋转
			this.yuntaiAuto = function (_params) {
				return yuntaiAutoCallServer.query(_.extend({
					method: "rotate",
					rotate: "auto",
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				});
			};

			//获取个人页面－个人信息
			this.getPersonalInfo = function (_params) {
				return PersonalCallServer.query(_.extend({
					method: "info"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				});

			};
			//获取个人页面 —— 我的收藏列表
			this.getCollectVideo = function (_params) {
				return PersonalCollectVideosCallServer.query(_.extend({
					method: "list"
				}, _params)).$promise.then(function (_data) {
					_data.list = filterFn(_data.list, CURRENT_PROJECT_LANGUAGE);
					_data = ServiceCallBack.renderData(_data, true);
					return _data;
				});

			};
			//获取个人页面 —— 我的摄像机分类
			this.getMyCameraGroups = function (_params) {
				return MyCamerasCategoryCallServer.query(_.extend({
					method: "listcategory"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, true);
					return _data;
				});

			};
			//获取个人页面 —— 批量设置保存,设备信息修改1
			this.getMyCameraConfigInfo = function (_params) {
				return cameraConfigInfoCallserver.query(_.extend({
					method: "updatesetting"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				});
			};

			//获取个人页面 —— 删除摄像机分类
			this.delMyCameraGroups = function (_params) {

				return DelCamerasCategoryCallServer.save(_.extend({
					method: "dropcategory"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				});
			};
			//获取个人页面 —— 添加摄像机分类
			this.addMyCameraGroups = function (_params) {
				return AddCamerasCategoryCallServer.save(_.extend({
					method: "addcategory"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				});

			};

			//获取个人页面 —— 设备信息修改2
			this.getUpdateCamera = function (_params) {
				return updateCameraCallServer.query(_.extend({
					method: "update"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				});

			};

			//获取个人页面 —— 播放
			this.getPlayCamera = function (_params) {
				return cameraBaseInfoCallServer.query(_.extend({
					method: "meta"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					if (_data.error_code && _data.error_code !== 31365) {
						return _this.getMyCameras({
							data_type: "grant",
							list_type: "all"
						}).then(function (_grantDatas) {
							var grangData;
							_.each(_grantDatas.list, function (_item) {
								if (_item.deviceid === _params.deviceid) {
									grangData = _item;
									grangData.isGranted = true;
									_data = ServiceCallBack.renderData(grangData, false);
									return false;
								}
							});
							return _data;
						});
					} else {
						if (_data.connect_type === "2" && !_params.shareid) {
							return _this.getLyCloudList(_params).then(function (_d) {
								_d = ServiceCallBack.renderData(_d, true);
								_data.lylist = _d.list;
								return _data;
							});
						} else {
							return _data;
						}
					}
				});
			};


			//获取羚羊云录制列表
			this.getLyCloudList = function (_params) {
				return getLyCloudLIstCallServer.query(_.extend({
					method: "listcvrrecord"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, true);
					return _data;
				});
			};

			//获取个人页面 —— 设置 状态
			this.getDevStatus = function (_params) {
				return devConfigStatusCallserver.query(_.extend({
					method: "setting",
					type: "status"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				});
			};
			this.getDevCvr = function (_params) {
				return devConfigCvrCallserver.query(_.extend({
					method: "setting",
					type: "cvr"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				});
			};
			this.getDevInfo = function (_params) {
				return devConfigInfoCallserver.query(_.extend({
					method: "setting",
					type: "info"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				});
			};
			this.getDevServer = function(_params) {
				return devConfigServerCallServer.query(_.extend({
					method: "setting",
					type: "server"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				});
			};
			this.saveDevServer = function(_params) {
				return devSaveServerCallServer.query(_.extend({
					method: "updatesetting"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				});
			}
			this.getDevPlat = function (_params) {
				return devConfigPlatCallserver.query(_.extend({
					method: "setting",
					type: "plat"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				});
			};
			this.getSetCamera = function (_params) {
				return cameraConfigCvrCallserver.query(_.extend({
					method: "setting"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				});
			};
			//获取个人历史记录
			this.getHistory = function (_params) {
				return SearchHistoryCallServer.query(_.extend({
					method: "list"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, true);
					return _data;
				});

			};
			//删除历史记录
			this.delHistory = function (_params) {
				return DelHistoryCallServer.save(_.extend({
					method: "drop"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				});
			};

			//获取播放记录列表
			this.getPlayrecordVideos = function (_params) {

				return QueryHistoryCallServer.query(_.extend({
					method: "listview"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, true);
					return _data;
				});
			};
			//删除播放记录
			this.delPlayrecordVideos = function (_params) {
				return DelBoFangCallServer.save(_.extend({
					method: "dropview"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				});
			};
			//点赞
			this.getCamera_likeCamera = function (_params) {
				return camera_likeCamera.save(_.extend({
					method: "approve"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				});
			};

			//添加播放次数
			this.addViweNum = function (_params) {
				return addViweNumCallServer.query(_.extend({
					method: "view"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				});
			};

			//videodownload
			this.getUserLogin = function (_params) {
				return UserLoginCallServer.query(_.extend({}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				});

			};
			//videodownload
			this.getPersonalVideos = function (_params) {

				return PersonalVideosCallServer.query(_.extend({}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				});
			};
			//videodownload
			this.getDeviceTokenCallServer = function (_params) {
				return DeviceTokenCallServer.query(_.extend({}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				});
			};

			//分享个人(羚羊)摄像机
			this.getDeviceShareCallServer = function (_params) {
				return shareLyCameraCallServer.query(_.extend({
					method: "createshare"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				});
			};
			//取消分享个人摄像机
			this.getCancelShareCallServer = function (_params) {
				return cancelShareCameraCallServer.query(_.extend({
					method: "cancelshare"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				});
			};

			//添加设备截屏
			this.addDeviceSnapshot = function (_params) {
				return addSnapshotCallServer.query(_.extend({
					method: "snapshot"
				}, _params)).$promise.then(function (_data) {
					_params.sid = _data.sid;
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
					// return _this.getSnapshotInfo(_params).then(function(_d){
					//    _d = ServiceCallBack.renderData(_d, true);
					//   return _d;
					// });
				});
			};
			//获取设备截屏信息
			this.getSnapshotInfo = function (_params) {
				return snapshotInfoCallServer.query(_.extend({
					method: "snapshotinfo"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				});

			};

			//获取设备截屏信息
			this.saveComment = function (_params) {
				return submitReplyCallserver.query(_.extend({
					method: "comment"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				});
			};

			//保存专业版用户多画面类型
			this.saveProfileMultiType = function (_params) {
				return submitMultiTypeCallserver.query(_.extend({
					method: "add"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				});
			};
			//保存专业版多画面播放信息
			this.saveProfileMultiPlayInfo = function (_params) {
				return submitMultiPlayInfoCallserver.query(_.extend({
					method: "add"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, true);
					return _data;
				});
			};

			//保存专业版多画面
			this.saveProfileMulti = function (_params) {
				return $q.all([
					_this.saveProfileMultiType({
						lid: _params.lid || "",
						rows: _params.rows,
						cols: _params.cols,
						coords: _params.coords || []
					}),
					_this.saveProfileMultiPlayInfo({
						lid: _params.lid,
						cid: _params.cid,
						cycle: _params.cycle
					})
				]).then(function (res) {
					return _.extend(res[0], res[1]);
				});
			};

			//获取专业版多画面
			this.getProfileMulti = function (_params) {
				return $q.all([
					_this.getProfileMultiType(),
					_this.getProfileMultiDisplays()
				]).then(function (res) {
					_.each(res[0].list, function (_multi) {
						_.each(res[1].list, function (_display) {
							if (_multi.lid === _display.lid) {
								_multi = _.extend(_multi, _display);
								if (_multi.type === "0") {
									_multi.cid = ["all"];
								} else if (_multi.type === "1") {
									_multi.cid = ["none"];
								} else if (_multi.type === "3") {
									_multi.cid.push("none");
								}
							}
						});
						if (_multi.coords) _multi.coords = JSON.parse(_multi.coords);
						if (_multi.status === "1") {
							res[0].effMulti = _multi;
						}
					});
					return res[0];
				});
			};
			//获取专业版用户多画面类型
			this.getProfileMultiType = function (_params) {
				return getMultiTypesCallserver.query(_.extend({
					method: "list"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, true);
					return _data;
				});
			};
			//获取专业版用户多画面显示列表
			this.getProfileMultiDisplays = function (_params) {
				return getMultiDisplaysCallserver.query(_.extend({
					method: "list"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, true);
					return _data;
				});
			};


			//获取专业版地图上标注的摄像机列表
			this.getMapMarkerList = function (_params) {
				return getMapMarkerCallserver.query(_.extend({
					method: "list"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, true);
					return _data;
				});
			};
			//专业版添加摄像机标注
			this.addMapMarker = function (_params) {
				return addMapMarkerCallserver.query(_.extend({
					method: "add"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				});
			};
			//专业版添加楼宇标注 ？？
			this.addMapBulid = function (_params) {
				return addMapBuildCallserver.query(_.extend({
					method: "add"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				});
			};

			//专业版删除摄像机标注
			this.delMapDeviceMarker = function (_params) {
				return delMapDeviceCallserver.query(_.extend({
					method: "drop"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				});
			};
			//专业版删除楼宇
			this.delMapbuild = function (_params) {
				return delMapBuildCallserver.query(_.extend({
					method: "drop"
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, false);
					return _data;
				});
			};
		}
	]);
});