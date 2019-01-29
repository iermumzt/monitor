(function() {
  var languages = {
    "zh-cn": {
      "lp73": "加载中"
    },
    "en": {
      "lp73": "Loading"
    },
    "jp": {
      "lp73": "ロード中"
    }
  };

  var PLAY_STATUS = {
    STOP: "stop",
    START_PLAY: "start_play",
    PLAYING: "playing",
    PAUSE: "pause"
  };
  var Player, FlashPlayer, HTML5Player, zb_player_tpl, ZBPlayer;

  Player = function() {

    return {
      play: function(){
        //todo
      },
      playing: function(){
        //todo
      },
      destroy: function(){
        //todo
      },
      setThumbnail: function(){
        //todo
      },
      getPlayState: function(){
        //todo
      },
      pause: function(){
        //todo
      },
      stop: function(){
        //todo
      },
      resume: function(){
        //todo
      },
      setVolume: function(){
        //todo
      },
      setVideoSize: function(){
        //todo
      },
      resize: function(){
        //todo
      },
      setStartPlayTime: function(){
        //todo
      }
    };
  };

  FlashPlayer = function(cfg) {
    var config = $.extend({
      container: null,
      width: "100%",
      height: "100%",
      onStartPlay: function() {
        //todo
      },
      onPlayStateChanged: function() {
        //todo
      }
    }, cfg);
    var $container, hasDestroy = false;
    var player, url, metaTrigger, playType = "rtmp",
      startPlayTime;
    var playState = PLAY_STATUS.STOP; //stop start_play playing pause
    var livePlayTrigger;
    var init,renderPlayer,setPlayState,play,setVolume,_model ;

    init = function() {
      $container = $(config.container);
    };
    renderPlayer = function(){
      player = new BlsPlayer($container[0].id, config.width, config.height);

      var flag = false;
      if (window.ActiveXObject) {
        try {
          var swf = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
          if (swf) {
            flag = true;
          }
        } catch (e) {}
      } else {
        try {
          var swf = navigator.plugins['Shockwave Flash'];
          if (swf) {
            flag = true;
          }
        } catch (e) {}
      }
      if(!flag ){
        if(IX.isFirefox){
          $(".zbase-ui.player-wrap p").html('<span class = "check">检测到Flash Player控件异常,请先安装最新版本Flash Player。<a href="http://get.adobe.com/cn/flashplayer/" target="_blank">立即下载安装Flash Player</a></span>');
        }else if(IX.isChrome || IX.isSafari) { //
          $(".zbase-ui.player-wrap p").html('<object type="application/x-shockwave-flash" data="/public/js/ui/BlsPlayer.swf" width="100%" height="100%"></object>');
        }
        return;
      }
      player.start("/public/js/ui/BlsPlayer.swf");

      player.on_stream_metadata = function() {
        var stime, buffertime;
        console.info("on_stream_metadata enter");
        if (metaTrigger) {
          clearInterval(metaTrigger);
        }
        metaTrigger = setInterval(function() {
          var currentLivePlayTime,livePlayErrorTime;
          var time = player.get_live_time();
          buffertime = player.get_buffer_time();
          if (time !== 0) {
            stime = stime || time;
            //debug("直播开流时间：", (new Date().getTime()) - startPlayTime + "ms");
            //console.info("on_stream_metadata load", stime, time, time - stime, buffertime);
            if (startPlayTime === 0 && stime >= 0.8 || time - stime >= 0.8 || buffertime >= 0.8) {
              setPlayState("playing");
              clearInterval(metaTrigger);
              if (livePlayTrigger) clearInterval(livePlayTrigger);
              currentLivePlayTime = player.get_live_time();
              livePlayErrorTime = 0;
              livePlayTrigger = setInterval(function() {
                var time = player.get_live_time();
                if (time !== currentLivePlayTime) {
                  currentLivePlayTime = time;
                } else {
                  livePlayErrorTime++;
                  if (livePlayErrorTime > 8) {
                    clearInterval(livePlayTrigger);
                    livePlayErrorTime = 0;
                    player.stop();
                    setPlayState(PLAY_STATUS.STOP);
                  }
                }
              }, 1000);
            }
          }
        }, 100);
      };
      player.on_connection_status = function(_status) { //info
        window.console.info("on_connection_status", _status.code);
      };

      // var startPlayHls = 0;
      // player.on_hls_time_update = function() {
      //   window.console.info("on_hls_time_update", arguments);
      // };
      player.on_hls_play_state_change = function(_state) {
        window.console.info("on_hls_play_state_change", arguments);
        if (_state === PLAY_STATUS.PLAYING) {
          setPlayState(PLAY_STATUS.PLAYING);
        } else if (_state === "stopped") {
          //startPlayHls = 0;
          setPlayState(PLAY_STATUS.STOP);
        }
      };

      player.on_player_ready = function() {
        player.enable_double_click_full_screen(false);
        if (url) play(url, playType);
      };
    };

    setPlayState = function(_state) {
      var _oldState = playState;
      if (_state === playState || hasDestroy) return;
      playState = _state;
      _model.playState = playState;
      config.onPlayStateChanged(playState, _oldState);
    };

    play = function(_url, _type) {
      if (metaTrigger) clearInterval(metaTrigger);
      if (livePlayTrigger) clearInterval(livePlayTrigger);
      url = _url;
      playType = _type;
      if (!player) {
        renderPlayer();
        return;
      }
      setPlayState(PLAY_STATUS.START_PLAY);

      console.info(_type, _url);
      if (_type === "rtmp") {
        player.playType = 1;
        player.play(_url,config.isMuted ? 0 : null);
      } else {
        player.playType = 0;
        player.play_hls_source(_url,config.isMuted ? 0 : null);
      }
      config.onStartPlay();
    };

    setVolume = function(_size) {
      player.set_volume(_size);
    };

    _model = new Player();

    _model.play = play;
    _model.playState = playState;
    _model.resize = function(w, h) {
      player.set_vedio_size(w, h);
    };
    _model.setVolume = setVolume;
    _model.pause = function() {
      player.pause();
      setPlayState(PLAY_STATUS.PAUSE);
    };
    _model.stop = function() {
      player.stop();
      setPlayState(PLAY_STATUS.STOP);
    };
    _model.resume = function() {
      player.resume();
      setPlayState(PLAY_STATUS.PLAYING);
    };
    _model.setVideoSize = function(_size) {
      player.scale_vedio_size(_size);
    };

    _model.setStartPlayTime = function(_time) {
      startPlayTime = _time;
    };
    _model.destroy = function(){
      hasDestroy = true;
      if (metaTrigger) clearInterval(metaTrigger);
      if (livePlayTrigger) clearInterval(livePlayTrigger);
      _model.stop();
    };

    init();
    return _model;
  };
  HTML5Player = function(cfg) {
    var config = $.extend({
      container: null,
      width: "100%",
      height: "100%",
      controls: true,
      onStartPlay: function() {
        //todo
      },
      onPlayStateChanged: function() {
        //todo
      },
      enableWindowMessage: false
    }, cfg);

    var $container, hasDestroy = false;
    var player, metaTrigger, playState, thumbnailUrl;
    var setPlayState,init, renderPlayer, setThumbnail,play,_model ;
    setPlayState = function(_state) {
      var _oldState;
      if (_state === playState || hasDestroy) return;
      _oldState = playState;
      playState = _state;
      _model.playState = playState;
      config.onPlayStateChanged(playState, _oldState);
    };

    init = function() {
      $container = config.container.parent();
    };
    renderPlayer = function() {
      var t = navigator.userAgent.toLowerCase();
      var isWeixin = t.match(/MicroMessenger/i);
      isWeixin = isWeixin && isWeixin[0] === "micromessenger";
      $container.html([
        "<video style = 'display:none' ",
        (config.isProfessional ? " muted loop autoplay" : ""),
        (config.playsinline || isWeixin ? "webkit-playsinline " : ""),
        " autoplay='autoplay' ",
        config.controls ? " controls " : "   ",
        config.isMuted ? " muted " : "",
        "preload ",
        "width='" + config.width + "' height='" + config.height + "'",
        "x5-video-player-type='h5' x5-video-player-fullscreen='true' webkit-playsinline='true' x-webkit-airplay='true'  playsinline='true' ",
        "></video>"
      ].join(""));
      player = $container.find("video")[0];

      player.onabort = player.onplaying = player.onclick = player.onbeforeload = player.ondurationchange = player.onload = player.onloadeddata = player.onloadedmetadata = player.onloadstart = function() {
        console.info(event.type);
      };

      if (!config.controls) {
        player.controls = null;
        player.onclick = function() {
          player.play();
        };
      }

      player.onpause = function(){
        if(player.currentTime === player.duration)
          setPlayState(PLAY_STATUS.STOP);
        else
          setPlayState(PLAY_STATUS.PAUSE);
      };
      player.addEventListener("pause", player.onpause, false);
      player.onloadedmetadata = function() {
        console.info("连接成功！");
        setPlayState(PLAY_STATUS.START_PLAY);
        player.style.display = "block";
      };
      player.addEventListener("loadedmetadata", player.onloadedmetadata, false);
      player.onplaying = function() {
        console.info(event.type);
        //debug("开流时间：" + (new Date().getTime() - time) + "ms");
        setPlayState(PLAY_STATUS.PLAYING);
      };
      player.addEventListener('playing', player.onplaying, false);
      //var time;
      player.onplay = function(){
        //time = new Date().getTime();
        console.info(event.type);
      };
      player.addEventListener('play', player.onplay, false);
      player.oncanplay = player.oncanplaythrough = function() {
        console.info(event.type);
      };
      player.addEventListener('canplay', player.oncanplay, false);
      player.onerror = function() { //a,b,c
        setPlayState(PLAY_STATUS.STOP);
        console.info(player.status, player.state);
      };
    };

    setThumbnail = function(_url) {
      thumbnailUrl = _url;
      if (player) {
        player.poster = _url;
      }
    };

    play = function(_url) {
      var errorTime = 0,
      currentPlayTime;
      var t = navigator.userAgent.toLowerCase();
      var isWeixin = t.match(/MicroMessenger/i);
      if (!player) renderPlayer();
      player.style.display = "block";
      if (metaTrigger) clearInterval(metaTrigger);
      player.poster = thumbnailUrl;
      player.src = _url;
      metaTrigger = setInterval(function() {
        if (_model.playState !== PLAY_STATUS.PLAYING) return;
        if (currentPlayTime !== player.currentTime) {
          currentPlayTime = player.currentTime;
          errorTime = 0;
        } else {
          errorTime++;
          if (errorTime > 10) {
            errorTime = 0;
            player.pause();
            player.poster = player.poster;
            player.src = player.src;
            player.play();
          }
        }
      }, 1000);
      if(isWeixin){
        setPlayState(PLAY_STATUS.START_PLAY);
        player.style.display = "block";
      }

    };

    _model = new Player();

    _model.play = play;
    _model.playing = function(){
      player.play();
    };
    _model.stop = function(){
      player.pause();
    };
    _model.destroy = function(){
      hasDestroy = true;
      if (metaTrigger) clearInterval(metaTrigger);
      _model.stop();
    };
    _model.playState = playState;
    _model.setThumbnail = setThumbnail;
    _model.resize = function(w, h) {
      $container.find("video").attr("width", w);
      $container.find("video").attr("height", h);
    };

    init();
    return _model;
  };

  zb_player_tpl = [
    "<div class = 'zbase-ui player-wrap'>",
    "<div class = 'loading'>",
    "<div></div>",
    "<p>",
    "<span class='flower-loader'>Loading&#8230;</span>",
    "<span class = 't'>{lp73}...</span>",
    "</p>",
    "</div>",
    // "<div class = 'bg-thumbnail'></div>",
    "<div class = 'player'><div></div></div>",
    "</div>"
  ].join("");
  ZBPlayer = function(cfg) {
    var config = $.extend({
      container: null,
      isFlash: true,
      width: "auto",
      height: "auto",
      playInLine: true,
      controls: true,
      startPlayTime: 0,
      enableWindowMessage: false,
      isProfessional: false,
      // isMuted:false,
      onPlayStateChanged: function() {
        //todo
      }
    }, cfg);

    var $container, $loading, $videowrap;
    var player, thumbnailUrl = "",
      playUrl, playType = "rtmp";
    var height, width, startPlayTime = 0;
    var onPlayStateChanged,renderPlayer,play,setThumbnail,resize,setVolume,pause, stop, playing, resume, setVideoSize, init, _model; 

    onPlayStateChanged = function(_current_state, _old_state) {
      if (_current_state === PLAY_STATUS.PLAYING || !config.isFlash && _current_state === PLAY_STATUS.START_PLAY) {
        $loading.hide();
      }
      config.onPlayStateChanged(_current_state, _old_state);
    };

    renderPlayer = function() {
      var $playerwrap,_config;
      $playerwrap = $videowrap.find(".player>div");
      $playerwrap.attr("id", "zbase_ui_vp_" + (new Date()).getTime());
      _config = {
        container: $videowrap.find(".player>div"),
        thumbnail: thumbnailUrl,
        width: width,
        height: height,
        controls: config.controls,
        onPlayStateChanged: onPlayStateChanged,
        isProfessional: config.isProfessional,
        enableWindowMessage: config.enableWindowMessage,
        isProfessional: config.isProfessional,
        isMuted:config.isMuted
      };
      if (config.isFlash) {
        player = new FlashPlayer(_config);
      } else {
        player = new HTML5Player(_config);
      }
      player.setStartPlayTime(startPlayTime);
    };

    play = function(_url, _type) {
      playUrl = _url;
      playType = _type;
      if (!player) renderPlayer();
      player.setThumbnail(thumbnailUrl);
      player.play(playUrl, playType);
    };

    setThumbnail = function(_url) {
      thumbnailUrl = _url;
      $loading.css("background-image", "url(" + thumbnailUrl + ")");

      if (player) {
        player.setThumbnail(_url);
      }
    };

    resize = function(w, h) {
      width = w;
      height = h;
      $videowrap.width(width);
      $videowrap.height(height);
      if (player) player.resize(w, h);
    };

    setVolume = function(_size) {
      player.setVolume(_size);
    };

    pause = function() {
      player.pause();
    };
    stop = function() {
      player.pause();
    };
    playing = function(){
      player.playing();
    };
    resume = function(){
      player.resume();
    };

    setVideoSize = function(_size) {
      player.setVideoSize(_size);
    };

    init = function() {
      $container = config.container;
      $videowrap = $(zb_player_tpl.replace("{lp73}", languages[config.language].lp73)).appendTo($container);
      $loading = $videowrap.find(".loading");

      resize(config.width, config.height);
    };

    _model = {
      play: play,
      playing: playing,
      setThumbnail: setThumbnail,
      getPlayState: function() {
        return player ? player.playState : "stop";
      },
      pause: pause,
      stop: stop,
      resume: resume,
      // stop: stop,
      setVolume: setVolume,
      setVideoSize: setVideoSize,
      setStartPlayTime: function(_time) {
        startPlayTime = _time;
        if (player) player.setStartPlayTime(_time);
      },
      resize: resize,
      destroy: function(){
        if(player) player.destroy();
      }
      // fullscreen: fullscreen
    };

    init();
    return _model;
  };

  window.ZBPlayer = ZBPlayer;
})();
