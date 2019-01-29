define(["jquery", "underscore"], function($) {
  
  var OAuth = function() {

    var tokenObj = {};

    var getUrl = function(_type, _href) {
      // var domain = "";
      // var url = domain + "/api/user/{method}?redirect={href}&connect_type=1";
      // _href = _href || (document.location.pathname.indexOf("/") === -1 && document.location.pathname.indexOf("/video/") === -1 && document.location.pathname.indexOf("/playrecord") === -1 ? (document.location.origin + "/") : document.location.href);
      // return url.replace("{method}", _type || "login").replace("{href}", _href || window.location.href);

      var url = "";
      _href = _href || (document.location.pathname.indexOf("/") === -1 && document.location.pathname.indexOf("/video/") === -1 ? (document.location.origin + "/") : document.location.href);
      switch(_type){
        case "login": url = "/login?redirect={href}"; break;
        case "loginmobile": url = "/login?display=mobile&redirect={href}"; break;
        case "logout": url = "/api/v2/user/logout?redirect={href}"; break;
        case "baidu-login": url = "/api/v2/connect/baidu/auth"; break;
        
      }
      return url.replace("{href}", _href || window.location.href);
    };
    var lwidth = $(window).width();
    var redirect2Login = function() {
      if (lwidth < 1000) {
        window.location.href = getUrl("loginmobile");
      } else {
        window.location.href = getUrl("login");
      }
    };
    $(window).resize(function() {
      lwidth = $(window).width();
    });
    redirect2BaiduOAuth = function(_href) {
      window.location.href = getUrl("baidu-login", _href);
    };

    var redirect2Logout = function(cbFn) {
      $.ajax({
        url: getUrl("logout"),
        dataType: "jsonp",
        success: function() {
          if (cbFn) {
            cbFn();
          }
          if (window.location.pathname.indexOf("/") === 0) {
            document.location.href = '/';
          } else {
            window.location.reload();
          }
        },
        error: function(){
          if (cbFn) {
            cbFn();
          }
          if (window.location.pathname.indexOf("/") === 0) {
            document.location.href = '/';
          } else {
            window.location.reload();
          }
        }
      });
    };

    var logout = function(cbFn) {
      tokenObj = {};
      CURRENT_USERINFO = {};
      redirect2Logout(cbFn);
    };

    var parseCookie = function() {
      tokenObj = {};
      if (CURRENT_USERINFO && !CURRENT_USERINFO.error_code) {
        tokenObj = _.extend(CURRENT_USERINFO, {
          uname: CURRENT_USERINFO.username,
          uid: CURRENT_USERINFO.uid,
          email: CURRENT_USERINFO.email,
          portrait: CURRENT_USERINFO.avatar
        });
      }
    };

    var init = function() {
      parseCookie();
      if (!tokenObj.uid) {
        redirect2Login();
        return false;
      }
      return true;
    };
    var _model = {
      init: init,
      getUser: function() {
        parseCookie();
        return tokenObj["uid"] !== null && tokenObj["uid"] !== undefined && tokenObj["uid"] !== "" ? tokenObj : null;
      },
      logout: logout,
      redirect2BaiduOAuth: redirect2BaiduOAuth
    };
    return _model;
  };
  return new OAuth();
});
