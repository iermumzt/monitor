define([],function() {
  var languages = {
    "zh-cn": {
      "lp12": "静音",
      "lp13": "音量"
    },
    "en": {
      "lp12": "Mute",
      "lp13": "Volume"
    },
    "jp":{
      "lp12": "ミュート",
      "lp13": "ボリューム"
    }
  };
  var volume_control_tpl = [
    '<a title="{lp12}"><i class = "pic-p1"></i></a>',
    '<div class="volume-wrap">',
    '<a></a>',
    '<span class = "shadow-wrap"></span>',
    '<div class="volume-bar" title="{lp13}">',
    '</div>',
    '</div>'
  ].join("");

  var plugin = function(cfg) {
    var player, size = 3.2,//1.8
      defaultSize = 3.2,//1.8
      maxSize = 5,
      minSize = 0;
    var $container, $volume_bar, $volume_tip, $volume_trigger, $volumn_wrap, $volume_span, $num;

    var enable = function() {
      $volumn_wrap.addClass("enable");
    };

    var disable = function() {
      $volumn_wrap.removeClass("enable");
    };

    var setVolume = function(_size) {
      size = Math.max(minSize, Math.min(_size, maxSize));
      if (size < 5) {
        $volume_trigger.removeClass("close-volume");
      } else {
        $volume_trigger.addClass("close-volume");
      }
      // $volume_tip.width((size / maxSize * 100) + '%');
      //$volume_bar.css("left", Math.max(0, $volume_tip.width() - $volume_bar.width() / 2) + "px");
      $volume_tip.height((100 - (size / maxSize * 100)) + '%');
      $volume_bar.css("top", Math.max(0, (100 - $volume_tip.height() - $volume_bar.height() / 2)) + "px");
      player.trigger("volume-changed", 5-size);
    };

    var bindEvent = function() {

      var $document, maxLeft,
        startX, startLeft;

      var mousemove = function(e) {
        // setVolume((startLeft + e.clientX - startX) * 5 / maxLeft);
        setVolume((e.clientY - startX + startLeft) * 5 / maxLeft);
      };

      var mouseup = function() {
        $document.unbind({
          mouseup: mouseup,
          mousemove: mousemove
        });
      };

      player.on(plugin.key, "destroy", function(){
        mouseup();
      });
      
      player.on(plugin.key, "play-state-changed", function(_current_state) {
        if (_current_state === "playing") enable();
        else disable();
      });
      
      $volume_trigger.click(function() {
        if (size === 5) {
          setVolume(defaultSize);
        } else {
          setVolume(5);
        }
      });

      $document = $(document);
      // maxLeft = $volumn_wrap.width() - $volume_bar.width();
      maxLeft = $volumn_wrap.height() - $volume_bar.height();

      $volume_bar.mousedown(function(e) {
        startX = e.clientY;
        // startLeft = $volume_bar.offset().left - $volume_tip.offset().left;
        startLeft = $volume_bar.position().top;
        $document.bind({
          mouseup: mouseup,
          mousemove: mousemove
        });
        return false;
      });
      $volume_trigger.mouseover(function (e) {
        $volumn_wrap.addClass("showUp");
        var times = setInterval(function () {
          if ($num == 1) {
            $volumn_wrap.addClass("showUp");
            $num = 1;
          }else{
            $num = 0;
            $volumn_wrap.removeClass("showUp");
            clearInterval(times);
          }
        }, 3000);
      });
      // $volume_trigger.mouseout(function (e) {
      //   var times = setTimeout(function () {
      //     $volumn_wrap.removeClass("showUp");
      //   }, 3000);
      // });
      $volume_span.mouseover(function (e) {
        $num = 1;
      });
      $volume_span.mouseout(function (e) {
        $num = 0;
      });
      $volume_bar.mouseover(function (e) {
        $num = 1;
      });
      $volume_tip.mouseover(function (e) {
        $num = 1;
      });
      $volumn_wrap.mouseover(function (e) {
        $num = 1;
      });
    };

    var init = function() {
      $container = cfg.container;
      $volumn_wrap = $container.find(".volume-wrap");
      $volume_bar = $container.find(".volume-op>div>a");
      $volume_tip = $container.find(".volume-op>div>div");
      $volume_trigger = $container.find(".volume-op>a");
      $volume_span = $container.find(".volume-op>div>span");
      $num = 0;

      player = cfg.player;

      player.registEvent("volume-changed");
      bindEvent();
      size = cfg.isMuted ? 0 : size;
      setVolume(size);
    };

    var _model = {};
    init();
    return _model;
  };

  var createMenu = function(_language, $menu) {
    $menu.append(volume_control_tpl.replace("{lp13}", languages[_language].lp13).replace("{lp12}", languages[_language].lp12));
    $menu.addClass("volume-op");
  };
  plugin.key = "volume-control";
  plugin.menu = {
    getMenu: createMenu,
    d: "right"
  };
  return plugin;
});
