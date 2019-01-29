define(["app", "oauth", "zbase"], function(Factories, OAuth, ZBase) {
  Factories.factory("ServiceCallBack", function() {
    return ZBase.ajax;
  });
});