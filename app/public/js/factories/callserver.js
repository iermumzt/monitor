define(["serverroutes", "angular", "angularResource"], function() {
  var CallServer = angular.module("CallServer", ['ngResource']);
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

    var cm = IERMU_SERVER_ROUTES.serviceRouteUrls[_m],
      i;
    for (i = 0; i < cm.length; i++) {
      createServiceFactory(cm[i], _m, CallServer);
    }
  };
  var initServiceRoutes = function() {
    var m;
    for (m in IERMU_SERVER_ROUTES.serviceRouteUrls) {
      if ({}.hasOwnProperty.call(IERMU_SERVER_ROUTES.serviceRouteUrls, m)) {
        createService(m);
      }
    }
  };

  initServiceRoutes();
});