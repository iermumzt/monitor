define(function() {

  var is_support_fullscreen = document.webkitCancelFullScreen || document.mozCancelFullScreen || document.msExitFullscreen;

  var languages = {
    "zh-cn": {
      "l1": "全屏",
      "l2": "退出全屏"
    },
    "en": {
      "l1": "full screen",
      "l2": "exit full screen"
    },
    "jp":{
      "l1": "フルスクリーン表示",
      "l2": "終了"
    }
  };
  var plugin = function(cfg) {
    var player, state = "";
    var $container, $menu; //, language = "zh-cn"
    var bindEvent,fullscreen, cancelfullscreen, init, _model;
    bindEvent = function() {
      $menu.click(function() {
        if (state === "full") {
          cancelfullscreen();
        } else {
          fullscreen();
        }
      });
      document.onwebkitfullscreenchange = document.onmozfullscreenchange = document.onmsfullscreenchange = function() {
        if (!document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
          cancelfullscreen(1);
        }
      };


      player.on(plugin.key, "destroy", function(){
        document.onwebkitfullscreenchange = document.onmozfullscreenchange = document.onmsfullscreenchange = null;
      });

    };

    fullscreen = function() {
      $menu.addClass("cancel");
      state = "full";
      if (is_support_fullscreen) {
        player.trigger("fullscreen", {
          width: window.screen.width,
          height: window.screen.height
        });
      } else {
        player.trigger("fullscreen", {
          width: document.documentElement.clientWidth,
          height: document.documentElement.clientHeight
        });
      }
      if ($container[0].webkitRequestFullScreen) {
        $container[0].webkitRequestFullScreen();
      } else if ($container[0].mozRequestFullScreen) {
        $container[0].mozRequestFullScreen();
      } else if ($container[0].msRequestFullscreen) {
        $container[0].msRequestFullscreen();
      }
    };

    cancelfullscreen = function(is_browser_trigger) {
      $menu.removeClass("cancel");
      state = "";
      player.trigger("fullscreen");
      if (is_browser_trigger) return;
      if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }

    };

    init = function() {
      player = cfg.player;
      $container = cfg.container;
      // language = cfg.config.language;
      $menu = cfg.menu;
      bindEvent();
    };
    _model = {
      //todo
    };

    init();
    return _model;
  };
  plugin.key = "fullscreen";
  plugin.menu = {
    title: function(_language) {
      return languages[_language]["l1"];
    },
    clz: "fullscreen",
    i_clz: "pic-fullscreen",
    d: "right"
  };
  return plugin;
});
