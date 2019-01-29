define(["js/callserver/cservice", "js/ui/ui_dialog"], function(CallServer, Dialog) {
  var languages = {
    "zh-cn": {
      "lp1": "截图",
      "lp2": "截图信息加载失败",
      "lp3": "下载",
      "lp4": "取消",
       "lp5": "截图失败"
    },
    "en": {
      "lp1": "Screenshot",
      "lp2": "Screenshot information loading failed.",
      "lp3": "Download",
      "lp4": "Cancel",
      "lp5": "Screenshot failed."
    }
  };
  var plugin = function(cfg) {
    var player, config;
    var $menu; //$container,
    var bindEvent, init, _model, currentSnap;
    var showDialog, dialog, getSnapInfo, addSnapInfo, deviceInfo, currentStatus, c_sid, errornum;
    var currentPlayCategory, isFullScreen, getImgUrl;
    bindEvent = function() {
      showDialog = function() {
        dialog = new Dialog({
          className: "snap",
          noHeader: true,
          noFooter: true,
          html: [
            "<div class='mask'>",
            "<span class='flower-loader'>Loading…</span>",
            "</div>",
            "<div class = 'xiazai' >",
            "<img src=''>",
            "<div class = 'footer'>",
            "<span class='name'></span>",
            "<div class = 'button'>",
            "<a class='tanchu xia' target='blank'>" + languages[config.language]['lp3'] + "</a>",
            "<a class='tanchu qu'>" + languages[config.language]['lp4'] + "</a>",
            "</div>",
            "</div>",
            "</div>"
          ].join("")
        });
        currentStatus = false;
        dialog.show();
        dialog.$.find(".button .qu").click(function() {
          dialog.remove();
        });
      };
      getImgUrl = function() {
        var imgName;
        var img = new Image();
        img.src = currentSnap.url;
        img.onerror = function() {
          errornum++;
          if (errornum < 10) {
            setTimeout(getImgUrl, 1000);
          } else {
            errornum = 0;
            AppLog.error(languages[config.language]['lp2']);
            dialog.remove();
            return;
          }
        };
        img.onload = function() {
          errornum = 0;
          imgName = currentSnap.url.substr(currentSnap.url.lastIndexOf("/") + 1);
          currentSnap.name = imgName.indexOf("?") > 0 ? imgName.substring(0, imgName.indexOf("?")) : imgName;
          dialog.$.find(".xiazai span.name").text(currentSnap.name);
          dialog.$.find(".xiazai img")[0].src = currentSnap.url;
          dialog.$.find(".xiazai .button a.xia").attr("href", currentSnap.url);
          dialog.$.find(".mask").hide();
        };
      };
      getSnapInfo = function() {
        CallServer.CallServer["profile_snapshot_info_callserver"]({
          method: "snapshotinfo",
          deviceid: deviceInfo.deviceid,
          sid: c_sid
        }, function(_data) {
          errornum = 0;
          currentSnap = _data;
          getImgUrl();
        }, function() {
          errornum++;
          if (errornum > 5) {
            errornum = 0;
            currentStatus = false;
            AppLog.error(languages[config.language]['lp2']);
            dialog.remove();
            return;
          }
          getSnapInfo();
          return;
        });
      };
      addSnapInfo = function(cbFn) {
        CallServer.CallServer["profile_add_snapshot_callserver"]({
          method: "snapshot",
          deviceid: deviceInfo.deviceid
        }, function(_data) {
          c_sid = _data.sid;
          if (cbFn) setTimeout(cbFn, 1000);
        }, function() {
            currentStatus = false;
            AppLog.error(languages[config.language]['lp5']);
            dialog.remove();
            return;
        });
      };
      $menu.click(function() {
        if (currentStatus || deviceInfo === null || (deviceInfo && deviceInfo['status'] !== undefined && (deviceInfo['status'] & 0x4) === 0)) return;
        currentStatus = true;
        showDialog();
        addSnapInfo(getSnapInfo);
      });
      player.on(plugin.key, "data-binded", function(_deviceInfo) {
        deviceInfo = _deviceInfo;
      });
      player.on(plugin.key, "play_category_changed", function(_category) {
        currentPlayCategory = _category;
        if (_category !== "live_play" || isFullScreen) $menu.hide();
        else $menu.show();
      });
      player.on(plugin.key, "fullscreen", function(opt) {
        isFullScreen = !opt ? false : true;
        if (!opt && currentPlayCategory === "live_play") {
          $menu.show();
        } else {
          $menu.hide();
        }
      });
    };

    init = function() {
      player = cfg.player;
      config = cfg.config;
      $menu = cfg.menu;
      errornum = 0;
      currentPlayCategory = "live_play";
      bindEvent();
    };
    _model = {
      //todo
    };

    init();
    return _model;
  };
  plugin.key = "snapshot";
  plugin.menu = {
    title: function(_language) {
      return languages[_language]["lp1"];
    },
    // key: "device-snapshot",
    d: "right",
    prev: "fullscreen",
    clz: "snapshot",
    i_clz: "pic-snapshot"
  };
  return plugin;
});
