let callServer = require("../lib/callserver").callServer;

let _this = {};

_this.getCurrentUser = (_param, req) => {
  return callServer("user_currentUser", {
    method: "info",
    connect: _param.connect
  }, req);
};



_this.addVisitorRecord = (_param, req) => {
  return callServer("user_host_visitors_record", {
    method: "view",
    uk: _param.uk
  }, req);
};


module.exports = _this;
