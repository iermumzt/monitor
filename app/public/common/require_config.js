/*eslint no-unused-vars: "off"*/
var APP_CONFIG = {
  baseUrl: "/public/",
  paths: {
    angular: "js/angular/angular",
    angularRoute: "js/angular/angular-route",
    angularResource: "js/angular/angular-resource",
    angularSanitize: "js/angular/angular-sanitize",
    angularTouch: "js/angular/angular-touch",
    angularAnimate: "js/angular/angular-animate.min",
    angularWebsocket:"js/angular/angular-websocket",
    builtAConfig: "common/builtAConfig",
    builtConfig: "common/builtConfig",
    almond: "js/lib/almond",

    bootstraps: "js/bootstraps",
    bootstrap: "js/bootstraps/bootstrap",
    uibootstrap: "js/bootstraps/ui-bootstrap-tpls",

    jquery: "js/lib/jquery",
    underscore: "js/lib/underscore",
    IX: "js/lib/ixutils",
    zbase: "js/lib/zbase",
    ronate: "js/lib/ronate",
    oauth: "js/lib/oauth",
    md5: "js/lib/md5",
    parallax: "js/lib/parallax",
    activitymanager: "js/lib/activity",
    socketio:"js/lib/socket.io",

    Echarts: "js/lib/echarts-all",
    Echarts_line: "js/lib/line",
    Calendar: "js/lib/calendar",
    tn_code: 'js/lib/sli',

    ui_pagination: "js/ui/ui_pagination",
    ui_log: "js/ui/ui_log",
    ui_wrapscroll: "js/ui/ui_wrapscroll",
    ui_nicescroll: "js/ui/ui_nicescroll",
    ui_superslide: "js/ui/superSlide",
    ui_uploadify: "js/ui/uploadify/jquery.uploadify",
    ui_Huploadify: "js/ui/uploadify/jquery.Huploadify",
    ui_webuploader:"js/ui/WebUploader/webuploader",
    ui_multiscreen: "js/ui/ui_multiscreen",
    ui_dateRange: 'js/ui/dateRange',

    ui_videoplayer: "js/ui/videoplayer/player",
    ui_videoplayer2: "js/ui/ui_videoplayer",
    ui_datetimepicker: "js/datetimepicker/bootstrap-datetimepicker",
    ui_datetimepicker_zhcn: "js/datetimepicker/locales/bootstrap-datetimepicker.zh-CN",

    ui_arrowpager: "components/ui-arrowpager/component",
    ui_dialog: "components/ui-dialog/component",

    ui_face_tracking: "js/face/tracking",
    ui_face_eye: "js/face/eye",
    ui_face_mouth: "js/face/mouth",
    ui_face_face: "js/face/face",
    ui_facedetection: "js/face/jquery.facedetection",
    ui_canvas: "js/ui/particleground",

    serverroutes: "common/service-routes",

    s_layoutmanager: "js/services/layout",
    s_videosfilter: "js/services/videosfilter",

    s_profile: "js/services/profile",
    s_profess: "js/services/profess",
    s_video: "js/services/video",
    s_logvideo: "js/services/logvideo",
    s_user: "js/services/user",
    s_update: "js/services/accounting",

    f_servicecallback: "js/factories/ajax-data-pipe",
    f_callserver: "js/factories/callserver",

    fi_htmlnum: "js/filters/htmlnum",
    fi_htmlParse: "js/filters/htmlparse",
    fi_stranger: "js/filters/isStranger",

    d_videos: "js/directive/videos/videos",
    d_preset: "js/directive/preset/preset",
    d_comments: "js/directive/comments/comments",
    d_commenteditor: "js/directive/commenteditor/commenteditor",
    d_batchconfig: "js/directive/batchconfig/batchconfig",
    d_usersearchlist: "js/directive/usersearchlist/usersearchlist",
    d_supportquestions: "js/directive/supportquestions/supportquestions",
    d_nodata: "js/directive/nodata/nodata",

    d_camera_tree_list: "components/d-camera-tree-list/component",
    d_camera_identification: "components/d-camera-identification/component",
    //  民政通
    d_camera_identification_mzt: "components/d-camera-identification-mzt/component",
    d_camera_bident: "components/d-camera-bident/component",

    d_echarts_line: "components/d-echarts-line/component",
    
    d_loading: "js/directive/loading/loading",
    d_playrecordrightviews: "js/directive/playrecordrightviews/playrecordrightviews",
    d_rightviews: "js/directive/rightviews/rightviews",
    d_fanlist: "js/directive/fanlist/fanlist",
    d_mtopnav: "js/directive/mtopnav/mtopnav",

    d_modal: "components/d-modal/component",
    d_video_summary: "components/d-video-summary/component",
    d_video_thumbnail: "components/d-video-thumbnail/component",
    d_video_summary_list: "components/d-video-summary-list/component",
    d_search_box: "components/d-search-box/component",
    d_video_search_box: "components/d-video-search-box/component",
    d_help_search_box: "components/d-help-search-box/component",

    d_camera_summary: "components/d-camera-summary/component",
    d_camera_summary_list: "components/d-camera-summary-list/component",
    d_camera_list: "components/d-camera-list/component",

    d_data_left_nav: "components/d-data-left-nav/component",
    d_formvalidater: "components/d-formvalidater/component",

    d_pagination_list: "components/d-pagination-list/component",
    d_no_data: "components/d-no-data/component",
    d_video_list_loading: "components/d-video-list-loading/component",
    d_comment_editor: "components/d-comment-editor/component",
    d_comments_list: "components/d-comments-list/component",
    d_preset_list: "components/d-preset-list/component",
    d_video_loading: "components/d-video-loading/component",
    d_profile_search: "components/d-profile-search/component",
    d_auto_focus: "components/d-auto-focus/component",

    d_camera_multiview: "components/d-camera-multiview/component",
    d_draggable: "components/d-draggable/component",

    d_finish_filters: "components/d-finish-filters/component",

    emobile: "components/e-mobile/component",
    e_hammer: "js/lib/hammer",

    app: "common/app",
    init: "common/init",
    init_no_angular: "common/init_no_angular"
  },
  shim: {
    app: {
      deps: ["angular", "angularRoute", "angularTouch", "angularResource", "angularSanitize", "bootstrap", "underscore", "IX", "uibootstrap", "f_callserver", "d_formvalidater"]
    },
    angularTouch: {
      deps: ["angular"]
    },
    angularWebsocket: {
      deps: ["angular"]
    },
    angularAnimate: {
      deps: ["angular"]
    },
    angularSanitize: {
      deps: ["angular"]
    },
    d_draggable:{
      deps: ["angular","jquery"]
    },
    emobile:{
      deps: ["angular"]
    },
    parallax:{
      deps: ["jquery"]
    },
    ui_baseplayer: {
      deps: ["ui/swfobject", "ui/blsplayer"]
    },
    ui_nicescroll: {
      deps: ["jquery"]
    },
    ui_facedetection:{
        deps: ["jquery"]
    },
    ui_face_eye:{
        deps:["ui_face_tracking"]
    },
    ui_face_mouth:{
        deps:["ui_face_tracking"]
    },
    ui_face_face:{
        deps:["ui_face_tracking"]
    },
    ui_superslide: {
      deps: ["jquery"]
    },
    ui_canvas: {
      deps: ["jquery"]
    },
    tn_code: {
      deps: ["jquery"]
    },
    Calendar: {
      deps: ["jquery"]
    },
    Echarts: {
      deps: ["angular","jquery"]
    },
    Echarts_line: {
      deps: ["Echarts"]
    },
    ui_datetimepicker: {
      deps: ["jquery"]
    },
    ui_dateRange: {
      deps: ["jquery"]
    },
    ui_uploadify: {
      deps: ["jquery"]
    },
    ui_Huploadify: {
      deps: ["jquery"]
    },
    ui_pullToRefresh: {
      deps: ["ui_iscroll"]
    },
    ui_datetimepicker_zhcn: {
      deps: ["ui_datetimepicker"]
    },
    uibootstrap: {
      deps: ["angular", "bootstrap"]
    },
    angularRoute: {
      deps: ["angular"]
    },
    angularResource: {
      deps: ["angular"]
    },
    bootstrap: {
      deps: ["jquery"]
    },
    underscore: {
      exports: "_"
    },
    jquery: {
      exports: "$"
    },
    angular: {
      deps: ["jquery"]
    }
  },
  /*deps: ["uibootstrap", "f_callserver", "d_formvalidater"],*/
  appDepModules: ["ngRoute", "ngResource", "ngTouch", "ngSanitize", "ui.bootstrap", "CallServer", "FormValidater"]
} /*APP_CONFIG = APP_CONFIG*/ ;
