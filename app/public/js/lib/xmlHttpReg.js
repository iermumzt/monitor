(function() {
  var xmlHttpReg = function(_config) {
    var xmlHttpReg_ = null;
    var content = null;
    var jsonpconfig = {
      url: "",
      type: "jsonp", //post  get jsonp
      data: {},
      callback: "callback",
      success: function() { /**/ },
      fail: function() {/**/ }
    };

    var getClass = function(ob) {
      return Object.prototype.toString.call(ob).match(/^\[object\s(.*)\]$/)[1].toLowerCase();
    };

    var urlEncode = function(param, key) {
      var paramStr = [], t, i, k;
      if (param === null || param === undefined) return '';
      t = typeof(param);
      if (t === 'string' || t === 'number' || t === 'boolean') {
        paramStr.push(encodeURIComponent(key) + '=' + encodeURIComponent(param));
      } else {
        for (i in param) {
          k = key == null ? i : key + '[' + (param instanceof Array && typeof param[i] === "object" || !(param instanceof Array) ? i : "") + ']';
          paramStr.push(urlEncode(param[i], k));
        }
      }
      return paramStr.join("&");
    };

    var jsonp = function() {
      //创建 script 标签并加入到页面中
      var callbackName = ('jsonp_' + Math.random()).replace(".", "");
      var oHead = document.getElementsByTagName('head')[0];
      jsonpconfig.data[jsonpconfig.callback] = callbackName;
      content = urlEncode(jsonpconfig.data);
      var oS = document.createElement('script');
      oHead.appendChild(oS);

      //创建jsonp回调函数
      window[callbackName] = function(json) {
        oHead.removeChild(oS);
        window[callbackName] = null;
        jsonpconfig.success(json);
      };
      oS.src = jsonpconfig.url + '?' + content;
    };

    var renderparams = function() {
      //_config.url
      _config.url = typeof _config.url === "string" ? _config.url.replace(/\s*/g, "") : "";
      if (_config.url) {
        jsonpconfig.url = _config.url;
      } else {
        throw "url格式不正确";
      }
      //_config.type
      jsonpconfig.type = (_config.type + "").toLowerCase();
      switch (jsonpconfig.type) {
        case "get":
        case "jsonp":
        case "post":
          break;
        default:
          jsonpconfig.type = "get";
      }
      //_config.data
      jsonpconfig.data = getClass(_config.data) === "object" ? _config.data : {};
      //_config.success
      if (typeof _config.success === "function") {
        jsonpconfig.success = _config.success;
      }
      //_config.fail
      if (typeof _config.success === "function") {
        jsonpconfig.success = _config.success;
      }
    };

    var doResult = function() {
      if (xmlHttpReg_.readyState === 4) {
        if (xmlHttpReg_.status === 200) {
          jsonpconfig.success(xmlHttpReg.responseText);
        } else {
          jsonpconfig.fail(xmlHttpReg.responseText);
        }
      }

    };
    var sendAjax = function() {
      if (window.ActiveXObject) { //如果是IE
        xmlHttpReg_ = new ActiveXObject("Microsoft.XMLHTTP");
      } else if (window.XMLHttpRequest) {
        xmlHttpReg_ = new XMLHttpRequest(); //实例化一个xmlHttpReg
      }
      if (xmlHttpReg_ === null) {
        throw "浏览器不支持ajax请求";
      }
      content = urlEncode(jsonpconfig.data);
      if (jsonpconfig.type === "get") {
        xmlHttpReg_.open("GET", jsonpconfig.url + (content ? "?" + content : ""), true);
        xmlHttpReg_.send();
        xmlHttpReg_.onreadystatechange = doResult; //设置回调函数
      } else if (jsonpconfig.type === "post") {
        xmlHttpReg_.open("post", jsonpconfig.url, true);
        xmlHttpReg_.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        if (content) xmlHttpReg_.send(content);
        xmlHttpReg_.onreadystatechange = doResult; //设置回调函数
      } else if (jsonpconfig.type === "jsonp") {
        jsonp();
      }
    };
    var init = function() {
      renderparams();
      sendAjax();
    };
    init();
  };
  var parseurl = function(_url) {
    var patt = new RegExp(/\?.+$/);
    var patt1 = new RegExp("=");
    var url = _url || window.location.href;
    if (patt.test(url) === false) {
      return {}
    }
    var paraString = url.substring(url.indexOf("?") + 1, url.length);
    var paraObj = {};
    paraString = decodeURIComponent(paraString).split("&");

    for (var i = 0; j = paraString[i]; i++) {

      if (patt1.test(j) === false) {
        paraObj[j] = '';
        return paraObj;
      }
      paraObj[j.substring(0, j.indexOf("="))] = j.substring(j.indexOf("=") + 1, j.length);
    }
    return paraObj;
  }
  window.WC = {
    xmlHttpReg: xmlHttpReg,
    parseurl: parseurl
  }
})()