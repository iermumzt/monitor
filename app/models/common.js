let callServer = require("../lib/callserver").callServer;
let _this = {};

_this.getActivityData = (req) => {
  return callServer("common_get_activity_data", {
    method: "getnewposter",
    debug: global.app_config.mode === "production" ? 0 : 1
  }, req);

};
_this.getAppMsgDetail = (_params, req) => {
  return callServer("common_get_app_msg_detail", Object.assign({
    method: "article"
  }, _params), req);
};

module.exports = _this;
