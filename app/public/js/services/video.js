define(["app", "underscore", "f_servicecallback"], function(Services) {

  Services.service("VideoService", [
    "ServiceCallBack",
    "video_top_videos_callserver", 
    "video_hot_videos_callserver", 
    "video_lastest_videos_callserver", 
    "video_suggest_videos_callserver", 
    "video_videos_callserver",
    "video_comments_callserver", 
    "search_search_videos_callserver", 
    "video_public_categories_callserver",
    "common_get_qrcode_key_callserver",
    "video_getLivePlayUrl_callserver",
    function(ServiceCallBack, TopVideosCallServer, HotVideosCallServer, LastestVideosCallServer, SuggestVideosCallServer,
      VideoQueryCallServer, commentsCallServer, SearchVideosCallServer, VideoPublicCategoriesCallserver,
       CommonGetQrcodeKeyCallServer, videoGetLivePlayUrlCallserver) {
      this.getPublicCategories = function(_params) {
        return VideoPublicCategoriesCallserver.query(_.extend({
          method: 'listcategory',
          type: 'pub',
          lang: _params ? (_params.lang || "zh-cn") : "zh-cn"
        }, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, true);
          return _data;
        });

      };
      //验证视频密码
      this.getCheckPlayPassWord = function(_params) {
        return videoGetLivePlayUrlCallserver.query(_.extend({
          method: 'liveplay'
        }, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, true);
          return _data;
        })
      }
      //获取二维码
      this.getQrcodeKey = function(_params) {
        return CommonGetQrcodeKeyCallServer.query(_.extend({
        }, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, true);
          return _data;
        })
      }
      //获取精选页面－banner区域列表
      this.getTopBannerVideos = function(_params) {
        return TopVideosCallServer.query(_.extend({
          method: "banner",
          list_type: "page",
          page: 1,
          count: 8,
          lang: "zh-cn"
        }, _params)).$promise.then(function(_data) {
          var i, ci, j, cj;
          _data = ServiceCallBack.renderData(_data, true);

          for(i = 0; i < _data.list.length; i ++){
            ci = _data.list[i];
            ci.files_hash = {};
            if(ci.files && ci.files.length > 0){
              for(j = 0; j < ci.files.length; j ++){
                cj = ci.files[j];
                ci.files_hash[cj.type] = cj.url;
              }
            }
          }
          return _data;
        });

      };

      //获取精选页面－精彩推荐区域列表
      this.getRecommendVideos = function(_params) {
        return HotVideosCallServer.query(_.extend({
          method: 'listshare'
        }, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, true);
          return _data;
        });

      };
      //获取精选页面－最新视频区域列表
      this.getLastestVideos = function(_params) {
        return LastestVideosCallServer.query(_.extend({
          method: 'listshare'
        }, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, true);
          return _data;
        });
      };
      //获取精选页面－猜你喜欢区域列表,相关推荐列表
      this.getSuggestVideos = function(_params) {
        return SuggestVideosCallServer.query(_.extend({
          method: 'share',
          client_id: "odSy5LEuE3TF6LF9kYva"
        }, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, true);
          return _data;
        });
      };
      //获取直播页面－列表
      this.getQueryVideos = function(_params) {
        return VideoQueryCallServer.query(_.extend({
          method: 'listshare'
        }, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, true);
          return _data;
        });

      };
      //获取视频评论－列表
      this.getVideoComments = function(_params) {
        return commentsCallServer.query(_.extend({
          method: 'listcomment'
        }, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, true);
          return _data;
        });

      };
      //获取搜索视频 ——列表
      this.getSearchVideos = function(_params) {

        return SearchVideosCallServer.query(_.extend({
          type: "share",
          device_type: "all"
        }, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, true);
          return _data;
        });

      };
    }
  ]);
});