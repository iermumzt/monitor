let request = require("request");
let config = require("../config");
let serverRoutesConfig = require(global.static_path + "/common/service-routes");
let utils_ext = require("utils-extend");
let url = require("url");

let requestConfig = {
  method: "GET",
  url: "",
  baseUrl: config.callserverBaseUrl,
  gzip: true,
  //jar: true,
  headers: {
    "Accept": "application/json"
  }
};

let callServer = (_action, _params = {}, _req) => {
  var query_url;
  return new Promise((resolve) => {
    let _urlCfg = serverRoutesConfig.getServerRouteUrl(_action, config.mode);
    if (!_urlCfg) {
      return resolve({
        error_code: 500,
        error_msg: "no action config"
      });
    }
    query_url = _urlCfg.url;
    if(_params.____url){
      query_url = _params.____url;
      delete _params["____url"];
    }
    let baseUrl = requestConfig.baseUrl;

    if (query_url.startsWith("https://") || query_url.startsWith("http://")) {
      baseUrl = undefined;
    } else {
      if (_req && _req.headers.host !== url.parse(requestConfig.baseUrl).host) {
        baseUrl = (_req && _req.headers["x-forwarded-proto"] || "https");
        baseUrl = baseUrl.replace(":", "") + "://" + _req.headers.host +"/";
      }
    }
    _urlCfg = utils_ext.extend({}, requestConfig, {
      url: query_url,
      qs: (_params),
      headers: {
        "User-Agent": _req && _req.headers["user-agent"],
        "X-Real-IP": _req && _req.headers["x-real-ip"],
        "X-Forwarded-For": _req && _req.headers['x-forwarded-for'],
        "Host": _req && _req.headers.host,
        "Cookie": _req && _req.headers.cookie + ""
      },
      jar: false

    },{
      baseUrl: baseUrl
    });
    request(_urlCfg, (error, response, body) => {
      let result = body;
      if (_urlCfg.headers["Accept"] === "application/json") {
        try {
          result = JSON.parse(body);
        } catch (ex) {
          //ex
        }
      }
      if (response && response.statusCode !== 200 && !result) {
        result = {
          error_code: response && response.statusCode || 500,
          error_msg: JSON.stringify(_urlCfg),
          server_msg: result
        };
      }

      if(result.error_code) {
        result.request_cfg = _urlCfg;
      }
      resolve(result);
    });
  });
};

exports.callServer = callServer;
