define(["js/callserver/cservice", "ui_dialog", "oauth"], function(CallServer, Dialog, OAuth) {
  var languages = {
    "zh-cn": {
      "lp15": "看录像",
      "lpp79": "收藏",
      "lppa1": "分享",
      "lpp80": "已收藏",
      "lpp81": "举报",
      "lpp82": "已举报",
      "lpp107": "万",
      "lpp70": "我要举报公共摄像机",
      "lpp71": "请选择举报原因：",
      "lpp72": "色情低俗",
      "lpp73": "政治谣言",
      "lpp74": "侵害隐私",
      "lpp75": "广告骚扰",
      "lpp76": "诽谤他人",
      "lpp77": "其它",
      "lpp78": "提交",
      "lpp105": "提交成功",
      "lpp106": "请选择举报原因",
      "lpp108": "登录",
      "lpp109": "登录后才能执行此操作哦！",
      "lpp110": "登录",
      "lpp111": "取消"
    },
    "en": {
      "lp15": "Video",
      "lpp79": "collection",
      "lppa1": "share",
      "lpp80": "Already collected",
      "lpp81": "Report",
      "lpp82": "Has been reported",
      "lpp107": "w",
      "lpp70": "I want to report a public video camera",
      "lpp71": "Please select a report:",
      "lpp72": "Pornographic vulgarity",
      "lpp73": "Political rumors",
      "lpp74": "Violation of privacy",
      "lpp75": "The ads",
      "lpp76": "Calumny others",
      "lpp77": "other",
      "lpp78": "submit",
      "lpp105": "Submitted successfully",
      "lpp106": "Please select a report",
      "lpp108": "Log in to perform this operation ",
      "lpp109": "To log in? ",
      "lpp110": "log in",
      "lpp111": "cancel"
    }
  };
  var tpl = [
    '<div class="video-ops">',
    "<ul>",
    "<li class = 'video'>",
    "<div class = 'play-type-menus'>",
    "<button class = 'play-video'><span>{lp15}</span></button>",
    "</div>",
    "</li>",
    "<li class = 'share'><a class='sharec'><img class='v' src='/public/images/ops/{m}ops_share_gray.png' /><img class='c' src='/public/images/ops/{m}ops_share_light.png'/><span>{lppa1}</span></a><div></div></li>",
    "<li class = 'report'><a class='d'><img class='v' src='/public/images/ops/{m}ops_report_gray.png' /><img class='c' src='/public/images/ops/{m}ops_report_light.png' /><span>{lpp81}</span></a></li>", //<i class = 'pic-pic'></i>
    "<li class = 'collect'><a class='d'><img class='v' src='/public/images/ops/{m}ops_collect_gray.png' /><img class='c' src='/public/images/ops/{m}ops_collect_light.png' /><span class='cot'>{lpp79}</span></a></li>", //<i class = 'pic-pic'></i>
    "<li class = 'like'><a class='d'><img class='v' src='/public/images/ops/{m}ops_like_gray.png' /><img class='c' src='/public/images/ops/{m}ops_like_light_hover.png' /><img class='fly' src='/public/images/ops/{m}ops_like_light.png' /><span>0</span></a></li>", //<i class = 'pic-pic'></i>
    "<li class = 'view'><a><img class='v' src='/public/images/ops/{m}ops_play.png' /><img class='c' src='/public/images/ops/{m}ops_play.png' /><span>0</span></a></li>", //<i class = 'pic-pic'></i>
    "</ul>",
    '</div>'
  ].join("");
  var plugin = function(cfg) {
    var player, deviceInfo, config;
    var $container, $basecontainer, language = "zh-cn";
    var showLoginDialog, bindEvent, getTpl, init, _model, eventType;
    showLoginDialog = function() {
      var dialog = new Dialog({
        title: languages[config.language]['lpp108'],
        noFooter: true,
        className:"login",
        width:330,
        html: [
          "<div class = 'save-video-wrap3'>",
          "<p>" + languages[config.language]['lpp109'] + "</p>",
          "<div class = 'btns-3'>",
          "<a class = 'save-3 submit' role = 'button'>" + languages[config.language]['lpp110'] + "</a>",
          "<a class = 'save-3 cancel' role = 'button'>" + languages[config.language]['lpp111'] + "</a>",
          
          "</div>",
          "</div>"
        ].join("")
      });
      dialog.show();
      dialog.$.find("div.btns-3 a.submit").click(function() {
        OAuth.init();
      });
      dialog.$.find("div.btns-3 a.cancel").click(function() {
        dialog.remove();
      });
    };

    bindEvent = function() {
      player.on(plugin.key, "data-binded", function(_deviceInfo) {
        deviceInfo = _deviceInfo;
        $container.find(".view span").html(_deviceInfo.viewnum);
        $container.find(".like span").html(_deviceInfo.approvenum);
        if (_deviceInfo.subscribe === 1) {
          $container.find(".collect").addClass("enable");
          $container.find(".collect span").text(languages[language].lpp80);
        }
      });

      player.on(plugin.key, "play-video-event", function(_category) {
        if (!IX.browser.versions.mobile) return;
        if (_category === "play-video") {
          $container.hide();
        } else if (_category === "play-zhibo") {
          $container.show();
        }
      });

      $container.find(".play-type-menus button.play-video").click(function() {
        player.trigger("play-video-event", "play-video");
      });
      eventType = !IX.browser.versions.mobile ? "click" : "touchend";
      $container.find(".collect").on(eventType, function() {
        var _action, _method;
        if (!deviceInfo) return;
        if (!config.currentUser) return showLoginDialog();
        _action = "video_subscribe_callserver";
        _method = "subscribe";
        if (deviceInfo.subscribe === 1) {
          _action = "video_unsubscribe_callserver";
          _method = "unsubscribe";
          // $container.find(".collect span").text(languages[language].lpp80);
        }
        // $container.find(".collect").toggleClass("enable");
        CallServer.CallServer[_action]({
          method: _method,
          shareid: deviceInfo.shareid,
          uk: deviceInfo.uk
        }, function(_data) {
          if (_data.error_code) {
            return;
          }
          if (_method === "unsubscribe") {
            deviceInfo.subscribe = 0;
            $container.find(".collect").removeClass("enable");
            $container.find(".collect span").text(languages[language].lpp79);
          } else {
            deviceInfo.subscribe = 1;
            $container.find(".collect").addClass("enable");
            $container.find(".collect span").text(languages[language].lpp80);
          }
        });
      });
      $container.find(".share").on(eventType, function(e) {
        var $target = $(e.srcElement || e.target.parentElement);
        if ($target.is("a.sharec")) {
          $container.find(".share").toggleClass("s");
        }
      });
      $(document).bind("click", function(e) {
        var $target = $(e.srcElement || e.target.parentElement);
        if ($target.closest(".show-share-ops").length == 0 && $target.closest("li.share").length == 0 && $container.find(".share").is(".s")) {
          $container.find(".share").removeClass("s");
        }
      });
      
      var timeTrigger;
      $container.find(".like").on(eventType, function() {
        if (!deviceInfo) return;
        if (!config.currentUser) return showLoginDialog();

        $container.find(".like").removeClass("enable");
        clearTimeout(timeTrigger);
        if (this.className.indexOf("enable") < 0) {
          this.className += " enable";
          timeTrigger = setTimeout(function() {
            $container.find(".like").removeClass("enable");
          }, 800);
        }




        CallServer.CallServer["video_approve_callserver"]({
          method: 'approve',
          deviceid: deviceInfo.deviceid
        }, function(_data) {
          if (_data.error_code) {
            _data = {
              approvenum: deviceInfo.approvenum
            };
          }
          if (parseFloat(_data.approvenum) > 10000) {
            _data.approvenum = Math.round((_data.approvenum / 10000) * 10) / 10;
            _data.approvenum = _data.approvenum + languages[language].lpp107;
          } else {
            _data.approvenum = _data.approvenum;
          }
          $container.find(".like span").text(_data.approvenum);
        });
      });

      $container.find(".report").on(eventType, function() {
        var dialog;
        if (!deviceInfo) return;
        if (!config.currentUser) return showLoginDialog();
        dialog = new Dialog({
          title: languages[config.language]['lpp70'],
          noFooter: true,
          html: [
            "<div class = 'save-video-wrap2'>",
            "<p>" + languages[config.language]['lpp71'] + "</p>",
            "<div class='y1 yuanyin'><a class='i1'><i class='pic-checkbox'_i=1></i><span>" + languages[config.language]['lpp72'] + "</span></a><a class='i2'><i class='pic-checkbox' _i=2></i><span>" + languages[config.language]['lpp73'] + "</span></a><a class='i3'><i class='pic-checkbox' _i=3></i><span>" + languages[config.language]['lpp74'] + "</span></a><br/><a class='i4'><i class='pic-checkbox' _i=4></i><span>" + languages[config.language]['lpp75'] + "</span></a><a class='i5'><i class='pic-checkbox' _i=5></i><span>" + languages[config.language]['lpp76'] + "</span></a></div>",

            "<div class = 'clip-name2'><textarea _i=0 type = 'text' id = 'clipname'  placeholder=" + languages[config.language]['lpp77'] + "></textarea></div>",
            "<div class = 'btns-2'>",
            "<button class = 'save-2'><span>" + languages[config.language]['lpp78'] + "</span></button>",
            "</div>",
            "</div>"
          ].join("")
        });
        dialog.show();

        dialog.$.find("div.yuanyin a ").click(function() {

          $(this).find("i").toggleClass("pic-checked");
          $(this).find("i").toggleClass("pic-checkbox");
          $(this).siblings().find("i").removeClass("pic-checked").addClass('pic-checkbox');
          //($(this).find("i").attr("_i");
        });

        dialog.$.find("button.save-2").click(function() {

          var str1 = dialog.$.find(".clip-name2 textarea").val();
          var cs;

          if (dialog.$.find("div.yuanyin a i").hasClass("pic-checked")) {
            cs = dialog.$.find("div.yuanyin a i.pic-checked").attr("_i");

          } else if (str1 !== "") {
            cs = dialog.$.find(".clip-name2 textarea").attr('_i');
          } else {
            AppLog.error(languages[CURRENT_PROJECT_LANGUAGE].lpp106);
          }
          if (cs !== undefined) {
            dialog.remove();
            AppLog.success(languages[CURRENT_PROJECT_LANGUAGE].lpp105);
            $container.find("a.nowarning").addClass("hide");
            $container.find("a.warning").addClass("show");
            CallServer.CallServer["video_report_callserver"]({
              method: 'report',
              deviceid: deviceInfo.deviceid,
              type: cs,
              reason: str1
            });
          }
        });
      });
      player.on(plugin.key, "control-report", function(_operType) {
        var dialog;
        if (!deviceInfo) return;
        if (!config.currentUser) return showLoginDialog();
        dialog = new Dialog({
          title: languages[config.language]['lpp70'],
          noFooter: true,
          html: [
            "<div class = 'save-video-wrap2'>",
            "<p>" + languages[config.language]['lpp71'] + "</p>",
            "<div class='y1 yuanyin'><a class='i1'><i class='pic-checkbox'_i=1></i><span>" + languages[config.language]['lpp72'] + "</span></a><a class='i2'><i class='pic-checkbox' _i=2></i><span>" + languages[config.language]['lpp73'] + "</span></a><a class='i3'><i class='pic-checkbox' _i=3></i><span>" + languages[config.language]['lpp74'] + "</span></a><br/><a class='i4'><i class='pic-checkbox' _i=4></i><span>" + languages[config.language]['lpp75'] + "</span></a><a class='i5'><i class='pic-checkbox' _i=5></i><span>" + languages[config.language]['lpp76'] + "</span></a></div>",

            "<div class = 'clip-name2'><textarea _i=0 type = 'text' id = 'clipname'  placeholder=" + languages[config.language]['lpp77'] + "></textarea></div>",
            "<div class = 'btns-2'>",
            "<button class = 'save-2'><span>" + languages[config.language]['lpp78'] + "</span></button>",
            "</div>",
            "</div>"
          ].join("")
        });
        dialog.show();

        dialog.$.find("div.yuanyin a ").click(function() {

          $(this).find("i").toggleClass("pic-checked");
          $(this).find("i").toggleClass("pic-checkbox");
          $(this).siblings().find("i").removeClass("pic-checked").addClass('pic-checkbox');
          //($(this).find("i").attr("_i");
        });

        dialog.$.find("button.save-2").click(function() {

          var str1 = dialog.$.find(".clip-name2 textarea").val();
          var cs;

          if (dialog.$.find("div.yuanyin a i").hasClass("pic-checked")) {
            cs = dialog.$.find("div.yuanyin a i.pic-checked").attr("_i");

          } else if (str1 !== "") {
            cs = dialog.$.find(".clip-name2 textarea").attr('_i');
          } else {
            AppLog.error(languages[CURRENT_PROJECT_LANGUAGE].lpp106);
          }
          if (cs !== undefined) {
            dialog.remove();
            AppLog.success(languages[CURRENT_PROJECT_LANGUAGE].lpp105);
            $container.find("a.nowarning").addClass("hide");
            $container.find("a.warning").addClass("show");
            CallServer.CallServer["video_report_callserver"]({
              method: 'report',
              deviceid: deviceInfo.deviceid,
              type: cs,
              reason: str1
            });
          }
        });
      });
    };

    getTpl = function(opt, _tpl) {
      var f;
      var pros = _tpl.match(/\{[^\{\}]*\}/g).join();
      if (IX.browser.versions.mobile) {
        _tpl = _tpl.replace(/{m}/g, "m");
      } else {
        _tpl = _tpl.replace(/{m}/g, "");
      }
      for (f in opt) {
        if (pros.indexOf("{" + f + "}") > -1) {
          _tpl = _tpl.replace("{" + f + "}", opt[f]);
        }
      }
      return _tpl;
    };
    init = function() {
      language = cfg.config.language;
      config = cfg.config;
      $basecontainer = cfg.container;
      $container = $(getTpl(languages[language], tpl)).appendTo($basecontainer);
      player = cfg.player;
      bindEvent();
    };

    _model = {};
    init();
    return _model;
  };

  plugin.key = "ops";

  return plugin;
});