define(["app"], function(Services) {
  var languages = {
    "zh-cn": {
      "lp1": "离线",
      "lp2": "关机",
      "lp3": "在线",
      "lp4": "过期",
      "lp5": "天",
      "lp6": "私密分享",
      "lp7": "公开分享",
      "lp8": "授权分享",
      "lp9": "被授权",
      "lp10": "未分享"
    },
    "en": {
      "lp1": "offline",
      "lp2": "Off",
      "lp3": "online",
      "lp4": "Overdue",
      "lp5": "days",
      "lp6": "Private sharing",
      "lp7": "Public shared",
      "lp8": "Grant me",
      "lp9": "Authorized",
      "lp10": "Not shared"
    }
  };
  var VideosFilter = function() {
    var filterFn = function(_data, _language) {
      var i, cd;
      var onlineCount = 0,
        offlineConut = 0;
      for (i = 0; i < _data.length; i++) {
        _data[i].checkboxIsDisable = false;
        if (Number(_data[i].status) === 0) {
          offlineConut++;
          _data[i].devStatus = "offline";
          _data[i].devStatusC = languages[_language].lp1;
          _data[i].checkboxIsDisable = true;
        } else if ((_data[i].status & 0x4) === 0) {
          _data[i].devStatus = "shutdown";
          _data[i].devStatusC = languages[_language].lp2;
        } else {
          onlineCount++;
          _data[i].devStatus = "online";
          _data[i].devStatusC = languages[_language].lp3;
        }
        //_data[i].devStatus = "none";
      }

      for (i = 0; i < _data.length; i++) {
        if (Number(_data[i].cvr_day) === 0) {
          _data[i].cloudStatus = "out";
          _data[i].cloudValidDays = languages[_language].lp4;
        } else {
          _data[i].cloudStatus = "valid";
          if (_data[i].cvr_day >= 90) {
            cd = 90;
          } else if (_data[i].cvr_day >= 30) {
            cd = 30;
          } else {
            cd = _data[i].cvr_day;
          }
          _data[i].cloudValidDays = cd + languages[_language].lp5;
        }
      }
      for (i = 0; i < _data.length; i++) {
        if (Number(_data[i].accreditStatus) === 18) {
          _data[i].shareStatus = "accredit";
          _data[i].shareStatusC = languages[_language].lp9;
          _data[i].ismu = false;
        } else if (Number(_data[i].share) === 2 && Number(_data[i].accreditStatus) !== 19) {
          _data[i].shareStatus = "secret";
          _data[i].shareStatusC = languages[_language].lp6;
          _data[i].ismu = false; //是否显示多种状态
        } else if (Number(_data[i].share) === 4 && Number(_data[i].accreditStatus) !== 19) {
          _data[i].shareStatus = "secret";
          _data[i].shareStatusC = languages[_language].lp6;
          _data[i].ismu = false;
        } else if (Number(_data[i].share) === 1 && Number(_data[i].accreditStatus) !== 19) {
          _data[i].shareStatus = "public";
          _data[i].shareStatusC = languages[_language].lp7;
          _data[i].ismu = false;
        } else if (Number(_data[i].share) === 2 && Number(_data[i].accreditStatus) === 19) {
          _data[i].shareStatus = "secret";
          _data[i].shareStatusC = languages[_language].lp6;
          _data[i].shareStatus2 = "accredited";
          _data[i].shareStatusC2 = languages[_language].lp8;
          _data[i].ismu = true;
        } else if (Number(_data[i].share) === 1 && Number(_data[i].accreditStatus) === 19) {
          _data[i].shareStatus = "public";
          _data[i].shareStatusC = languages[_language].lp7;
          _data[i].shareStatus2 = "accredited";
          _data[i].shareStatusC2 = languages[_language].lp8;
          _data[i].ismu = true;
        } else if (Number(_data[i].accreditStatus) === 18 && Number(_data[i].share) === 0) {
          _data[i].shareStatus = "accredit";
          _data[i].shareStatusC = languages[_language].lp9;
          _data[i].ismu = false;
        } else if (Number(_data[i].accreditStatus) === 19 && Number(_data[i].share) === 0) {
          _data[i].shareStatus = "accredited";
          _data[i].shareStatusC = languages[_language].lp8;
          _data[i].ismu = false;
        } else {
          _data[i].shareStatus = "none";
          _data[i].shareStatusC = languages[_language].lp10;
        }
      }
      _data.onlineCount = onlineCount;
      _data.offlineConut = offlineConut;
      return _data;
    };

    var _model = {
      filterData: function(_data, _language) {
        return filterFn(_data, _language);
      }
    };
    return _model;
  };
  Services.service("VideosFilter", function() {
    return new VideosFilter();
  });
});
