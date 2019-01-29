let callServer = require("../lib/callserver").callServer;

let _this = {};

_this.get = () => {
  return callServer("video_videos", {});
};

_this.getPublicCategories = function(_param, req){
  return callServer("video_public_categories", {
    method: "listcategory",
    type: "pub",
    lang: _param.lang || "zh-cn"
  }, req);
};

_this.getBaseInfoByShareId = (_param, req) => {
  return callServer("camera_camerainfo", {
    method: "meta",
    shareid: _param.shareid,
    uk: _param.uk
  }, req);
};
_this.getBaseInfoByDeviceId = (_param, req) => {
  return callServer("camera_camerainfo", {
    method: "meta",
    deviceid: _param.deviceid
  }, req);
};
_this.getGrantDevices = (_param, req) => {
  return callServer("my_cameras", {
    method: 'list',
    data_type: "grant",
    list_type: "all",
  }, req);
};

_this.getLivePlayDetailByShareId = (_param, req) => {
  return callServer("video_getLivePlayUrl", {
    method: "liveplay",
    shareid: _param.shareid,
    uk: _param.uk,
    type: _param.type || "rtmp"
  }, req).then((data) => {
    if (data && data.div) {
      delete data.div;
    }
    return data;
  });
};
_this.getAlarmInfoDeviceId = (_param, req) => {
  return callServer("camera_deviceid_alarm", {
    method: "alarm",
    deviceid: _param.deviceid,
    type: _param.type,
    time: _param.time,
    sensorid: "" || _param.sensorid,
    sensortype: "" || _param.sensortype,
    actionid: "" || _param.actionid,
    actiontype: "" || _param.actiontype
  }, req).then((data) => {
    if (data && data.div) {
      delete data.div;
    }
    return data;
  });
};

_this.getLivePlayDetailByDeviceId = (_param, req) => {
  return callServer("video_getLivePlayUrl", {
    method: "liveplay",
    deviceid: _param.deviceid,
    type: _param.type || "rtmp"
  }, req).then((data) => {
    if (data && data.div) {
      delete data.div;
    }
    return data;
  });
};

_this.getPlayCamera = (_param, req) => {
  return callServer("camera_camerainfo_meta", {
    method: "meta",
    shareid: _param.shareid,
    uk: _param.uk
  }, req).then((data) => {
    if (data && data.div) {
      delete data.div;
    }
    return data;
  });
};

module.exports = _this;
