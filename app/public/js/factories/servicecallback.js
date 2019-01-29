define(["app", "oauth"], function(Factories, OAuth) {
  Factories.factory("ServiceCallBack", function() {
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
    var _model = {
      renderData: function(_data, isArray, _params, noLog) {
        if (_data && _data.error_code) {
          if (isArray && !_data.list) {
            _data.list = [];
            _data.count = 0;
          }
          _data.error_code = Number(_data.error_code);
          if(!noLog){
            if (_data.error_code === 110 || _data.error_code === 101) {
              AppLog.error(languages[CURRENT_PROJECT_LANGUAGE].lp1, 1);
            }
            if (_data.error_code === 111 && Number(_data.connect_type) === 1) {
              AppLog.error(languages[CURRENT_PROJECT_LANGUAGE].lp2, 1);
            }
          }
        }
        _data.__params = _params;
        return _data;
      },
      renderDataWithOAuth: function(){
        var _data = _model.renderData.apply(null, arguments);
        if (_data.error_code === 111 && Number(_data.connect_type) === 1) {
          OAuth.redirect2BaiduOAuth();
        }
        return _data;
      }
    };
    return _model;
  });
});