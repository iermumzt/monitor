define(["oauth", "activitymanager", "ui_dialog", "jquery", "IX", "underscore", "ui_log"], function(OAuth, ActivityManager, Dialog) {
  var checkNavagation = function() {
    if (IX.IE.isLtIE9) {

        $("div#wc_main_checkNavagation").show();
        $("div#wc_main1_checkNavagation").show();
    }
  };
  var cdn_hash = {};
  var getCdnUrl = function(_url) {
    var b = _url;
    var domain = CURRENT_PROJECT_CDN_DOMAINS[_.random(0, CURRENT_PROJECT_CDN_DOMAINS.length - 1)];

    if (!window.CURRENT_PROJECT_CDN_DOMAINS || _url.indexOf("http:") === 0 || _url.indexOf("https:") === 0 || _url.indexOf("ftp:") === 0) {
      return _url;
    }
    if (cdn_hash[_url]) {
      return cdn_hash[_url];
    }

    if (CURRENT_PROJECT_CDN_DOMAINS.length > 0) {
      if (domain === "/" && _url[0] === "/") {
        // empty;
      } else {
        if (domain[domain.length - 1] === "/" && _url[0] === "/") {
          _url = domain + _url.substr(1);
        } else {
          _url = domain + _url;
        }
      }
    }
    cdn_hash[b] = _url;
    return _url;
  };
  /*
  sources: [
  ".jpg", ".mp4"...
  {
  url: "",
  type: "jpg" //mp4...
  }
  ],
  loadingHandler: dom
  */
  var PageLoader = function(cfg) {
    var config = $.extend(true, {
      sources: [],
      sectionItems: "div.section",
      getScrollFn: function() {
        return document.body.scrollTop;
      },
      loadingFinish: 1, //1 or 2
      onLoadComplete: function() { /**/ }, //1 2 3
      onEnterSection: function() { /**/ },
      onLoadStepChanged: function() { /**/ }
    }, cfg);
    var $window, $datas, $data_defers, $data_posters, $data_defer_posters;
    var $zloading_text;
    var $sectionItems;
    var sources = [],
      dataSources = [],
      dataDeferSources = [];

    var load = function(_sources, onloaded) {
      var type = "";

      var resetItem = function(_obj) {
        var tagName, _url;
        if (!_obj || !_obj.item) {
          return;
        }

        tagName = _obj.item.tagName.toLowerCase();
        _url = _obj.url;
        if (_obj.isVideo) {
          try {
            _obj.item.src = _url;
          } catch (ex) {
            /**/
          }
          return;
        }
        if (tagName === "img") {
          _obj.item.src = _url;
        } else if (tagName === "video") {
          _obj.item.poster = _url;
        } else {
          _obj.item.style.backgroundImage = "url(" + _url + ")";
        }
      };

      var loadSource = function(_obj) {
        setTimeout(function() {
          var c, cc, hasLoaded, _fn;
          switch (_obj.type) {
            case "jpg":
            case "png":
            case "jpeg":
            case "gif":
            case "ico":
            case "image":
              {
                c = new Image();
                _obj.isImage = true;
                c.onload = c.onerror = function() {
                  if (c) {
                    c.onload = c.onerror = null;
                    c = null;
                  }
                  resetItem(_obj);
                  onloaded(_obj);
                };
                c.src = _obj.url;
              }
              break;
            case "mp4":
            case "mp3":
            case "ogg":
            case "wav":
            case "video":
              {
                cc = new Audio();
                hasLoaded = false;
                //console.info(_obj.url);
                _fn = function(event) {
                  if (hasLoaded) return;
                  hasLoaded = true;
                  if (cc) {
                    cc.oncanplaythrough = cc.oncanplay = cc.onplay = cc.onerror = cc.onsuspend = cc.onstalled = cc.onabort = null;
                    cc.removeEventListener('canplay', _fn, false);
                    cc.removeEventListener('error', _fn, false);
                    cc.removeEventListener('suspend', _fn, false);
                    cc = null;
                  }
                  resetItem(_obj);
                  onloaded(_obj);
                };
                _obj.isVideo = true;

                cc.oncanplaythrough = cc.oncanplay = cc.onplay = cc.onerror = cc.onsuspend = cc.onstalled = cc.onabort = _fn;
                cc.addEventListener('canplay', _fn, false);
                cc.addEventListener('error', _fn, false);
                cc.addEventListener('suspend', _fn, false);
                cc.src = _obj.url;
                cc.load();

                setTimeout(function() {
                  if (!hasLoaded) {
                    _fn();
                  }
                }, 10000);
              }

              break;
          }
        }, 0);
      };
      var i, ci, _ci_obj;

      onloaded = onloaded || function() { /**/ };
      for (i = 0; i < _sources.length; i++) {
        ci = _sources[i];
        _ci_obj = {};
        if (typeof ci === "string") {
          type = ci.split("?")[0].split(".");
          type = type[type.length - 1].toLowerCase();
          if (("," + ["jpg", "png", "jpeg", "gif", "ico", "mp3", "mp4", "ogg", "wav"].join() + ",").indexOf("," + type + ",") === -1) {
            type = "image";
          }
          _ci_obj = {
            url: ci,
            type: type
          };
        } else {
          _ci_obj = ci;
          if (!_ci_obj.type) {
            type = ci.url.split("?")[0].split(".");
            _ci_obj.type = type[type.length - 1].toLowerCase();
          }
        }
        loadSource(_ci_obj);
      }
    };

    var setLoadingText = function(cur, total) {
      $zloading_text.html((total === 0 ? 0 : parseInt(cur / total * 100)) + '%');
      if (cur === total) {
        $("#J_MiLoading").remove();
        config.onLoadComplete();
      }
    };

    var startLoad = function() {

      var len = sources.length,
        sum = len,
        c = 0,
        sc = 0,
        i, ci;
      var loadDeferSources = function() {
        $data_defer_posters.each(function() {
          dataDeferSources.push({
            url: getCdnUrl(this.getAttribute("data-defer-poster")),
            item: this
          });
        });
        $data_defers.each(function() {
          dataDeferSources.push({
            url: getCdnUrl(this.getAttribute("data-defer")),
            item: this
          });
        });
        load(dataDeferSources);
      };

      var loadDataSources = function() {
        len = dataSources.length;
        c = 0;
        if (len === 0) {
          return loadDeferSources();
        }
        load(dataSources, function() {
          c++;
          sc++;
          setLoadingText(sc, sum);
          if (c === len) {
            loadDeferSources();
          }
        });
      };

      var loadSources = function() {

        load(sources, function() {
          c++;
          sc++;
          setLoadingText(sc, sum);
          if (c === len) {
            config.onLoadStepChanged(1);
            loadDataSources();
          }
        });
      };

      for (i = len - 1; i >= 0; i--) {
        ci = sources[i];
        if (!ci) {
          sources.splice(i, 1);
          continue;
        }
        if (typeof ci === "string") {
          sources[i] = getCdnUrl(ci);
        } else {
          sources[i].url = getCdnUrl(ci.url);
        }
      }
      len = sources.length;
      sum = len;

      $datas.each(function() {
        dataSources.push({
          url: getCdnUrl(this.getAttribute("data-src")),
          item: this
        });
      });
      $data_posters.each(function() {
        dataSources.push({
          url: getCdnUrl(this.getAttribute("data-poster")),
          item: this
        });
      });
      if (config.loadingFinish === 2) {
        sum += dataSources.length;
      }
      setLoadingText(0, sum);
      if (len === 0) {
        config.onLoadStepChanged(1);
        loadDataSources();
      } else {
        loadSources();
      }
    };

    var onScroll = function() {
      var scrollTop = config.getScrollFn();
      $sectionItems.each(function() {
        var $this = $(this),
          offset = $this.offset(),
          height = $this.outerHeight();
        if (scrollTop < offset.top + height && scrollTop > offset.top + height / 3 && this.className.indexOf("zb-enter") === -1) {
          this.className = this.className + " " + "zb-enter";
          config.onEnterSection($this);
        }
      });
    };

    var bindEvent = function() {
      $window.scroll(onScroll);
    };

    var init = function() {
      var scrollTop, hasFind;
      var fn = config.onLoadStepChanged;
      $window = $(window);
      $datas = $("[data-src]");
      $data_posters = $("[data-poster]");
      $data_defers = $("[data-defer]");
      $data_defer_posters = $("[data-defer-poster]");
      $zloading_text = $("#zloading_text");

      $sectionItems = $(config.sectionItems);
      if ($sectionItems.length > 0) {
        scrollTop = config.getScrollFn();
        hasFind = false;
        bindEvent();

        $sectionItems.each(function() {
          var $this = $(this),
            offset = $this.offset(),
            height = $this.outerHeight();
          if (scrollTop < offset.top + height && scrollTop > offset.top) {
            this.className = this.className + " " + "zb-enter";
            hasFind = true;
            config.onEnterSection($this);
          }
        });
        if (!hasFind) {
          $sectionItems.eq(0).addClass("zb-enter");
          config.onEnterSection($sectionItems.eq(0));
        }
      }

      config.onLoadStepChanged = function(_step) {
        if (_step === 1) {
          new ActivityManager({
            data: window.CURRENT_PROJECT_ACTIVITY
          });
        }
        fn.apply(null, arguments);
      };

      sources = config.sources || [];
      if (window.CURRENT_PROJECT_SOURCES && window.CURRENT_PROJECT_SOURCES.length > 0) {
        sources = window.CURRENT_PROJECT_SOURCES.concat(sources);
      }

      startLoad();
      checkNavagation();
    };

    var _model = {};
    init();
    return _model;
  };

  var getEventTouchObj = function(e) {
    return e.touches && e.touches[0] ? e.touches[0] : e.originalEvent && e.originalEvent.touches && e.originalEvent.touches[0] ? e.originalEvent.touches[0] : e.originalEvent && e.originalEvent.changedTouches && e.originalEvent.changedTouches[0] ? e.originalEvent.changedTouches[0] : e;
  };


  var languages = {
    "zh-cn": {
      "lp1": "请重新登录！",
      "lp2": "您绑定的百度账号失效了，请重新登陆！",
      "lp3": "重新使用百度账号登录？",
      "lp4": "确定",
      "lp5": "取消",
      "lp6": "提示"
    },
    en: {
      "lp1": "Please log in agin!",
      "lp2": "Your Baidu account has been invalid.Please log in again!",
      "lp3": "Please use baidu to login again?",
      "lp4": "submit",
      "lp5": "cancel",
      "lp6": "prompt"
    }
  };
  var ajax = {
    renderData: function(_data, isArray, _params, noLog) {
      if (_data && _data.error_code) {
        if (isArray && !_data.list) {
          _data.list = [];
          _data.count = 0;
        }
        _data.error_code = Number(_data.error_code);
        if (!noLog) {
          if ((_data.error_code === 110 || _data.error_code === 101) && !_data.connect_type) {
            AppLog.error(languages[CURRENT_PROJECT_LANGUAGE].lp1, 1);
          }
          if ((_data.error_code === 111 || _data.error_code === 110) && Number(_data.connect_type) === 1 && !$(".loginDialog").length) {
            ajax.renderDataWithOAuth(_data);
          }
        }

      }
      _data.__params = _params;
      return _data;
    },
    renderDataWithOAuth: function(_data) {
      // var _data = ajax.renderData.apply(null, arguments);
      if ((_data.error_code === 111 || _data.error_code === 110) && Number(_data.connect_type) === 1) {
        // OAuth.redirect2BaiduOAuth();
        var dialog = new Dialog({
          title: languages[CURRENT_PROJECT_LANGUAGE]['lp6'],
          noFooter: true,
          className: "loginDialog",
          html: [
            "<div class='p'>",
            "<p class='content'>" + languages[CURRENT_PROJECT_LANGUAGE]['lp3'] + "</p>",
            "<div class = 'btns-3'>",
            "<a class = 'zb-login'>" + languages[CURRENT_PROJECT_LANGUAGE]['lp4'] + "</a>",
            "<a class = 'zb-cancel'>" + languages[CURRENT_PROJECT_LANGUAGE]['lp5'] + "</a>",
            "</div>",
            "</div>"
          ].join("")
        });
        dialog.show();
        dialog.$.find("div.btns-3 a.zb-login").click(function() {
          OAuth.redirect2BaiduOAuth(window.location.href);
        });
        dialog.$.find("div.btns-3 a.zb-cancel").click(function() {
          dialog.remove();
        });
      }
      return _data;
    }
  };

  if (!window.ZBase) {
    ZBase = {};
  }
  ZBase.ajax = ajax;
  ZBase.PageLoader = PageLoader;
  ZBase.getCdnUrl = getCdnUrl;
  ZBase.Event = {};
  ZBase.Event.getEventTouchObj = getEventTouchObj;
  return ZBase;
});