define(["js/callserver/cservice"], function(CallServer) {
  var languages = {
    "zh-cn": {
      "lp1": "云台",
      "lp2": "手动操作",
      "lp3": "自动旋转",
      "lp4": "关闭云台",
      "lp5": "双击画面,点哪转哪儿",
      "lp6": "正在自动旋转,帮您多角度观看",
      "lp7": "转不动了,换一个方向试试吧！"
    },
    "en": {
      "lp1": "PTZ",
      "lp2": "Manual",
      "lp3": "Automatic",
      "lp4": "Close PTZ",
      "lp5": "Double click the picture, the point where to turn.",
      "lp6": "Automatically rotating, to help you more than a point of view",
      "lp7": "Could not move, for a direction to try!"
    }
  };

  var yuntai_menu_tpl = [
    '<a class = "cloud-config" title="{lp1}"><i class = "pic-cloud-config"></i></a>',
    '<div class = "cloud-op">',
    '<ul>',
    '<li _v="1"><span></span>{lp2}</li>',
    '<li _v="2"><span></span>{lp3}</li>',
    '<li _v="3" class="ns"><span></span>{lp4}</li>',
    '<div class="f"><span class="sp1"> </span></div>',
    '<ul>',
    '</div>'
  ].join("");

  var yuntai_notice_tpl = [
    '<div class="cl-notice">',
    '<i class = "pic-cloud-notice"></i><span></span><i class = "pic-cloud-close"></i>',
    '</div>'
  ].join("");

  var mobile_yuntai_tpl = [
    "<ul class = 'yuntaiops'>",
    "<li class='up'></li>",
    "<li _v='1' class = 'yuntaiops-manua'>",
    "<i class = 'pic-cloud-manua'></i>",
    "</li>",
    "<li _v='2' class = 'yuntaiops-auto'>",
    "<i class = 'pic-cloud-auto'></i>",
    "</li>",
    "<li _v='3' class = 'yuntaiops-close'>",
    "<i class = 'pic-cloud-op'></i>",
    "</div>",
    "</ul>"
  ].join("");

  var plugin, createMenu;
  var pro_cloud;
  plugin = function(cfg) {
    var player, config,deviceInfo, currentOperStatus, dbsnCount, currentDPI;
    var $container, $menu, language = "zh-cn";
    var $cloud_notice, $videoPlayer, $yuntaiops;
    var currentPlayCategory = "live_play";
    var cloudloaded;
    var isFullScreen;
    var init, bindEvent, _model;
    var firstDelay = false;
    bindEvent = function() {
      // var isLimit = false;
      var d,t = 0;
      var getCurrentDPI, getCloudStatus, manuaCloud, removeDbs, getScrollTop, createDbs, autoCloud, stopCloud,
       cloudHideMenu, yuntaiMenuOper;
      //获取设备铭牌、DPI
      getCurrentDPI = function() {
        CallServer.CallServer["camera_getConfigCvr_callserver"]({
          method: "setting",
          deviceid: deviceInfo['deviceid'],
          type: "info"
        }, function(_data) {
          if (_data.error_code) {
            return;
          }
          deviceInfo.currentDPI = _data.nameplate === "HDP" ? 1080 : 720;
          deviceInfo.nameplate = _data.nameplate;
          if (deviceInfo.currentDPI !== 1080) {
            currentDPI = {
              w: 1280,
              h: 720
            };
          } else {
            currentDPI = {
              w: 1920,
              h: 1080
            };
          }
        });
      };

      getCloudStatus = function() {
        CallServer.CallServer["camera_getConfigCvr_callserver"]({
          method: "setting",
          deviceid: deviceInfo['deviceid'],
          type: "plat"
        }, function(_data) {
          if (_data.error_code) {
            //todo
          }
          deviceInfo.isCloud = _data.plat !== "0" ? 1 : 0;
          if (deviceInfo.isCloud === 1 && !deviceInfo.noPlat) {
            $yuntaiops.show();
          } else {
            //没有云台隐藏云台图标
            $menu.find("a.cloud-config").addClass('hide');
          }
          if (_data.plat_rotate_status === "1") {
            $yuntaiops.find("li").eq("2").addClass('active').siblings().removeClass('active');
            player.trigger("control-yuntai-oper","yuntai-menu-auto");
          }

          cloudloaded = true;
          if((isFullScreen && deviceInfo.isCloud !== 1) || (config.menuFloat === "fixed" && deviceInfo.isCloud !== 1)){
            $menu.hide();
          }
          if(isFullScreen && deviceInfo.isCloud === 1 && currentPlayCategory === "live_play"){
            $menu.show();
          }
        });
      };

      player.on(plugin.key, "data-binded", function(_deviceInfo) {
        deviceInfo = _deviceInfo;
        getCurrentDPI();
        getCloudStatus();
      });

      player.on(plugin.key, "play-video-event", function(_category) {
        if(_category === "play-video" && config.onYunTaiConfig) config.onYunTaiConfig('stop');
      });
      player.on(plugin.key, "fullscreen", function(opt) {
        isFullScreen = !opt ? false : true;
        if (!opt && currentPlayCategory === "live_play" && config.menuFloat !== "fixed") {
          $menu.show();
        }else{
          if(deviceInfo.isCloud !== 1){
            $menu.hide();
          }
        }
      });

      player.on(plugin.key, "play-type-changed", function(_type) {
        //不能点击云台
        if (_type === "hls") {

          $menu.hide();
        }
      });

      $container.find(".pic-cloud-close").click(function() {
        $cloud_notice.hide();
      });
      player.on(plugin.key, "play_category_changed", function(_category) {
        currentPlayCategory = _category;
        if ((_category !== "live_play") || (deviceInfo.isCloud !== 1 && config.menuFloat === "fixed") || (isFullScreen && deviceInfo.isCloud !== 1)) {
          $menu.hide();
          $cloud_notice.hide();
          if($videoPlayer.is(".ma-player")){
            $videoPlayer.removeClass("ma-player");
          }
        }else{
          $menu.show();
        }
      });

      
      manuaCloud = function(_afterX, _afterY) {
        var s;
        var params = _.extend({
          direction: _afterX,
          step: 25
        }, (!firstDelay && !deviceInfo.tree) ? {
          delay: 1000
        } : {} );
        if(deviceInfo.nameplate === "HDW" && !firstDelay){
          firstDelay = true;
        }
        CallServer.CallServer["camera_yuntai_result_callserver"](_.extend({
          method: "move",
          deviceid: deviceInfo['deviceid'],
        }, (deviceInfo.nameplate === "HDW" || (deviceInfo.tree && pro_cloud)) ? params : {
          x1: currentDPI.w / 2,
          y1: currentDPI.h / 2,
          x2: _afterX,
          y2: _afterY
        }), function(_data) {
          if (_data.error_code) {
            return;
          }
          s = _data.result;
          s = parseInt(s.substr(s.length - 1), 16);
          if (s > 0) {
            // $cloud_notice.addClass("cl-notice-limit");
            // $cloud_notice.find("span").text(languages[language]['lp7']);
            player.showPlayerTopMsg(languages[language]['lp7'], 'warn');
            // $cloud_notice.show();
            // isLimit = true;
          // } else if (isLimit) {
          //   isLimit = false;
          //   $cloud_notice.removeClass("cl-notice-limit");
          //   $cloud_notice.find("span").text(languages[language]['lp5']);
          }
        });
      };

      removeDbs = function(_dbs) { //移除双击效果
        setTimeout(function() {
          _dbs.remove();
        }, 4000);
      };

      getScrollTop = function() {
        var scrollTop = 0;
        if (document.documentElement && document.documentElement.scrollTop) {
          scrollTop = document.documentElement.scrollTop;
        } else if (document.body) {
          scrollTop = document.body.scrollTop;
        }
        return scrollTop;
      };

      createDbs = function(e) { //添加双击效果
        var afterX,afterY,left, top, xdirection, ydirection, xUnitStep, yUnitStep, xmoveStep, ymoveStep;
        var w, h, $dbs;
        var playerw = $videoPlayer.width();
        var playerh = playerw * 9 / 16;
        pro_cloud = false;
        dbsnCount++;
        // if(isOnStatus("on-show-fyuntai")){
        if(IX.browser.versions.mobile){
          e = ZBase.Event.getEventTouchObj(e);
          left = e.pageX - $videoPlayer.offset().left;
          top = e.pageY - $videoPlayer.offset().top + getScrollTop();
          // }else{
          //   left = e.clientX;
          //   top = e.clientY;
          // }
        }else{
          left = e.clientX - $videoPlayer.offset().left;
          top = e.clientY - $videoPlayer.offset().top + getScrollTop();
        }

        if(deviceInfo.nameplate === "HDW"){
          //单位步距
          xUnitStep = playerw / 2 / 255;
          yUnitStep = playerh / 2 / 255;

          //判断方向
          // if(top > playerh / 2) {
          //   ydirection = "down";
          //   ymoveStep = (top - playerh / 2) * yUnitStep;
          // }else{
          //   ydirection = "up";
          //   ymoveStep = (playerh / 2) * yUnitStep;
          // } 
          // ymoveStep = Math.abs(top - playerh / 2) / yUnitStep;
          if(left > playerw / 2){
            xdirection = "right";
          } else {
            xdirection = "left";
          }
          // xmoveStep = Math.abs(left - playerw / 2) / xUnitStep;
          // console.log("{" + xdirection + "," + xmoveStep +"}," + "{" + ydirection + "," + ymoveStep +"}");
          manuaCloud(xdirection);
        }else{
          if(!isFullScreen){
            afterX = currentDPI.w - left / ($videoPlayer.width() / currentDPI.w);
            afterY = currentDPI.h - top / ($videoPlayer.height() / currentDPI.h);
          }else{
            w = $videoPlayer.width();
            h = w * 9 / 16;
            afterX = currentDPI.w - left / ($videoPlayer.width() / currentDPI.w);
            afterY = currentDPI.h - (top - ($videoPlayer.height() - h) / 2) / ($videoPlayer.height() / currentDPI.h);
          }
          if (afterX < 0 || afterY < 0) {
            return;
          }
          manuaCloud(afterX, afterY);
        }

        
        // }
        $videoPlayer.append("<span class='dbs" + dbsnCount + "'><i class='pic-cloud-dblclick'></i></span>");
        $dbs = $videoPlayer.find(".dbs" + dbsnCount); //zc
        $dbs.css("top", top - 27);
        $dbs.css("left", left - 27);
        removeDbs($dbs);
      };
      //云台自动旋转
      autoCloud = function() {
        if (!deviceInfo) {
          return;
        }
        CallServer.CallServer["camera_yuntai_result_callserver"](_.extend({
          method: "rotate",
          rotate: "auto",
          deviceid: deviceInfo['deviceid']
        }), function(data) {
          if (data) {
            //todo;
          }
        });
      };
      //停止云台
      stopCloud = function() {
        CallServer.CallServer["camera_yuntai_result_callserver"](_.extend({
          method: "rotate",
          rotate: "stop",
          deviceid: deviceInfo['deviceid']
        }), function(data) {
          if (data) {
            //todo
          }
        });
      };
      //隐藏云台菜单
      cloudHideMenu = function() {
        $menu.find(".cloud-op").hide();
      };

      $menu.find("a.cloud-config").click(function() {
        if (deviceInfo === null || !cloudloaded) {
          return;
        }
        if (deviceInfo.isCloud === 1) {
          if (config.onYunTaiConfig && !isFullScreen) {
            currentOperStatus = "manual";
            $cloud_notice.show();
            config.onYunTaiConfig();
          } else {
            $menu.find(".cloud-op").show();
          }
        } else {
          window.open("https://detail.tmall.com/item.htm?spm=a1z10.1-b.w5001-14092012353.4.a3zuw2&id=526398259435&scene=taobao_shop");
        }
      });

      yuntaiMenuOper = function(e) {
        var $target, h;
        if (IX.browser.versions.mobile) e = ZBase.Event.getEventTouchObj(e);
        $target = $(e.target || e.srcElement).closest("li");
        if (!$target.is("li")) {
          return;
        }
        h = Number($target.attr("_v"));
        player.trigger("scale-vedio-size", 1);
        $yuntaiops.find("li").eq(h).addClass('active').siblings().removeClass('active');
        if (h === 1) {
          stopCloud();
          currentOperStatus = "manual";
          $cloud_notice.find("span").text(languages[language]['lp5']);
          $videoPlayer.addClass("ma-player");
          $cloud_notice.show();
          if (config.onYunTaiConfig) config.onYunTaiConfig('manual');
          $menu.find("a.cloud-config i").removeClass().addClass('pic-cloud-manua');
          if (currentOperStatus === "auto") stopCloud();
        } else if (h === 2) {
          currentOperStatus = "auto";
          $cloud_notice.find("span").text(languages[language]['lp6']);
          $cloud_notice.show();
          if (config.onYunTaiConfig) config.onYunTaiConfig('auto');
          $menu.find("a.cloud-config i").removeClass().addClass('pic-cloud-auto');
          autoCloud();
        } else {
          currentOperStatus = "stop";
          $cloud_notice.hide();
          if (config.onYunTaiConfig) config.onYunTaiConfig('stop');
          $menu.find("a.cloud-config i").removeClass().addClass('pic-cloud-config');
          stopCloud();
        }
        cloudHideMenu();
      };
      $menu.find(".cloud-op li").click(yuntaiMenuOper);
      $yuntaiops.find("li").bind("touched click", yuntaiMenuOper);
      // 
      $videoPlayer.bind("touchend" ,function(e){
        var currentTimes;
        if(!IX.browser.versions.mobile) return;
        currentTimes = (new Date()).getTime();
        t ++;
        if(t === 1) d = currentTimes;
        if(t === 2) {
          t = 0;
          if(currentTimes - d < 300){
            if (currentOperStatus !== "manual") {// && deviceInfo.nameplate === "HDW"
              return;
            }
            createDbs(e);
          }
        }
      });

      $videoPlayer.dblclick(function(e) {
        if (currentOperStatus !== "manual") { // && deviceInfo.nameplate === "HDW"
          return;
        }
        if (config.onYunTaiConfig) config.onYunTaiConfig('manual-dbclick');
        createDbs(e);
      });
      $menu.find(".cloud-op ul").mouseleave(cloudHideMenu);
      $menu.mouseleave(cloudHideMenu);

      player.on(plugin.key, "control-yuntai-oper", function(_operType) {
        if(_operType === 'yuntai-manua'){
          pro_cloud = false;
          stopCloud();
          currentOperStatus = "manual";
          $cloud_notice.find("span").text(languages[language]['lp5']);
          $videoPlayer.addClass("ma-player");
          $cloud_notice.show();
          $menu.find("a.cloud-config i").removeClass().addClass('pic-cloud-manua');
          if (currentOperStatus === "auto") stopCloud();
        }else if(_operType === 'yuntai-auto'){
          currentOperStatus = "auto";
          $cloud_notice.find("span").text(languages[language]['lp6']);
          $cloud_notice.show();
          $menu.find("a.cloud-config i").removeClass().addClass('pic-cloud-auto');
          autoCloud();
        }else if(_operType === 'yuntai-stop'){
          currentOperStatus = "stop";
          $cloud_notice.hide();
          $menu.find("a.cloud-config i").removeClass().addClass('pic-cloud-config');
          stopCloud();
        }else if(_operType === 'yuntai-menu-manua'){
          $menu.find("a.cloud-config i").removeClass().addClass('pic-cloud-manua');
          $cloud_notice.find("span").text(languages[language]['lp5']);
        }else if(_operType === 'yuntai-menu-auto'){
          $menu.find("a.cloud-config i").removeClass().addClass('pic-cloud-auto');
          $cloud_notice.find("span").text(languages[language]['lp6']);
        }else if(_operType === 'yuntai-menu-stop'){
          $videoPlayer.removeClass("ma-player");
          $menu.find("a.cloud-config i").removeClass().addClass('pic-cloud-config');
          $cloud_notice.hide();
        }else if(_operType === 'yuntai-manua-up'){
          
          pro_cloud = true;
          stopCloud();
          currentOperStatus = "manual";
          $cloud_notice.find("span").text(languages[language]['lp5']);
          $videoPlayer.addClass("ma-player");
          $cloud_notice.show();
          manuaCloud("up");
          // stopCloud();
          // currentOperStatus = "manual";
          // $cloud_notice.find("span").text(languages[language]['lp5']);
          // $videoPlayer.addClass("ma-player");
          // $cloud_notice.show();
          // $menu.find("a.cloud-config i").removeClass().addClass('pic-cloud-manua');
          // if (currentOperStatus === "auto") stopCloud();
        }else if(_operType === 'yuntai-manua-down'){
          pro_cloud = true;
          stopCloud();
          currentOperStatus = "manual";
          $cloud_notice.find("span").text(languages[language]['lp5']);
          $videoPlayer.addClass("ma-player");
          $cloud_notice.show();
          manuaCloud("down");
        }else if(_operType === 'yuntai-manua-left'){
          pro_cloud = true;
          stopCloud();
          currentOperStatus = "manual";
          $cloud_notice.find("span").text(languages[language]['lp5']);
          $videoPlayer.addClass("ma-player");
          $cloud_notice.show();
          manuaCloud("left");
        }else if(_operType === 'yuntai-manua-right'){
          pro_cloud = true;
          stopCloud();
          currentOperStatus = "manual";
          $cloud_notice.find("span").text(languages[language]['lp5']);
          $videoPlayer.addClass("ma-player");
          $cloud_notice.show();
          manuaCloud("right");
        }else if(_operType === 'yuntai-manua-leftup'){
          pro_cloud = true;
          stopCloud();
          currentOperStatus = "manual";
          $cloud_notice.find("span").text(languages[language]['lp5']);
          $videoPlayer.addClass("ma-player");
          $cloud_notice.show();
          manuaCloud("leftup");
        }else if(_operType === 'yuntai-manua-rightup'){
          pro_cloud = true;
          stopCloud();
          currentOperStatus = "manual";
          $cloud_notice.find("span").text(languages[language]['lp5']);
          $videoPlayer.addClass("ma-player");
          $cloud_notice.show();
          manuaCloud("rightup");
        }else if(_operType === 'yuntai-manua-leftdown'){
          pro_cloud = true;
          stopCloud();
          currentOperStatus = "manual";
          $cloud_notice.find("span").text(languages[language]['lp5']);
          $videoPlayer.addClass("ma-player");
          $cloud_notice.show();
          manuaCloud("leftdown");
        }else if(_operType === 'yuntai-manua-rightdown'){
          pro_cloud = true;
          stopCloud();
          currentOperStatus = "manual";
          $cloud_notice.find("span").text(languages[language]['lp5']);
          $videoPlayer.addClass("ma-player");
          $cloud_notice.show();
          manuaCloud("rightdown");
        }else{
          $cloud_notice.hide();
        }
      });
    };

    init = function() {
      player = cfg.player;
      config = cfg.config;
      language = cfg.config.language;
      $container = cfg.container;
      $menu = cfg.menu;
      $videoPlayer = $container.find(".player");

      $container.find(".player-main .player-wrap").append(yuntai_notice_tpl);
      $menu.append();
      $cloud_notice = $container.find(".player-main .player-wrap .cl-notice");
      $yuntaiops = $container.find(".player-main ul.yuntaiops");
      dbsnCount = 0;


      player.registEvent("control-yuntai-oper");
      bindEvent();
    };

    _model = {
      //todo
    };
    init();
    return _model;
  };

  createMenu = function(_language, $menu, $container, cfg) {
    if(!cfg.isPrivate) return;
    if (cfg.yuntaiType === 1) {
      $menu.append(yuntai_menu_tpl.replace("{lp1}", languages[_language].lp1).replace("{lp2}", languages[_language].lp2)
        .replace("{lp3}", languages[_language].lp3).replace("{lp4}", languages[_language].lp4));
      $menu.addClass("cloud-config");
    } else {
      $(mobile_yuntai_tpl).prependTo($container.find(".player-main"));
    }
  };
  plugin.key = "cloud-config";
  plugin.menu = {
    getMenu: createMenu,
    d: "right"
  };

  return plugin;
});
