define(["js/ui/videoplayer/plugins", "js/callserver/cservice", "js/ui/swfobject", "js/ui/blsplayer", "js/ui/videoplayer/baseplayer"], function(plugins, CallServer) {
  var languages = {
    "zh-cn": {
      "lp67": "设备已取消分享！",
      "lp68": "设备已离线！",
      "lp69": "设备已关机！",
      "lp70": "加载失败，请刷新重试！"
    },
    "en": {
      "lp67": "Equipment has been canceled to share!",
      "lp68": "Camera has been offline!",
      "lp69": "Camera has been off!！",
      "lp70": "加载失败，请刷新重试！"
    },
    "jp":{
      "lp67": "カメラは共有されていません！",
      "lp68": "オフライン！",
      "lp69": "電源オフ",
      "lp70": "加载失败，请刷新重试！"
    }
  };
  var tpl = [
    '<div class="show-desc">',
      '<div class = "bg"></div>',
      '<a target="_blank"></a>',
    '</div>',
    "<div class = 'player-main'></div>",
    "<div class = 'menus'>",
    "<div class = 'opacity-bg'></div>",
    "</div>"
  ].join("");

  var menuTpl = "<div class = 'menu {d_clz} {clz}'><a class = '{clz}' title='{title}'><i class = '{i_clz}'></i></a></div>";
  var menuWrapTpl = "<div class = 'menu {d_clz} {clz}'></div>";
  var VideoPlayer;
  ZBPlayer.plugins = plugins;
  VideoPlayer = function(cfg) {
    var config = _.extend({
      plugins: ["fullscreen", "cloud-config", "volume-control", "size-control", {
          name: "video",
          menus: ["video-jianji", "video-pause", "video-history-btn", "video-liveplay"]
        },
        "ops", "share", "snapshot"
      ],
      playType: "all",
      container: null,
      width: "auto",
      height: "auto",
      language: "zh-cn",
      isMuted :false, //true静音
      showDesc: false,//显示标题
      isPrivate: false, //是否为个人摄像机观看，即请求后台的参数中使用shareid/uk或者deviceid
      videoLivePlayData: null, //直播数据
      currentUser: null,
      yuntaiType: 1, // 云台菜单显示类型，1，播放器菜单栏显示；2，在播放器右上角显示
      onYunTaiConfig: null,
      menuFloat: "auto", //菜单浮动状态, auto/fixed/false
      isProfessional : false,
      showMenu: true, //显示菜单
      controls: true, //only for html5 video
      enableWindowMessage: false //only for html5 video，是否允许播放器接收postmessage的命令，具体可参见baseplayer.js->HTML5Player->window.addEventListener("message"...  一段
    }, cfg);

    var $container, $menus, $error, hasDestroy = false, errorNum = 1,hasStop = 1;
    var $topWarning, topWarningTrigger,showPlayerTopMsg;
    var loaded_plugins = {},
      player, currentPlayUrl = "";
    var deviceInfo, getLivePlayUrlTimer, playCategory = "live_play",
      playType = "rtmp",
      checkHlsTrigger;
    //var height,width; 

    var addMenu,loadPlugins,registEvent,on,trigger, showErrorMsg, checkHlsUrlExists, playLiveVideo, bindData, bindEvent, onPlayStateChanged,
     resize, init, _model, events;

    showErrorMsg = function(_t){
      if(_t){
        $error.html(_t);
        $container.addClass("has-error");
      }else{
        $container.removeClass("has-error");
      }
    };
    showPlayerTopMsg = function(_t, _type){
      if(_t){
        if(topWarningTrigger){
          clearTimeout(topWarningTrigger);
          $topWarning.children().remove();
          // $topWarning.removeClass('bounceInDown animated infinite');
        } 

        $topWarning.html("<p class = " + _type + "><i class='pic-preset'></i><span class = 'info'>" + _t + "</span></p>");
        // $topWarning.addClass('bounceInDown animated infinite');
        topWarningTrigger = setTimeout(function() {
          $topWarning.children().remove();
        },3000);
      }else{
        $container.removeClass("has-error");
      }
    };
    playLiveVideo = function() {
      var failFn, callbackFn, getLivePlayUrl;
      if (getLivePlayUrlTimer) {
        clearTimeout(getLivePlayUrlTimer);
      }
      failFn = function(data) {
        if(hasDestroy) return;
        if (data && data.error_code) {
          showErrorMsg(data.error_msg === "device share not exist" ? languages[config.language]['lp67'] : data.error_msg);
          trigger("live_play_url_error");
          return;
        }
        if (data && data['status'] !== undefined && ( Number(data['status']) === 0)) {
          showErrorMsg(languages[config.language]['lp68']);
          trigger("live_play_url_error");
          return;
        }
        if (data && data['status'] !== undefined && ( data['status'] & 0x4) === 0) {
          showErrorMsg(languages[config.language]['lp69']);
          trigger("live_play_url_error");
          return;
        }
        getLivePlayUrlTimer = setTimeout(function() {
          getLivePlayUrl();
        }, 200);

      };
      callbackFn = function(data) {
        if(hasDestroy) return;
        config.videoLivePlayData = null;
        if (!data || typeof(data['url']) === 'undefined' && typeof(data['src']) === 'undefined' || (data['status'] & 0x4) === 0) {
          failFn(data);
          return;
        }
        currentPlayUrl = data["url"] || data["src"];
        deviceInfo.description = data['description'];
        deviceInfo.playUrl = currentPlayUrl;
        if (IX.browser.versions.mobile) {
          checkHlsUrlExists();
        } else if (playCategory === "live_play") {
          playType = "rtmp";
          player.play(currentPlayUrl, playType);
        }
      };
      if (config.videoLivePlayData) {
        return callbackFn(config.videoLivePlayData);
      }
      getLivePlayUrl = function() {
        var ex;
        if(hasDestroy) return;
        CallServer.CallServer["video_getLivePlayUrl_callserver"](_.extend({
          method: "liveplay"
        }, !config.isPrivate ? {
          shareid: deviceInfo.shareid,
          uk: deviceInfo.uk,
          password:  deviceInfo.password
        } : {
          deviceid: deviceInfo['deviceid']
        }, playType === "hls" ? {
          type: "hls"
        } : {}), callbackFn, function(data) {
          try {
            ex = JSON.parse(data.responseText);
            failFn(ex);
          } catch (ex) {
            failFn();
          }
        });
      };

      getLivePlayUrl();
    };

    events = {
      "destroy": [{
        key: "videoplayer",
        fn: function(){
          hasDestroy = true;
          if(getLivePlayUrlTimer) clearTimeout(getLivePlayUrlTimer);
          if(checkHlsTrigger) clearTimeout(checkHlsTrigger);
          if(player) player.destroy();
        }
      }],
      "on_hls_time_update": [],
      "play-state-changed": [{
        key: "videoplayer",
        fn: function(_state, _prev_state) {
          console.info(_state, _prev_state);
          if(_state !== "stop"){
            showErrorMsg("");
          }
          if (_state === "stop" && _prev_state !== "stop") {
            var kk;
            clearTimeout(kk);
            if (playCategory === "live_play") {
              kk = setTimeout(function() {
                if (_state === "stop") {
                  hasStop = hasStop + 1;
                  if (hasStop > 10) {
                    showErrorMsg(languages[config.language]['lp70']);
                    trigger("live_play_url_error");
                    return;
                  } else {
                    $container.find(".play-type-menus button.play-zhibo").trigger("click");
                  }
                }
              }, 1000*20);
            // if (playCategory === "live_play") {
            //   playLiveVideo();
            // }
            }
          } else if (_state === "failed") {
            showErrorMsg(languages[config.language]['lp70']);
            trigger("live_play_url_error");
            return;
          }
        }
      }], //播放状态
      "play-type-changed": [], //播放类型：rtmp/hls
      "live_play_url_error": [], //当获取直播地址失败
      "scale-vedio-size": [{
        key: "videoplayer",
        fn: function(_size) {
          player.setVideoSize(_size);
        }
      }],
      "data-binded": [{
        key: "videoplayer",
        fn: function() {
          player.setStartPlayTime(deviceInfo.connect_type === 1 ? 0 : 1);
          player.setThumbnail(deviceInfo.thumbnail);
        }
      }],
      "play_category_changed": [{
        key: "videoplayer",
        fn: function(_category, _url) {
          playCategory = _category;
          if (_category === "video_play") {
            player.play(_url, "m3u8");
          } else {
            playLiveVideo();
          }
        }
      }],
      "resize": [{
        key: "videoplayer",
        fn: function(w, h) {
          resize(w, h);
        }
      }]
    };
    addMenu = function(_menu) {
      var $menu, method = "appendTo";
      var getMenuTpl = function(opt) {
        var f;
        var _tpl = menuTpl,
          pros = menuTpl.match(/\{[^\{\}]*\}/g).join();
        for (f in opt) {
          if (pros.indexOf("{" + f + "}") > -1) {
            _tpl = _tpl.replace(new RegExp("{" + f + "}", "g"), IX.isFn(opt[f]) ? opt[f](config.language, $menus) : opt[f]);
          }
        }
        return _tpl;
      };

      if (_menu.d === "right") {
        _menu.d_clz = "pull-right";
      } else {
        _menu.d_clz = "pull-left";
        method = "prependTo";
      }

      if (IX.isFn(_menu.getMenu)) {
        $menu = $(menuWrapTpl.replace("{d_clz}", _menu.d_clz).replace("{clz}", _menu.clz || ""));
        _menu.getMenu(config.language, $menu, $container, config);
      } else {
        $menu = $(getMenuTpl(_menu));
      }

      if (_menu.prev) {
        loaded_plugins[_menu.prev].menu.$.after($menu);
      } else if (_menu.behind) {
        loaded_plugins[_menu.behind].menu.$.before($menu);
      } else
        $menu[method]($menus);

      if ($menu.children().length < 1) {
        $menu.remove();
      }
      return $menu;
    };

    loadPlugins = function() {
      var i, ci, cm ;
      var loadPlugin = function(_plugin, _pluginCfg) {
        var $menu, menus, _cfg_menus, i,cmenu;
        if (_plugin.menu) {
          $menu = addMenu(_plugin.menu);
        } else if (_plugin.menus) {
          menus = [];
          _cfg_menus = _pluginCfg.menus && _pluginCfg.menus.length > 0 ? ("," + _pluginCfg.menus.join() + ",") : "";

          for (i = 0; i < _plugin.menus.length; i++) {
            if (_cfg_menus.indexOf("," + _plugin.menus[i].name + ",") === -1) continue;
            cmenu = addMenu(_plugin.menus[i]);
            menus.push($.extend({}, _plugin.menus[i], {
              $: cmenu
            }));
          }
        }
        /*jshint newcap: false */
        loaded_plugins[_plugin.key] = new _plugin({
          container: _plugin.key === "ops" ? $container.find(".play-type-menus") : $container,
          player: _model,
          menu: $menu,
          menuwrap: $menus,
          config: config,
          plugins: loaded_plugins
        });
        if (_plugin.menu) {
          loaded_plugins[_plugin.key].menu = $.extend({}, _plugin.menu, {
            $: $menu
          });
        } else if (_plugin.menus) {
          loaded_plugins[_plugin.key].menus = menus;
        }
      };

      for (i = 0; i < config.plugins.length; i++) {
        ci = config.plugins[i];
        cm = ZBPlayer.plugins[typeof ci === "string" ? ci : ci.name];
        if (!cm) {
          console.info("plugin ", ci.name || ci, " not exists!");
          continue;
        }
        try {
          loadPlugin(cm, ci);
        } catch (ex) {
          console.info("load plugin ", ci.name || ci, " error: ", ex);
        }
      }
    };

    registEvent = function(_eventType) {
      events[_eventType] = events[_eventType] || [];
    };

    on = function(_key, _eventType, _fn) {
      registEvent(_eventType);
      events[_eventType].push({
        key: _key,
        fn: _fn
      });
    };

    trigger = function(_eventType) {
      var i,args;
      if (!events[_eventType]) {
        console.info("event ", _eventType, " not exists");
        return;
      }
      i = 0;
      args = Array.prototype.slice.call(arguments);
      args.splice(0, 1);
      while (events[_eventType][i]) {
        try {
          events[_eventType][i].fn.apply(null, args);
        } catch (ex) {
          console.info("event error:", _eventType, events[_eventType][i], ex);
        }
        i++;
      }
    };
    //判断m3u8文件是否存在
    checkHlsUrlExists = function() {
      var checkHlsStatusTimes,_check;
      if (checkHlsTrigger) clearTimeout(checkHlsTrigger);
      if (player.getPlayState() === "playing") {
        return;
      }

      checkHlsStatusTimes = 0;

      _check = function() {
        if(hasDestroy) return;
        checkHlsStatusTimes++;
        if (checkHlsStatusTimes > 10) {
          errorNum = errorNum + 1;
          console.log(errorNum);
          if (errorNum > 3) {
            showErrorMsg(languages[config.language]['lp70']);
            trigger("live_play_url_error");
            return;
          } else {
            return playLiveVideo();
          }
        }
        CallServer.CallServer["video_checkHlsSatus_callserver"]({
          uri: currentPlayUrl
        }, function(_data) {
          if(hasDestroy) return;
          if (_data.error_code || _data.code !== 200) {
            if (checkHlsStatusTimes < 10) {
              checkHlsTrigger = setTimeout(_check, 200);
              return;
            } else {
              errorNum = errorNum + 1;
              console.log(errorNum);
              if (errorNum > 3) {
                showErrorMsg(languages[config.language]['lp70']);
                trigger("live_play_url_error");
                return;
              } else {
                return playLiveVideo();
              }
            }
          }
          player.play(currentPlayUrl, "m3u8");
        }, function(){
          if(hasDestroy) return;
          if (checkHlsStatusTimes < 10) {
            checkHlsTrigger = setTimeout(_check, 200);
            return;
          } else {
            errorNum = errorNum + 1;
            console.log(errorNum);
            if (errorNum > 3) {
              showErrorMsg(languages[config.language]['lp70']);
              trigger("live_play_url_error");
              return;
            } else {
              return playLiveVideo();
            }
          }
        });
      };

      _check();
    };
   

    bindData = function(_deviceInfo) {
      deviceInfo = _deviceInfo;
      $container.find(".show-desc a").text(deviceInfo.description);
      $container.find(".show-desc a").attr('href', (!config.isPrivate ? "/video/" + _deviceInfo.shareid + "/" + _deviceInfo.uk : "/profile/video/" + _deviceInfo.deviceid));
      trigger("data-binded", deviceInfo);
      playLiveVideo();
    };

    bindEvent = function() {
      var tt;
      $container.find(".player-main").mousemove(function() {
        clearTimeout(tt);
        $menus.addClass("show");
        tt = setTimeout(function() {
          if(hasDestroy) return;
          $menus.removeClass("show");
        }, 2000);
      });


      _model.on("videoplayer", "volume-changed", function(_size) {
        player.setVolume(_size);
      });
      _model.on("videoplayer", "fullscreen", function(opt) {
        var w, h;
        if (!opt) {
          w = config.width;
          h = config.height;
          $container.removeClass("fullscreen");
          if (config.menuFloat === "auto") {
            $container.removeClass("menu-float");
          }
        } else {
          w = opt.width;
          h = opt.height;
          $container.addClass("fullscreen menu-float");
        }
        trigger("resize", w, h);
      });
    };

    onPlayStateChanged = function(_current_state, _old_state) {
      if (checkHlsTrigger) clearTimeout(checkHlsTrigger);
      trigger("play-state-changed", _current_state, _old_state);
    };

    resize = function(w, h) {
      // height = h;
      // width = w;
      player.resize(w, h);
    };

    init = function() {
      $container = $(config.container).addClass("zbase-ui video-player-wrap");
      $container.append(tpl);
      $menus = $container.find("div.menus");

      if (IX.browser.versions.mobile) {
        playType = "hls";
      }

      if (config.menuFloat === "fixed") {
        $container.addClass("menu-float");
      }
      if(config.isProfessional){
        $container.addClass("menu-professional");
      }
      if(config.showDesc){
        $container.find(".show-desc").show();
      }

      if (!config.showMenu) {
        $container.addClass("menu-hide");
      }

      player = new ZBPlayer({
        container: $container.find(".player-main"),
        width: config.width,
        height: config.height,
        onPlayStateChanged: onPlayStateChanged,
        language: config.language,
        controls: config.controls,
        isProfessional: config.isProfessional,
        isFlash: !IX.browser.versions.mobile,
        isMuted: config.isMuted,
        enableWindowMessage: config.enableWindowMessage
      });

      $error = $("<p class = 'error'></p>").prependTo($container.find(".player-main"));
      $topWarning = $("<div class='player-top-warning'></div>").prependTo($container.find(".player-main"));

      loadPlugins();

      if ($menus.find(".menu").length > 0) $menus.show();
      bindEvent();
    };

    _model = {
      on: on,
      bindData: bindData,
      registEvent: registEvent,
      showErrorMsg: showErrorMsg,
      showPlayerTopMsg: showPlayerTopMsg,
      // event:event,
      resetSize: function(w, h){
        if(!w && !h) return;
        h = h || w * 9 / 16;
        config.width = w;
        config.height = h;
        trigger("resize", w, h);
      },
      trigger: trigger,
      addMenu: function(_menu) {
        loaded_plugins[_menu.key] = {
          menu: _menu
        };
        loaded_plugins[_menu.key].menu.$ = addMenu(_menu);
        return loaded_plugins[_menu.key].menu.$;
      },
      resume: function() {
        if (player) player.resume();
      },
      pause: function(){
        if(player) player.pause();
      },
      stop: function(){
        if(player) player.stop();
      },
      playing: function(){
        if(player) player.playing();
      },
      destroy: function(){
        trigger("destroy");
      }
    };
    init();
    return _model;
  };

  return VideoPlayer;
});
