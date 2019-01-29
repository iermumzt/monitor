//let videoTpl = require(process.cwd() + "/lib/video_loading_tpl");
let video = require(process.cwd() + "/models/video");
var url = require('url');
module.exports = {
  bodyClass: "monitor",
  layout: "_layout10",
  fn(req, res, next) {
    var params = url.parse(req.url).pathname.split('/');
    deviceid = params[params.length - 1];
    console.info(deviceid);
    if (deviceid !== "monitor" && deviceid) {
      Promise.all([
        video.getBaseInfoByDeviceId({
          deviceid: deviceid
        }, req)
      ]).then((_data) => {
        res.template.page_config.title = _data[0].description;
        res.template.page_config.pageData = {
          meta: _data[0]
        };
        // console.info("000000000",res.template.page_config.pageData.meta,"zzzzzz",res.template.page_config.pageData.meta.deviceid);
        next();
      });
    } else {
      res.template.page_config.pageData = {
        meta:""
      };
      next();
    }
    // res.url

  }
};