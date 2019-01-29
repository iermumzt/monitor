define(function() {
  var languages = {
    "zh-cn": {
      "lp2": "放大",
      "lp4": "缩小"
    },
    "en": {
      "lp2": "Zoom In",
      "lp4": "Zoom Out"
    },
    "jp": {
      "lp2": "広げます",
      "lp4": "狭いです"
    }
  };
  var size_controller_tpl = [
    '<div class="video-op size-controller">',
    "<button title='{lp2}' type = 'button' class = 'bigger'><i class = 'pic-p1'></i></button>",
    '<div>',
    '<span class = "size"></span>',
    '</div>',
    '<button title="{lp4}" type = "button" class = "smaller"><i class = "pic-p1"></i></button>',
    '</div>'
  ].join("");
  var plugin = function(cfg) {
    var player, size = 1,
      maxSize = 6;
      // isEnable = false;
    var $container, $sizecontrol, $size, language = "zh-cn";

    var enable = function() {
      // isEnable = true;
      $sizecontrol.addClass("enable");
    };

    var disable = function() {
      // isEnable = false;
      $sizecontrol.removeClass("enable");
    };

    var setSize = function(_size) {
      size = _size;
      $size.height(((_size - 1) / (maxSize - 1) * 100) + "%");
    };

    var bindEvent = function() {
      var tt;
      $container.find(".player-main").mousemove(function() {
        if(tt) clearTimeout(tt);
        $sizecontrol.addClass("show");
        tt = setTimeout(function() {
          $sizecontrol.removeClass("show");
        }, 2000);
      });
      $sizecontrol.find(".bigger").click(function() {
        if (size === maxSize) {
          return;
        }
        size++;
        player.trigger("scale-vedio-size", size);
      });
      $sizecontrol.find(".smaller").click(function() {
        if (size === 1) {
          return;
        }
        size--;
        player.trigger("scale-vedio-size", size);
      });
      player.on(plugin.key, "destroy", function(){
        if(tt) clearTimeout(tt);
      });

      player.on(plugin.key, "play-state-changed", function(_current_state) {
        if (_current_state === "playing") enable();
        else disable();
      });
      player.on(plugin.key, "scale-vedio-size", function(_size) {
        setSize(_size);
      });

    };

    var init = function() {
      $container = cfg.container;
      language = cfg.config.language;
      $sizecontrol = $(size_controller_tpl.replace("{lp4}", languages[language].lp4).replace("{lp2}", languages[language].lp2));
      $sizecontrol.prependTo($container.find(".player-main"));
      $size = $sizecontrol.find("span.size");
      // $menu = cfg.menu;

      player = cfg.player;

      player.registEvent("scale-vedio-size");
      bindEvent();
    };

    var _model = {};
    init();
    return _model;
  };

  plugin.key = "size-control";

  return plugin;
});
