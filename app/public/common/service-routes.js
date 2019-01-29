(function () {
	/*
	 [
	 route_name,
	 [route_url, method], develop url
	 [route_url, method], production url
	 isArray
	 ]
	 */
	var Service_Domain = "/"; //"https://www.iermu.com:8006/";
	var GET_METHOD_NAME = "get";
	var POST_METHOD_NAME = "post";
	var JSONP_METHOD_NAME = "JSONP";
	var serviceRouteUrls = {
		video: [
			["public_categories", ["/public/json/video_categories.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["videos", ["/public/json/cameras.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["comments", ["/public/json/comments.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["submit_reply", ["/public/json/comments.json", "get"],
				[Service_Domain + "api/v2/pcs/device", POST_METHOD_NAME], false
			],
			["play_list", ["/public/json/playlist.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["play_list_ly", ["/public/json/playlist.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["play_thumbnail", ["/public/json/playthumbnail.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["like", ["/public/json/likeCamera.json", "get"],
				["/service/api.php", POST_METHOD_NAME], false
			],
			["add_view_count", ["/public/json/addViewCount.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["hot_videos", ["/public/json/hotvideos.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["lastest_videos", ["/public/json/lastestVideos.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["suggest_videos", ["/public/json/lastestVideos.json", "get"],
				[Service_Domain + "api/v2/recommend", GET_METHOD_NAME], false
			],
			["top_videos", ["/public/json/topVideos.json", "get"],
				[Service_Domain + "api/v2/web/page", GET_METHOD_NAME], false
			],
			["collect_videos", ["/public/json/collectVideos.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],

			["getLivePlayUrl", ["/public/json/playurl.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["getLivePlayUrl_ly", ["/public/json/playurl.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],

			["query_xihuanfirst_by_user", ["/public/json/xihuanfirst_by_user.json", "get"],
				[Service_Domain + "api/v2/recommend", GET_METHOD_NAME], false
			],
			["query_xihuanfirst", ["/public/json/xihuanfirst.json", "get"],
				[Service_Domain + "api/v2/recommend", GET_METHOD_NAME], false
			],
			["query_jifenbang", ["/public/json/jifenbang.json", "get"],
				["/service/api.php", GET_METHOD_NAME], false
			],
			["query_history", ["/public/json/viewhistory.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["query_zyzhibo_by_user", ["/public/json/zyzhibo_by_user.json", "get"],
				["/service/api.php", GET_METHOD_NAME], false
			],
			["zhibo_history", ["/public/json/zhiboHistory.json", "get"],
				["/service/api.php", GET_METHOD_NAME], false
			],

			// ["checkHlsSatus", ["/public/json/collectVideos.json", "get"], ["/service/api.php", GET_METHOD_NAME], false],

			["checkHlsSatus", ["/public/json/checkHlsSatus.json", "get"],
				[Service_Domain + "api/v2/util/filestatus", GET_METHOD_NAME], false
			],

			["clipVideo", ["/public/json/clip_video.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["downloadClipVideo", ["/public/json/clip_video.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["clipVideo_ly", ["/public/json/clip_process.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			//["downloadClipVideo_ly", ["/public/json/clip_video.json", "get"], [Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false],
			["bofang", ["/json/wodezhuye_right.json", "get"],
				["/service/api.php", GET_METHOD_NAME], false
			],
			["approve", ["/public/json/approve.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["view", ["/public/json/view.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["report", ["/public/json/report.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["subscribe", ["/public/json/subscribe.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["unsubscribe", ["/public/json/unsubscribe.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			]
		],
		camera: [
			["graph_data", ["/public/json/ai_data.json", "get"],
				[Service_Domain + "api/v2/ai/statistics", POST_METHOD_NAME], false
			],
			["update_set_push", ["/public/json/ai_stranger_face.json", "post"],
				[Service_Domain + "api/v2/ai/face", POST_METHOD_NAME], false
			],
			["getmember", ["/public/json/appnum.json", "get"],
				[Service_Domain + "api/v2/ai/meeting", POST_METHOD_NAME], false
			],
			["get_meeting_ai_devices", ["/public/json/meeting_devices.json", "get"],
				[Service_Domain + "api/v2/ai/meeting", POST_METHOD_NAME], false
			],
			["get_ai_devices", ["/public/json/mycameras.json", "get"],
				[Service_Domain + "api/v2/pcs/device", POST_METHOD_NAME], false
			],
			["add_meeting_device", ["/public/json/mycameras.json", "get"],
				[Service_Domain + "api/v2/ai/meeting", POST_METHOD_NAME], false
			],
			["del_meeting_device", ["/public/json/mycameras.json", "get"],
				[Service_Domain + "api/v2/ai/meeting", POST_METHOD_NAME], false
			],
			["get_meeting_id", ["/public/json/ai_meeting_id.json", "get"],
				[Service_Domain + "api/v2/ai/meeting", POST_METHOD_NAME], false
			],
			["add_meeting_id", ["/public/json/ai_meeting_id.json", "get"],
				[Service_Domain + "api/v2/ai/meeting", POST_METHOD_NAME], false
			],
			["del_meeting_id", ["/public/json/ai_meeting_id.json", "get"],
				[Service_Domain + "api/v2/ai/meeting", POST_METHOD_NAME], false
			],
			["update_meeting_id", ["/public/json/ai_meeting_id.json", "get"],
				[Service_Domain + "api/v2/ai/meeting", POST_METHOD_NAME], false
			],
			["update_signwall_status", ["/public/json/ai_meeting_id.json", "get"],
				[Service_Domain + "api/v2/ai/meeting", POST_METHOD_NAME], false
			],
			["get_ai_faces", ["/public/json/ai_faces.json", "get"],
				[Service_Domain + "api/v2/ai/meeting", POST_METHOD_NAME], false
			],
			["app_ai_faces", ["/public/json/ai_faces.json", "get"],
				[Service_Domain + "api/v2/ai/face", POST_METHOD_NAME], false
			],
			["add_app_ai_faces", ["/public/json/ai_faces.json", "get"],
				[Service_Domain + "api/v2/ai/meeting", POST_METHOD_NAME], false
			],
			["add_ai_faces", ["/public/json/ai_faces.json", "get"],
				[Service_Domain + "api/v2/ai/meeting", POST_METHOD_NAME], false
			],
			["del_ai_faces", ["/public/json/ai_faces.json", "get"],
				[Service_Domain + "api/v2/ai/meeting", POST_METHOD_NAME], false
			],
			["update_ai_faces", ["/public/json/ai_faces.json", "get"],
				[Service_Domain + "api/v2/ai/meeting", POST_METHOD_NAME], false
			],
			["paystatus", ["/public/json/paystatus.json", "get"],
				[Service_Domain + "api/v2/store/order", GET_METHOD_NAME], false
			],
			["juman", ["/public/json/ai_man.json", "get"],
				[Service_Domain + "api/v2/ai/face", GET_METHOD_NAME], false
			],
			["jupeople", ["/public/json/ai_people.json", "get"],
				[Service_Domain + "api/v2/ai/event", GET_METHOD_NAME], false
			],
			["julei", ["/public/json/ai_faces.json", "get"],
				[Service_Domain + "api/v2/ai/face", GET_METHOD_NAME], false
			],
			["po_julei", ["/public/json/ai_stranger_face.json", "get"],
				[Service_Domain + "api/v2/ai/event", GET_METHOD_NAME], false
			],
			["ly_cloud_list", ["/public/json/lycloudlist.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["my_cameras", ["/public/json/mycameras.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["my_ai_token", ["/public/json/getaitoken.json", "get"],
				[Service_Domain + "api/v2/service/push", GET_METHOD_NAME], false
			],
			["my_ai_cameras", ["/public/json/mycameras.json", "get"],
				[Service_Domain + "api/v2/ai/statistics", GET_METHOD_NAME], false
			],
			["my_ai_faces", ["/public/json/ai_faces.json", "get"],
				[Service_Domain + "api/v2/ai/face", GET_METHOD_NAME], false
			],
			["my_update_face", ["/public/json/ai_faces.json", "get"],
				[Service_Domain + "api/v2/ai/event", GET_METHOD_NAME], false
			],
			["my_ai_counted_cameras", ["/public/json/mycameras.json", "get"],
				[Service_Domain + "api/v2/ai/statistics", GET_METHOD_NAME], false
			],
			["add_ai_cameras", ["/public/json/mycameras.json", "get"],
				[Service_Domain + "api/v2/ai/statistics", GET_METHOD_NAME], false
			],
			["my_ai_report", ["/public/json/ai_report.json", "get"],
				[Service_Domain + "api/v2/ai/statistics", GET_METHOD_NAME], false
			],
			["my_ai_survey", ["/public/json/ai_survey.json", "get"],
				[Service_Domain + "api/v2/ai/statistics", GET_METHOD_NAME], false
			],
			["my_ai_last_survey", ["/public/json/ai_last_survey.json", "get"],
				[Service_Domain + "api/v2/ai/statistics", GET_METHOD_NAME], false
			],
			["deviceid_alarm", ["/public/json/device_alarm.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],

			["yunlist", ["/public/json/yunlist.json", "get"],
				[Service_Domain + "api/v2/store/plan", GET_METHOD_NAME], false
			],
			["creat_order", ["/public/json/creatorder.json", "get"],
				[Service_Domain + "api/v2/store/order", POST_METHOD_NAME], false
			],
			["my_orderbuys", ["/public/json/orderbuys.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["my_tickets", ["/public/json/tickets.json", "get"],
				[Service_Domain + "api/v2/store/coupon", GET_METHOD_NAME], false
			],
			["my_cards", ["/public/json/cards.json", "get"],
				[Service_Domain + "api/v2/store/coupon", GET_METHOD_NAME], false
			],
			["my_cardhistory", ["/public/json/card_history.json", "get"],
				[Service_Domain + "api/v2/store/coupon", GET_METHOD_NAME], false
			],
			["my_tickethistory", ["/public/json/ticket_history.json", "get"],
				[Service_Domain + "api/v2/store/coupon", GET_METHOD_NAME], false
			],
			["my_grant_cameras", ["/public/json/grantcameras.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["my_granted_cameras", ["/public/json/grantedcameras.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["my_camera_groups", ["/public/json/types.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["token", ["/public/json/client_token.json", "get"],
				[Service_Domain + "api/v2/connect/cctv/client_token", GET_METHOD_NAME], false
			],
			["my_cameras", ["/public/json/mycameras.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["my_devsum", ["/public/json/mycamerassum.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["my_grant_cameras", ["/public/json/grantcameras.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["my_granted_cameras", ["/public/json/grantedcameras.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["my_camera_groups", ["/public/json/types.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			// ["update_group", ["/public/json/grantcameras.json", "post"], ["/service/api.php", POST_METHOD_NAME], false],
			// ["unbind_camera_group", ["/public/json/grantcameras.json", "post"], ["/service/api.php", POST_METHOD_NAME], false],
			// ["del_group", ["/public/json/grantcameras.json", "post"], ["/service/api.php", POST_METHOD_NAME], false],
			["yuntaipreset", ["/public/json/yuntaipreset.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["yuntai_result", ["/public/json/yuntaioper.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["camerainfo", ["/public/json/deviceinfo.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["getConfigInfo", ["/public/json/deviceinfo.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["getConfigStatus", ["/public/json/devicestatus.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["getConfigCvr", ["/public/json/devicecvr.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["camerainfo_meta", ["/public/json/deviceinfo_meta.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["saveConfig", ["/public/json/deviceinfo.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["shareCamera", ["/public/json/shareCamera.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["shareCamera_ly", ["/public/json/shareCamera.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["cancelShare", ["/public/json/shareCamera.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["config_status", ["/public/json/config_status.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["config_cvr", ["/public/json/config_cvr.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["config_info", ["/public/json/config_info.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["config_server", ["/public/json/config_info.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["save_server", ["/public/json/config_info.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["config_plat", ["/public/json/config_plat.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["video_list", ["http://api.topvdn.com/aiermu/record/clips", JSONP_METHOD_NAME],
				["http://api.topvdn.com/aiermu/record/clips", JSONP_METHOD_NAME], false
			]
		],
		user: [
			["login", ["/public/json/userinfo.json", "get"],
				[Service_Domain + "api/v2/passport/user", POST_METHOD_NAME], false
			],
			["list_in_hot_video", ["/public/json/list_in_hot_video.json", "get"],
				[Service_Domain + "api/v2/chart/usershare", GET_METHOD_NAME], false
			],
			["host_user", ["/public/json/hostuserinfo.json", "get"],
				[Service_Domain + "api/v2/home/user", GET_METHOD_NAME], false
			],
			["save_seccodeinit", ["/public/json/userinfo.json", "get"],
				[Service_Domain + "api/v2/passport/user", GET_METHOD_NAME], false
			],
			["save_checkseccode", ["/public/json/userinfo.json", "get"],
				[Service_Domain + "api/v2/passport/user", GET_METHOD_NAME], false
			],
			["currentUser", ["/public/json/userinfo.json", "get"],
				[Service_Domain + "api/v2/passport/user", POST_METHOD_NAME], false
			],
			["updateName", ["/public/json/userinfo.json", "get"],
				[Service_Domain + "api/v2/passport/user", POST_METHOD_NAME], false
			],
			["updatePas", ["/public/json/userinfo.json", "get"],
				[Service_Domain + "api/v2/passport/user", POST_METHOD_NAME], false
			],
			["updateMobile", ["/public/json/userinfo.json", "get"],
				[Service_Domain + "api/v2/passport/user", POST_METHOD_NAME], false
			],
			["updateEmail", ["/public/json/userinfo.json", "get"],
				[Service_Domain + "api/v2/passport/user", POST_METHOD_NAME], false
			],
			["sentverify_user", ["/public/json/userinfo.json", "get"],
				[Service_Domain + "api/v2/passport/user", GET_METHOD_NAME], false
			],
			["checkauth_user", ["/public/json/userinfo.json", "get"],
				[Service_Domain + "api/v2/passport/user", GET_METHOD_NAME], false
			],
			["host_share_videos", ["/public/json/user_share_videos.json", "get"],
				[Service_Domain + "api/v2/search", GET_METHOD_NAME], false
			],
			["host_visitors", ["/public/json/user_host_visitors.json", "get"],
				[Service_Domain + "api/v2/home/user", GET_METHOD_NAME], false
			],
			["host_visitors_record", ["/public/json/visitorsrecord.json", "get"],
				[Service_Domain + "api/v2/home/user", GET_METHOD_NAME], false
			],
			["comments", ["/public/json/user_comments.json", "get"],
				[Service_Domain + "api/v2/home/user", GET_METHOD_NAME], false
			],
			["submit_reply", ["/public/json/user_comments.json", "get"],
				[Service_Domain + "api/v2/home/user", POST_METHOD_NAME], false
			]

		],
		search: [
			["search_videos", ["/public/json/searchVideos.json", "get"],
				[Service_Domain + "api/v2/search", GET_METHOD_NAME], false
			],
			["search_users", ["/public/json/searchUsers.json", "get"],
				[Service_Domain + "api/v2/search", GET_METHOD_NAME], false
			],
			["search_history", ["/public/json/searchHistory.json", "get"],
				[Service_Domain + "api/v2/search/keyword", GET_METHOD_NAME], false
			]
		],
		profile: [
			["add_snapshot", ["/public/json/addsnapshot.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["snapshot_info", ["/public/json/snapshotInfo.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],
			["user_info", ["/public/json/personalInfo.json", "get"],
				[Service_Domain + "api/v2/user", GET_METHOD_NAME], false
			],
			["personal_videos", ["/public/json/personalvideos.json", "get"],
				[Service_Domain + "api/v2/pcs/device", GET_METHOD_NAME], false
			],

			["invoice", ["/public/json/invoice.json", "get"],
				["/public/json/invoice.json", "get"], false
			],
			["map", ["/public/json/mapdata.json", "get"],
				["/public/json/mapdata.json", "get"], false
			],
			["street", ["/public/json/mapstreet.json", "get"],
				["/public/json/mapstreet.json", "get"], false
			],

			["orders", ["/public/json/personalorders1.json", "get"],
				[Service_Domain + "api/v2/store/order", GET_METHOD_NAME], false
			],
			["street2", ["/public/json/mapstreet.json", "get"],
				[Service_Domain + "api/v2/store/invoice", POST_METHOD_NAME], false
			],
			["myorder", ["/public/json/myorder1.json", "get"],
				[Service_Domain + "api/v2/store/order", GET_METHOD_NAME], false
			],
			["deleteordernumber", ["/public/json/personalorders.json", "get"],
				[Service_Domain + "api/v2/store/order", POST_METHOD_NAME], false
			],
			["addKa", ["/public/json/personalorders.json", "get"],
				[Service_Domain + "api/v2/store/coupon", POST_METHOD_NAME], false
			],
			["addTicket", ["/public/json/personalorders.json", "get"],
				[Service_Domain + "api/v2/store/coupon", POST_METHOD_NAME], false
			],
			["kapay", ["/public/json/personalorders.json", "get"],
				[Service_Domain + "api/v2/store/order", POST_METHOD_NAME], false
			],
			["payTicket", ["/public/json/personalorders.json", "get"],
				[Service_Domain + "api/v2/store/order", POST_METHOD_NAME], false
			],
			["recordpay", ["/public/json/personalorders.json", "get"],
				[Service_Domain + "api/v2/store/order", POST_METHOD_NAME], false
			],
			["paymoney", ["/public/json/personalorders.json", "get"],
				[Service_Domain + "api/v2/store/payment", GET_METHOD_NAME], false
			],

			["suggest_videos", ["/public/json/lastestVideos.json", "get"],
				[Service_Domain + "api/v2/recommend", GET_METHOD_NAME], false
			],
			["check_userinfo_newemail", ["/public/json/userinfo.json", "get"],
				[Service_Domain + "api/v2/passport/user", GET_METHOD_NAME], false
			],
			["check_userinfo_newmobile", ["/public/json/userinfo.json", "get"],
				[Service_Domain + "api/v2/passport/user", GET_METHOD_NAME], false
			],
			["check_userinfo_newpassword", ["/public/json/userinfo.json", "get"],
				[Service_Domain + "api/v2/passport/user", GET_METHOD_NAME], false
			],
			["check_userinfo_newusername", ["/public/json/userinfo.json", "get"],
				[Service_Domain + "api/v2/passport/user", GET_METHOD_NAME], false
			],
			["submit_multitype", ["/public/json/multitypes.json", "get"],
				[Service_Domain + "api/v2/multiscreen/layout", GET_METHOD_NAME], false
			],
			["submit_multiplayinfo", ["/public/json/multiplayinfo.json", "get"],
				[Service_Domain + "api/v2/multiscreen/display", GET_METHOD_NAME], false
			],
			["get_multitypes", ["/public/json/multitypes.json", "get"],
				[Service_Domain + "api/v2/multiscreen/layout", GET_METHOD_NAME], false
			],
			["get_multidisplays", ["/public/json/multidisplays.json", "get"],
				[Service_Domain + "api/v2/multiscreen/display", GET_METHOD_NAME], false
			],
			["map_marker", ["/public/json/map_marker.json", "get"],
				[Service_Domain + "api/v2/map/marker", GET_METHOD_NAME], false
			],
			["add_map_marker", ["/public/json/add_marker.json", "get"],
				[Service_Domain + "api/v2/map/marker", POST_METHOD_NAME], false
			],
			["add_build", ["/public/json/add_build.json", "get"],
				[Service_Domain + "api/v2/map/marker", POST_METHOD_NAME], false
			],
			["del_map_device", ["/public/json/add_marker.json", "get"],
				[Service_Domain + "api/v2/map/marker", POST_METHOD_NAME], false
			],
			["del_map_build", ["/public/json/add_marker.json", "get"],
				[Service_Domain + "api/v2/map/marker", POST_METHOD_NAME], false
			],
			["add_map_build", ["/public/json/add_map_build.json", "get"],
				[Service_Domain + "api/v2/map/marker", POST_METHOD_NAME], false
			],

			["analysis_user_totle", ["/public/json/analysis.json", "get"],
				[Service_Domain + "api/v2/map/marker", POST_METHOD_NAME], false
			]

		],
		common: [
			["get_weixin_key", ["/public/json/signature.json", "get"],
				["/service/getSignature.php", GET_METHOD_NAME], false
			],
			["get_qrcode_key", ["/public/json/signature.json", "get"],
				[Service_Domain + "api/v2/util/qrcode", GET_METHOD_NAME], false
			],
			["get_activity_data", ["/public/json/activity.json", "get"],
				[Service_Domain + "api/v2/web/page", GET_METHOD_NAME], false
			],
			["get_app_msg_detail", ["/public/json/appmsgdetail.json", "get"],
				[Service_Domain + "api/v2/web/page", GET_METHOD_NAME], false
			]
		]

	};

	var urlRouteUrls = [
		["videoRtmpPreviewUrl", "rtmp://10.143.13.59:1935/qhwljia/{sn}", "rtmp://10.143.13.59:1935/qhwljia/{sn}"],
		["videoHlsPreviewUrl", "http://10.143.13.59:80/qhwljia/{sn}/index.m3u8", "http://10.143.13.59:80/qhwljia/{sn}/index.m3u8"],
		["publicVideoPlayUrl", "/video.html?shareid={shareid}&uk={uk}", "/video.html?shareid={shareid}&uk={uk}"],
		["privateVideoPlayUrl", "/view.html?deviceid={deviceid}", "/view.html?deviceid={deviceid}"]
	];

	var getServerRouteUrl = function (_action, _mode) {
		var _actionArr = _action.split("_");
		var _ext_action = _action.replace(_actionArr[0] + "_", "");
		var i;
		for (i = 0; i < serviceRouteUrls[_actionArr[0]].length; i++) {
			if (serviceRouteUrls[_actionArr[0]][i][0] === _ext_action) {
				return {
					url: (_mode || CURRENT_PROJECT_MODE) === "develop" ? serviceRouteUrls[_actionArr[0]][i][1][0] : serviceRouteUrls[_actionArr[0]][i][2][0],
					type: (_mode || CURRENT_PROJECT_MODE) === "develop" ? serviceRouteUrls[_actionArr[0]][i][1][1] : serviceRouteUrls[_actionArr[0]][i][2][1]
				};
			}
		}
		return null;
	};
	if (typeof exports !== "undefined") {
		module.exports = {
			serviceRouteUrls: serviceRouteUrls,
			urlRouteUrls: urlRouteUrls,
			getServerRouteUrl: getServerRouteUrl
		};
	} else {
		window.IERMU_SERVER_ROUTES = {
			serviceRouteUrls: serviceRouteUrls,
			urlRouteUrls: urlRouteUrls,
			getServerRouteUrl: getServerRouteUrl
		};
	}
})();
