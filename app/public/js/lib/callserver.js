define(["serverroutes", "jquery", "zbase"], function(serverRoutes, $, ZBase) {
  var CallServer = {};

  var createServiceFactory = function(_urlCfg, _service) {
    var _requertUrl = CURRENT_PROJECT_MODE === "develop" ? _urlCfg[1] : _urlCfg[2];
    CallServer[_service + "_" + _urlCfg[0] + "_callserver"] = function(_param, cbFn, errorFn) {
      $.ajax({
        url: _requertUrl[0],
        type: _requertUrl[1] === "JSONP" ? "get" : _requertUrl[1],
        dataType: _requertUrl[1] === "JSONP" ? "JSONP" : "json",
        data: _param,
        success: function(_data) {
          _data = ZBase.ajax.renderData(_data, _urlCfg[3]);
          if (cbFn) {
            cbFn(_data);
          }
        },
        error: function(_data) {
          _data = ZBase.ajax.renderData(_data, _urlCfg[3]);
          if (errorFn) {
            errorFn(_data);
          }
        }

      });
    };
  };
  var createService = function(_m) {

    var cm = serverRoutes.serviceRouteUrls[_m],
      i;
    for (i = 0; i < cm.length; i++) {
      createServiceFactory(cm[i], _m, CallServer);
    }
  };
  var initServiceRoutes = function() {
    var m;
    for (m in serverRoutes.serviceRouteUrls) {
      if ({}.hasOwnProperty.call(serverRoutes.serviceRouteUrls, m)) {
        createService(m);
      }
    }
  };

  initServiceRoutes();

  return CallServer;
});