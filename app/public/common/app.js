define(function() {
  var routeConfig = require.s.contexts._.config.routeConfig || {};
  var ZBaseApp = angular.module("ZBaseApp", require.s.contexts._.config.appDepModules);
  var dependServiceFn = function(dependencies) {
    var definition = {
      resolver: ['$q', '$rootScope', function($q, $rootScope) {
        var deferred = $q.defer();
        require(dependencies, function() {
          $rootScope.$apply(function() {
            deferred.resolve();
          });
        });
        return deferred.promise;
      }]
    };
    return definition;
  };

  ZBaseApp.config([
    '$routeProvider',
    '$locationProvider',
    '$controllerProvider',
    '$compileProvider',
    '$filterProvider',
    '$provide',
    '$httpProvider',
    function($routeProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $httpProvider) {
      ZBaseApp.controller = $controllerProvider.register;
      ZBaseApp.directive = $compileProvider.directive;
      ZBaseApp.filter = $filterProvider.register;
      ZBaseApp.factory = $provide.factory;
      ZBaseApp.service = $provide.service;

      // $httpProvider.defaults.timeout = 100000;

      $httpProvider.defaults.headers.post = {
        'Content-Type': 'application/x-www-form-urlencoded'
      };

      $httpProvider.interceptors.push(["$rootScope", "$q", function($rootScope, $q) {
        return {
          "request": function (config) {
            config.timeout = 100000;
            return config;
          },
          "requestError": function() {
            var deferred = $q.defer();
            return deferred.resolve;
          },
          "responseError": function(response) {
            var error = response.data;
            try {
              if(error){
                if (typeof response.data === "string") {
                  error = JSON.parse(error);
                }
              } else {
                error = {
                  error_code: response.status,
                  error_msg: response.statusText
                };

              }
            } catch (e) {
              error = {
                error_code: response.status,
                error_msg: response.statusText
              };
            }
            response.data = error;
            return response;
          }
        };
      }]);

      $httpProvider.defaults.transformRequest = function(obj) {

        if (obj)
          return $.param(obj);
        else
          return obj;
      };

      angular.forEach(routeConfig.routes, function(_cfg, _r) {
        $routeProvider.when(_r, {
          templateUrl: _cfg.templateUrl,
          resolve: dependServiceFn(_cfg.deps)
        });
      });

      $routeProvider.otherwise({
        redirectTo: routeConfig.defaultRoutePaths
      });
    }
  ]);

  return ZBaseApp;
});