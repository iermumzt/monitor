//let videoTpl = require(process.cwd() + "/lib/video_loading_tpl");
module.exports = {
  bodyClass: "multiview",
  layout: "_layout10",
  fn(req, res, next) {
    next();
  }
};