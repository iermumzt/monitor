let video = require(process.cwd() + "/models/video");
module.exports = {
  bodyClass: "prologin",
  layout: "_layout10",
  fn(req, res, next) {
    next();
  }
};
