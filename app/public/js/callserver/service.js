define(["serverroutes"], function(serverRoutes) {

  //	var serviceRoutes = {};

  var urlRoutes = {};

  var CallServer = angular.module("CallServer", ['ngResource']);

  var initServiceRoutes = function() {
    var createServiceFactory = function(_urlCfg, _service) {
      var _requertUrl = CURRENT_PROJECT_MODE === "develop" ? _urlCfg[1] : _urlCfg[2];
      CallServer.factory(_service + "_" + _urlCfg[0] + "_callserver", ["$resource", function($resource) {
        return $resource(_requertUrl[0], IX.inherit({}, _requertUrl[1] === "JSONP" ? {
          callback: "JSON_CALLBACK"
        } : {}), {
          query: {
            method: _requertUrl[1],
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              "Accept": "application/json"
            },
            params: {},
            isArray: _urlCfg[3]
          },
          save: {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              "Accept": "application/json"
            },
            method: "post",
            params: {},
            data: {}
          }
        });
      }]);
    };
    var createService = function(_m) {

      var cm = serverRoutes.serviceRouteUrls[_m], i;
      for (i = 0; i < cm.length; i++) {
        createServiceFactory(cm[i], _m, CallServer);
      }
    };
    var m;
    for (m in serverRoutes.serviceRouteUrls) {
      if ({}.hasOwnProperty.call(serverRoutes.serviceRouteUrls, m)) {
        createService(m);
      }
    }
  };

  var initUrlRoutes = function() {
    var i;
    for (i = 0; i < serverRoutes.urlRouteUrls.length; i++) {
      urlRoutes[serverRoutes.urlRouteUrls[i][0]] = CURRENT_PROJECT_MODE === "develop" ? serverRoutes.urlRouteUrls[i][1] : serverRoutes.urlRouteUrls[i][2];
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
