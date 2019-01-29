let _ = require('underscore');
let fs = require("fs");
let express = require("express");
let url = require("url");
let querystring = require("querystring");
let md5 = require('../lib/md5');
let User = require('../models/user');
let ejs = require('ejs');
let util = require('utils-extend');
let path = require("path");


let app_dir = process.cwd();
let router_modules = require("../lib/requires")(app_dir + "/routes", "core.js");
let Translater = require(global.static_path + "/common/language");

let router = express.Router();
let directive_depends = {};
let page_depend_directives = [];
let page_depend_directive_hash = {};
let single_page_templates = [];
let module_md5_config;
let urls = {};
let directive_hash = {};
let config = global.app_config;
let component_depends = {};
let current_require_path = null;

let collectComponents = () => {
  var dirs = fs.readdirSync(global.static_path + "/components");

  dirs.forEach((_file_name) => {
    if (!_file_name.startsWith("d-")) return;
    try {
      directive_depends[_file_name] = fs.readFileSync(global.static_path + "/components/" + _file_name + "/component.ejs").toString();
    } catch (ex) {
      /**/
    }
  });
};

let renderPage = (req, res, _template, _params) => {
  res.render(_template, _params, (err, html) => {
    if (err) {
      if (req.url === "/500") {
        res.setHeader('Content-Type', 'text/html');
        res.send(new Buffer(err.message));
      } else {
        console.error(err);
        res.redirect("/500?url=" + req.url);
      }
    } else {
      res.send(html);
    }
  });
};
let renderTemplateParams = (_config, req) => {
  let u = req.headers["user-agent"];
  let expire = Math.floor(Date.now() / 1000) + config.timeout;
  let isMobile = u ? !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/Windows Phone/) || !!u.match(/Android/) || !!u.match(/MQQBrowser/) : false;

  if (_config.directives) {
    Object.keys(_config.directives).forEach((_d) => {
      if (_config.directives[_d] === undefined) {
        delete _config.directives[_d];
        return;
      }
      if (!directive_hash[_d + " " + req.ZBase.language]) {
        directive_hash[_d + " " + req.ZBase.language] = ejs.render(directive_depends[_d], {
          page_config: {
            language: req.ZBase.language,
            translater: Translater
          }
        });
      }
      _config.directives[_d] = directive_hash[_d + " " + req.ZBase.language];
    });
  }

  let _params = {
    layout: _config.layout,
    page_config: _.extend({
      referer: url.parse(req.headers["referer"] || "") || "",
      component_path: `${app_dir}/public/components/`,
      currentTime: Math.round(Date.now() / 1000),
      isMobile: isMobile,
      language: req.ZBase.language,
      cookies: req.ZBase.cookies,
      urlParams: req.query || {},
      pageData: {},
      pageParams: req.params,
      expire: expire,
      currentUser: req.ZBase.user,
      currentMode: config.mode,
      timeStamp: config.timeStamp,
      //webSiteDomains: req.headers["x-forwarded-proto"] === "https" ? config.httpsDomains : config.webSiteDomains,
      webSiteDomains: config.webSiteDomains,
      translater: Translater,
      topDomain: config.topDomain,
      appConfig: config,
      sign: `${config.appid}-${config.ak}-` + md5(`${config.appid}${expire}${config.ak}${config.sk}`)
    }, _config)
  };
  return _params;
};

let getDirectiveDepends = (_path) => {
  current_require_path = _path;
  if (!component_depends[_path]) {
    try {
      let stat = fs.statSync(_path + ".js");
      if (!stat.isFile()) return;
    } catch (ex) {
      return console.info(ex.toString());
    }
    require(_path);
  } else {
    component_depends[_path].forEach((_d) => {
      page_depend_directive_hash[_d.replace(/_/g, "-")] = 0;
    });
    page_depend_directives = page_depend_directives.concat(component_depends[_path]);
  }
  page_depend_directives.forEach((_d) => {
    _d = _d.replace(/_/g, "-");
    if (page_depend_directive_hash[_d] !== 0) return;
    page_depend_directive_hash[_d] = directive_depends[_d];
    getDirectiveDepends(`${global.static_path}/components/${_d}/component`);
  });
};

let getPageConfig = (cfg) => {
  let _page_config = JSON.parse(fs.readFileSync(`${global.static_path}/pages/${cfg.page}/config.json`).toString());
  let _route_config = require(`${global.static_path}/pages/${cfg.page}/route`);
  let needParse = true,
    fn = [];

  if (cfg.fn) fn = fn.concat(cfg.fn);
  if (_route_config.fn) fn = fn.concat(_route_config.fn);

  page_depend_directives = [];
  page_depend_directive_hash = {};

  try {
    let stat = fs.statSync(`${global.static_path}/pages/${cfg.page}/controller/controller.js`);
    if (!stat.isFile()) needParse = false;
  } catch (ex) {
    needParse = false;
  }
  if (needParse)
    getDirectiveDepends(`${global.static_path}/pages/${cfg.page}/controller/controller`);

  if (_route_config.spTemplateRoutes && _route_config.spTemplateRoutes.length > 0) {
    _route_config.spTemplateRoutes.forEach((_r) => {
      let sp_route_dir_path = `${global.static_path}/pages/${cfg.page}/routes`;
      let dirs = fs.readdirSync(sp_route_dir_path);

      dirs.forEach((_dir_name) => {
        let sp_route_path = `${sp_route_dir_path}/${_dir_name}`;
        let stat = fs.statSync(sp_route_path);

        if (stat.isDirectory()) {
          let files = fs.readdirSync(`${sp_route_path}`);

          files.forEach((_file_name) => {
            let file_path = `${sp_route_path}/${_file_name}`;
            let f_stat = fs.statSync(file_path);

            if (f_stat.isFile() && path.extname(file_path) === ".js") {
              getDirectiveDepends(`${sp_route_path}/${path.basename(_file_name, ".js")}`);
            }
          });
        }
      });


    });
  }

  cfg = util.extend({}, {
    module: "",
    pageModule: _page_config.module,
    directives: page_depend_directives.length > 0 ? page_depend_directive_hash : null,
    method: "get",
    url: "",
    needLogin: false,
    layout: false,
    template: `${global.static_path}/pages/${cfg.page}/page`,
    title: "",
    css: _page_config.css || _page_config.pageModule || _page_config.module,
    js: undefined,
    bodyClass: _page_config.module,
    pageData: {}
  }, cfg, _page_config, _route_config, {
    fn: fn
  });

  if (_page_config.depends && _page_config.depends.js && _page_config.depends.js.indexOf("angular") > -1) {
    cfg.commonJS = "commonA";
  } else {
    cfg.commonJS = "common";
  }

  if (cfg.layout) {
    cfg.layout = app_dir + "/views/layouts/" + cfg.layout;
  }

  if (module_md5_config) {
    cfg.md5_js = module_md5_config.js[cfg.page];
    cfg.md5_css = module_md5_config.css[cfg.page];
    cfg.commonJS = module_md5_config.js[cfg.commonJS];
  }
  cfg.bodyClass = cfg.bodyClass + " z-clearfix";
  if (_route_config.spTemplateRoutes) {
    single_page_templates.push({
      cfg: cfg,
      spTemplateRoutes: _route_config.spTemplateRoutes
    });
  }
  return cfg;
};

let renderRoute = (_cfg, _router) => {
  _cfg = _cfg.type === "template" ? _cfg : getPageConfig(_cfg);

  if (!_cfg) return;

  if (!_cfg.url) {
    throw `路由缺少url配置，文件：${_cfg}`;
  }
  if (urls[_cfg.url]) {
    throw `重复的路由配置: ${_cfg.url}`;
  }
  if (_cfg.method !== "get" && _cfg.method !== "post") {
    throw `路由配置项method错误: ${_cfg.url} ${_cfg.method}`;
  }
  urls[_cfg.url] = 1;
  _cfg.fn = Array.isArray(_cfg.fn) ? _cfg.fn : [_cfg.fn];

  _cfg.fn.unshift(_cfg.url, (req, res, next) => {
    res.template = renderTemplateParams(_cfg, req);
    next();
  });

  _cfg.fn.push((req, res) => {
    renderPage(req, res, _cfg.template, res.template);
  });

  _router[_cfg.method].apply(_router, _cfg.fn);
};

let createRouteFlow = () => {
  collectComponents();

  let _define = global.define;

  if (config.mode !== "develop") {
    try {
      module_md5_config = JSON.parse(fs.readFileSync(app_dir + "/module_md5.json").toString());
    } catch (ex) {
      console.info(ex);
      //ex
    }
  }

  global.define = (_depends) => {
    component_depends[current_require_path] = _depends.filter((_d) => {
      if (_d.startsWith("d_") && page_depend_directives.indexOf(_d) === -1) {
        _d = _d.replace(/_/g, "-");
        page_depend_directive_hash[_d] = page_depend_directive_hash[_d] || 0;
        return true;
      }
      return false;
    });
    page_depend_directives = page_depend_directives.concat(component_depends[current_require_path]);
  };

  if (config.mode === "production") {
    router.use("/500", (req, res) => {
      res.status(500);
      renderPage(req, res, `${global.static_path}/components/s-500-page/component`, {
        layout: "layouts/_layout_zc1",
        page_config: {
          translater: Translater,
          component_path: `${app_dir}/public/components/`,
        }
      });
    });
  }

  router.use((req, res, next) => {
    console.log('Time:%s url:%s method:%s', Date.now(), req.url, req.method);

    req.ZBase = req.ZBase || {};
    let language = req.headers["accept-language"];
    let has_language_cookie;
    let cookies = req.cookies || {};

    language = language && language.substr(0, 2).toLowerCase();

    if (cookies["language"]) {
      has_language_cookie = (cookies["language"] + "").toLowerCase();
      language = has_language_cookie;
    }
    let arg = querystring.parse(url.parse(req.url).query);

    // if ((arg.lang + "").toLowerCase() === "ja") {
    //   arg.lang = "jp";
    // }

    if (arg.lang) {
      if ((arg.lang + "").toLowerCase() === "ja") {
        arg.lang = "jp";
      }
      language = (arg.lang + "").toLowerCase();
    }

    language = config.languages.indexOf(language) === -1 ? config.languages[0] : language;


    req.ZBase.language = language;
    req.ZBase.cookies = cookies;
    let domain = config.topDomain === "localhost" ? config.topDomain : "." + config.topDomain;
    if (config.topDomain === "localhost") {
      res.cookie('language', language, {
        path: '/'
      });
    } else {
      res.cookie('language', language, {
        path: '/',
        domain: domain
      });
    }
    if (language !== has_language_cookie) {
      if (config.topDomain === "localhost") {
        res.setHeader("Set-Cookie", `language=${language}; Path=/`);
      } else {
        res.setHeader("Set-Cookie", `language=${language}; Domain=${domain}; Path=/`);
      }
    }

    next();
  }, (req, res, next) => {

    let renderPage = (_user) => {
      req.ZBase.user = _user;
      // req.setHeader("Set-Cookie", _res.get("Set-Cookie"));
      next();
    };
    if (req.url.indexOf("/directives") === 0 || req.url.indexOf("/public") === 0) {
      return renderPage();
    } else {
      let _connect = 0;
      if (req.commonpath === "/" || req.commonpath === "/accountsetting") {
        _connect = 1;
      }
      User.getCurrentUser({
        connect: _connect
      }, req).then(renderPage);
    }
  });

  router_modules.forEach((_module) => {
    if (!_module.m.urls || _module.m.urls.length === 0) return;

    _module.router = express.Router();
    if (_module.m.before) {
      _module.m.before(_module.router);
    }
    _module.m.urls.forEach((cfg) => {
      renderRoute(cfg, _module.router);
    });
    if (_module.after) {
      _module.after(_module.router);
    }
    router.use(_module.router);
  });

  let single_page_template_router = express.Router();
  single_page_templates.forEach((_item) => {
    _item.spTemplateRoutes.forEach((cfg) => {
      cfg.method = "get";
      cfg.type = "template";
      cfg.fn = [];
      cfg.template = `${global.static_path}/pages/${_item.cfg.page}/${cfg.template}`;
      renderRoute(cfg, single_page_template_router);
    });
  });

  router.use(single_page_template_router);

  if (config.mode === "production") {

    router.use("/404", (req, res) => {
      res.status(404);
      renderPage(req, res, `${global.static_path}/components/s-500-page/component`, {
        layout: "layouts/_layout_zc1",
        page_config: {
          translater: Translater,
          component_path: `${app_dir}/public/components/`,
        }
      });
    });
    router.use((req, res) => {
      console.log("404: " + req.url);
      res.redirect("/404");
    });

    router.use((err, req, res) => {
      console.error("error: ", err);
      if (req.url === "/500") {
        res.send({
          err: err
        });
      } else
        res.redirect("/500");
    });
  }

  global.define = _define;
};

createRouteFlow();

module.exports = router;