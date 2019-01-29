define(["js/callserver/cservice", "ui_videoplayer", "IX"], function(CallServer, VideoPlayer) {

  var languages = {
    "zh-cn": {
      "lp1": "上一页",
      "lp2": "下一页"
    },
    "en": {
      "lp1": "prev",
      "lp2": "next"
    }
  };

  var tpl = new IX.ITemplate({
    tpl: [
      "<div class='pagedown'>",
      "<a class='tprev' target='_blank'><span>" + languages[CURRENT_PROJECT_LANGUAGE].lp1 + "</span></a>",
      "<a class='tnext' target='_blank'><span>" + languages[CURRENT_PROJECT_LANGUAGE].lp2 + "</span></a>",
      "</div>"
    ]
  });

  var currentPageIndex = 1,
    maxPageIndex, pageSize = 0,
    count = 0;
  var i, j;
  var $container, items, rows, cols;
  var timeTrigger;
  var currentVideos = [];
  var videoWidth, videoHeight;
  var MultiScreenPlayer;
  MultiScreenPlayer = function(cfg) {
    var errornum = 0;
    var config,makeTable,onChanged,bindEvent,bindVideoList,bindBaseInfo,bindVideo,timingTask,init; //,onPlaying,onError
    config = _.extend({
      container: null,
      items: null,
      rows: 2,
      cols: 2,
      isPrivate: true
    }, cfg);

    makeTable = function() {
      var playerH = (IX.getUrlParam("height") || $(document).height());
      var playerW = IX.getUrlParam("width") || $(document).width();
      var mtop = 0,str;

      var n = 0;
      if (rows === cols) {
        videoWidth = playerH / rows * 16 / 9;
        videoHeight = playerH / rows;
      } else {
        videoWidth = playerW / cols;
        videoHeight = playerW / cols * 9 / 16;
        mtop = (playerH - videoHeight * rows) / 2;
      }
      str = "<table style='margin-top:" + mtop + "px;'>";
      for (i = 0; i < rows; ++i) {
        str += "<tr style = 'height:" + videoHeight + "px;'>";
        for (j = 0; j < cols; ++j) {
          n++;
          str += "<td class=video" + n + " style = 'width:" + videoWidth + "px'><div class = dvideo" + n + "></div></td>";
        }
        str += "</tr>";
      }
      str += "</table>";
      $container.append(str);
    };

    onChanged = function(currentPageIndex) {
      var i;
      var v = pageSize * currentPageIndex > count ? count : pageSize * currentPageIndex;
      var prevVideos = [];
      $container.find("table").remove();
      makeTable();

      prevVideos = currentVideos;
      for (i = prevVideos.length - 1; i >= 0; i--) {
        prevVideos[i].destroy();
      }
      currentVideos = [];

      // spnum = v - pageSize * (currentPageIndex - 1);
      for (i = pageSize * (currentPageIndex - 1); i < v; i++) {
        bindBaseInfo(items[i], i - pageSize * (currentPageIndex - 1));
      }
    };

    bindEvent = function() {
      $container.mousemove(function() {
        var tt;
        $container.find(".pagedown").addClass("movescr");
        clearTimeout(tt);
        tt = setTimeout(function() {
          $container.find(".pagedown").removeClass("movescr");
        }, 2000);
      });

      $(window).resize(function() {
        var i;
        var v = maxPageIndex <= 1 ? count : pageSize;
        currentVideos = [];
        $container.find("table").remove();
        makeTable();
        // spnum = v;
        for (i = 0; i < v; i++) {
          bindBaseInfo(items[i], i);
        }
      });

      $container.find(".pagedown a").click(function(e) {
        var $target = $(e.target || e.srcElement);
        clearInterval(timingTask);
        if ($target.is("a.tprev") || $target.parents("a").is("a.tprev")) {
          if (currentPageIndex <= 1) {
            currentPageIndex = maxPageIndex + 1;
          }
          currentPageIndex--;
          // if(currentPageIndex === (maxPageIndex - 1)) {$container.find("a").removeClass("disnext");}
          // if(currentPageIndex === 1) {$container.find("a.tprev").addClass("disprev");}
        } else if ($target.is("a.tnext") || $target.parents("a").is("a.tnext")) {
          if (currentPageIndex >= maxPageIndex) {
            currentPageIndex = 0;
          }
          currentPageIndex++;
          // if(currentPageIndex === 2) {$container.find("a").removeClass("disprev");}
          // if(currentPageIndex === maxPageIndex) {$container.find("a.tnext").addClass("disnext");}
        } else {
          return;
        }

        onChanged(currentPageIndex);
        // tag = false;
      });
    };

    bindVideoList = function() {
      var v,i;
      count = items.length;
      if (count === 0) {
        return;
      }
      pageSize = rows * cols;
      maxPageIndex = Math.ceil(count / pageSize);
      if (maxPageIndex > 1) {
        $container.find("a").show();
      }
      makeTable();
      v = maxPageIndex <= 1 ? count : pageSize;
      // spnum = v;
      for (i = 0; i < v; i++) {
        bindBaseInfo(items[i], i);
      }
      currentPageIndex = 1;
    };

    bindBaseInfo = function(_dev, _i) {
      var deviceInfo = {};
      // var deviceId;
      CallServer.CallServer["video_add_view_count_callserver"]({
        method: "view",
        deviceid: _dev.deviceid
      }, function() {
        //todo
      });

      CallServer.CallServer["camera_camerainfo_meta_callserver"](_.extend({
        method: "meta"
      }, !config.isPrivate ? {
        shareid: _dev.shareid,
        uk: _dev.uk
      } : {
        deviceid: _dev.deviceid
      }), function(_data) {
        if (!_data || _data.error_code) {
          errornum++;
          bindBaseInfo(_dev, _i);
          if (errornum > 2) {
            errornum = 0;
            return;
          }
          return;
        }
        errornum = 0;
        if (_dev.shareid) {
          // deviceId = _data.deviceid;
          deviceInfo = _data;
          deviceInfo.isMyCamera = false;
          deviceInfo.shareid = _dev.shareid;
          deviceInfo.uk = _dev.uk;
        } else {
          deviceInfo = _data;
          deviceInfo.isMyCamera = true;
        }
        bindVideo($container.find("td").eq(_i), deviceInfo);
      }, function() {
        if (_dev.shareid) {
          // deviceId = _dev.deviceid;
          deviceInfo = _dev;
          deviceInfo.isMyCamera = false;
          deviceInfo.shareid = _dev.shareid;
          deviceInfo.uk = _dev.uk;
        } else {
          deviceInfo = _dev;
          deviceInfo.isMyCamera = true;
        }
        bindVideo($container.find("td").eq(_i), deviceInfo);
      });
    };
    // onPlaying = function(_deviceInfo) {
    //   if (maxPageIndex === 1) {
    //     return;
    //   }
    //   if (!_deviceInfo.isSt) {
    //     p_num++;
    //     _deviceInfo.isSt = true;
    //   }
    //   timingTask();
    // };
    // onError = function(_deviceInfo) {
    //   if (maxPageIndex === 1) {
    //     return;
    //   }
    //   if (!_deviceInfo.isSt) {
    //     e_num++;
    //     _deviceInfo.isSt = true;
    //   }
    //   timingTask();
    // };

    bindVideo = function($can, _deviceInfo) {
      // var playerW = IX.getUrlParam("width") || $(document).width();
      var videoPlayerManager = new VideoPlayer({
        container: $can.find("div"),
        // language: CURRENT_PROJECT_LANGUAGE,
        // width: videoWidth,
        // height: videoHeight,
        // showOps: false,
        // alwaysShowHistory: false,
        showDesc: true,
        IsMuted: true,
        // onPlaying: function() {
        //   onPlaying(_deviceInfo);
        // },
        // onError: function() {
        //   onError(_deviceInfo);
        // },
        language: CURRENT_PROJECT_LANGUAGE,
        plugins: [],
        width: videoWidth,
        height: videoHeight,
        isPrivate: config.isPrivate,
        showMenu: false
      });
      videoPlayerManager.bindData(_deviceInfo);
      currentVideos.push(videoPlayerManager);
    };

    timingTask = function() {
      clearInterval(timeTrigger);
      // if (spnum <= p_num + e_num && spnum !== 0) {
        // tag = true;
        timeTrigger = setInterval(function() {
          $container.find(".pagedown a.tnext").trigger("click");
        }, 30000);
      // }
    };


    init = function() {
      $container = $(config.container);
      $container.html(tpl.renderData("", {}));
      items = config.items;
      rows = config.rows;
      cols = config.cols;

      if (items.length !== 0 && items.length % (rows * cols) !== 0 && items.length > (rows * cols)) {
        items = items.concat(items.slice(0, (rows * cols) - items.length % (rows * cols)));
      }
      bindEvent();
      bindVideoList();
      if(items.length > rows * cols){
        timingTask();
      }
    };

    init();
  };

  return MultiScreenPlayer;
});
