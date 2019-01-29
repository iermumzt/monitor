(function() {
  var AppLog = function() {
    var logs = [],
      log_hash = {},
      key = 1;
    var $container;
    var logItemTpl = '<div class = "{clz}"><p>{content}</p><a class = "app-log-close"></a></div>';
    var clzs = {
      "error": "jiayu",//"bg-danger",
      "warn": "jiayu",//"bg-warning",
      "success": "jiayu",//"bg-success",
      "info": "jiayu"//"bg-info"
    };

    var removeFast = function(_key) {
      var log;
      try {
        log = log_hash[_key];
        delete log_hash[_key];
        log.$item.parentNode.removeChild(log.$item);
        if (log.t1) {
          clearTimeout(log.t1);
        }
        if (log.t2) {
          clearTimeout(log.t2);
        }
      } catch (ex) {
        console.log(ex);
      }
    };

    var remove = function(_key, _speed) {
      var log = log_hash[_key];
      log.t1 = setTimeout(function() {
        try {
          log.$item.className += " remove";
        } catch (ex) {
          /**/
        }
        log.t2 = setTimeout(function() {
          removeFast(_key);
        }, _speed === undefined ? 1000 : _speed);
      }, _speed === undefined ? 3000 : _speed);
    };

    var showLog = function(_key,_speed) {
      var log, _div;
      log = log_hash[_key];
      logs.splice(0, 1);
      _div = document.createElement("div");
      _div.innerHTML = logItemTpl.replace("{content}", log.content).replace("{clz}", log.clz);
      log.$item = _div.children[0];
      $container.appendChild(log.$item);
      remove(_key,_speed);
    };

    var push = function(_type, _log, _key,_speed) {
      var log;
      if (log_hash[_key]) {
        removeFast(_key);
      }
      log = {
        content: _log.content || _log,
        key: _key === null || _key === undefined || _key === "" ? "_____" + (key++) : _key,
        clz: clzs[_type]
      };
      log_hash[log.key] = log;
      showLog(log.key,_speed);
    };

    var bindEvent = function() {
      $container.onclick = function(e) {
        var $target = e.target || e.srcElement;
        if ($target.tagName.toLowerCase() === "a" && $target.className === "app-log-close") {
          try {
            $target.parentNode.parentNode.removeChild($target.parentNode);
          } catch (ex) {

            // ex = ex + "";
            console.log(ex);

          }
        }
      };
    };

    var init = function() {
      $container = document.createElement("div");
      $container.className = 'app-log zbase-ui';
      document.body.appendChild($container);
      bindEvent();
    };

    var _model = {
      warn: function(_log, _key,_speed) {
        push("warn", _log, _key,_speed);
      },
      error: function(_log, _key,_speed) {
        push("error", _log, _key,_speed);
      },
      info: function(_log, _key,_speed) {
        push("info", _log, _key,_speed);
      },
      success: function(_log, _key,_speed) {
        push("success", _log, _key,_speed);
      },
      config: function() {/**/}
    };
    init();
    return _model;
  };
  window.AppLog = window.AppLog || (new AppLog());
})();
