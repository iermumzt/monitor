define(["serverroutes", "jquery"], function() {

  //var serviceRoutes = {};

  var urlRoutes = {};

  var CallServer = {};
  var languages = {
    "zh-cn": {
      "lp1": "请重新登录！",
      "lp2": "您绑定的百度账号失效了，请重新登陆！"
    },
    en: {
      "lp1": "Please log in agin!",
      "lp2": "Your Baidu account has been invalid.Please log in again!"
    }
  };
  var initServiceRoutes = function() {
    var createServiceFactory = function(_urlCfg, _service) {
      var _requertUrl = CURRENT_PROJECT_MODE === "develop" ? _urlCfg[1] : _urlCfg[2];
      CallServer[_service + "_" + _urlCfg[0] + "_callserver"] = function(_param, cbFn, errorFn) {
        $.ajax({
          url: _requertUrl[0],
          type: _requertUrl[1] === "JSONP" ? "get" : _requertUrl[1],
          dataType: _requertUrl[1] === "JSONP" ? "JSONP" : "json",
          data: _param,
          success: function(_data) {
            if (cbFn) {
              cbFn(_data);
            }
          },
          error: function(_data) {
            _data.error_code = Number(_data.error_code);
            if (_data.error_code === 110 || _data.error_code === 101) {
              AppLog.error(languages[CURRENT_PROJECT_LANGUAGE].lp1, 1);
            }
            if (_data.error_code === 111 && Number(_data.connect_type) === 1) {
              AppLog.error(languages[CURRENT_PROJECT_LANGUAGE].lp2, 1);
            }
            if (errorFn) {
              errorFn(_data);
            }
          }

        });
      };
    };
    var createService = function(_m) {

      var cm = IERMU_SERVER_ROUTES.serviceRouteUrls[_m],
        i;
      for (i = 0; i < cm.length; i++) {
        createServiceFactory(cm[i], _m, CallServer);
      }
    };
    var m;
    for (m in IERMU_SERVER_ROUTES.serviceRouteUrls) {
      if ({}.hasOwnProperty.call(IERMU_SERVER_ROUTES.serviceRouteUrls, m)) {
        createService(m);
      }
    }
  };

  var initUrlRoutes = function() {
    var i;
    for (i = 0; i < IERMU_SERVER_ROUTES.urlRouteUrls.length; i++) {
      urlRoutes[IERMU_SERVER_ROUTES.urlRouteUrls[i][0]] = CURRENT_PROJECT_MODE === "develop" ? IERMU_SERVER_ROUTES.urlRouteUrls[i][1] : IERMU_SERVER_ROUTES.urlRouteUrls[i][2];
    }
  };

  initServiceRoutes();
  initUrlRoutes();

  return {
    CallServer: CallServer,
    urlRoutes: {
      get: function(_m, _param) {
        var _url = urlRoutes[_m], p;
        _param = _param || {};
        _param.taskid = IX.UUID.generate();
        for (p in _param) {
          if ({}.hasOwnProperty.call(_param, p)) {
            _url = _url.replace(new RegExp("{" + p + "}", "ig"), _param[p]);
          }
        }
        return _url;
      }
    }
  };
});