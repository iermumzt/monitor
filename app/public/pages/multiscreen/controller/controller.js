define(["app", "ui_videoplayer", "ui_multiscreen", "oauth", "s_profile"],
  function(Controllers, VideoPlayer, MultiScreen, OAuth) {
    Controllers.controller("MultiScreenController", ["$scope", "$window", "$element",
      "ProfileService",
      function($scope, $window, $element, ProfileService) {

        var videosnum = Number(IX.getUrlParam("t")) || 4;
        var rows, cols;
        var user = OAuth.getUser();
        var hasLogin = user;

        var myIermuList = [];
        var bindVideoList, init; //方法名
        var j;
        if (hasLogin) {
          // uid = user.uid;
        } else {
          OAuth.init();
          return;
        }

        if (videosnum === 12) {
          rows = 3;
          cols = 4;
        } else if (Math.sqrt(videosnum).toString().indexOf('.') < 0) {
          rows = cols = Math.sqrt(videosnum);
        } else if (videosnum === 2) {
          rows = 1;
          cols = 2;
        } else {
          rows = cols = Math.floor(Math.sqrt(videosnum));
        }

        bindVideoList = function() {
          var myList = [];
          var grantedList = [];
          var subList = [];
            
          ProfileService.getMyCameras({
            device_type: 1,
            data_type: "all",
            list_type: "all"
          }).then(function(_data) {
            if (!_data || _data.error_code || typeof(_data.count) === "undefined") {
              _data = {
                count: 0,
                list: []
              };
            }
            if (_data.count !== 0) {
              for (j = 0; j < _data.list.length; j++) {
                if (_data.list[j].data_type === 0) {
                  if (_data.list[j].grantnum > 0) {
                    _data.list[j].accreditStatus = 19;
                    _data.list[j].isGrant = false;
                  } else {
                    _data.list[j].accreditStatus = 20;
                    _data.list[j].isGrant = false;
                  }
                  // if(_data.list[j].connect_type === "2") {continue; }//羚羊设备
                  myList.push(_data.list[j]);
                } else if (_data.list[j].data_type === 1) {
                  _data.list[j].accreditStatus = 18;
                  _data.list[j].ismu = false;
                  _data.list[j].isGrant = true;
                  // if(_data.list[j].connect_type === "2") {continue; }//羚羊设备
                  grantedList.push(_data.list[j]);
                } else {
                  _data.list[j].accreditStatus = 20;
                  _data.list[j].ismu = false;
                  subList.push(_data.list[j]);
                }
              }
            }
            grantedList = _.sortBy(grantedList, function(data) {
              return -data.description;
            });
            myIermuList = _.sortBy(myList, function(data) {
              return -data.description;
            });
            myIermuList = myIermuList.concat(grantedList);
            new MultiScreen({
              container: $element,
              items: myIermuList,
              rows: rows,
              cols: cols,
              isPrivate: true
            });
          });
        };

        init = function() {
          bindVideoList();
        };
        init();
      }
    ]);
  });
