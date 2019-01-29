define(["js/callserver/cservice", "ui_dialog", "ui_datetimepicker", "ui_datetimepicker_zhcn", "e_hammer"], function(CallServer, Dialog) {

  var languages = {
    "zh-cn": {
      "lp1": "无录像记录",
      "lp2": "录像正在加载中",
      "lp3": "无缩略图",
      "lp33": "年",
      "lp34": "月",
      "lp35": "日",
      "lp36": "星期一",
      "lp37": "星期二",
      "lp38": "星期三",
      "lp39": "星期四",
      "lp40": "星期五",
      "lp41": "星期六",
      "lp42": "星期日",
      "lp53": "保存成功!",
      "lp54": "分",
      "lp55": "秒",
      "lp14": "剪辑",
      "lp15": "看录像",
      "lp16": "您所选时刻没有录像",
      "lp17": "调整时间刻度",
      "lp18": "剪辑时长：",
      "lp19": "保存",
      "lp20": "下载",
      "lp21": "取消",
      "lp22": "全天",
      "lp23": "录像播放完毕！",
      "lp28": "确定",

      "lp70": "更多",
      "lp72": "点",
      "lp9": "看直播",
      "lp68": "剪辑视频时长：",
      "lp56": "保存到云盘",
      "lp57": "请输入想保存的文件名：",
      "lp58": "没有剪辑录像权限",
      "lp59": "剪辑失败,请重试",
      "lp60": "已经有其他剪辑任务正在进行中",
      "lp61": "剪辑任务不存在",
      "lp62": "获取剪辑任务信息失败",
      "lp63": "本地下载",
      "lp101": "选择日期",
      "lp65": "视频片段",
      "lp66": "事件云录像暂不支持剪辑操作！",
      "lp67": "事件云录像部分暂不支持剪辑操作！",
      "lp113": "保存录像",
      "lp114": "选择刻度"
    },
    "en": {
      "lp1": "history video not exists",
      "lp2": "loading history video",
      "lp3": "no thumbnail",
      "lp33": "/",
      "lp34": "/",
      "lp35": "",
      "lp36": "MON",
      "lp37": "TUE",
      "lp38": "WED",
      "lp39": "THU",
      "lp40": "FRI",
      "lp41": "SAT",
      "lp42": "SUN",
      "lp53": "Save success",
      "lp54": "min",
      "lp55": "s",
      "lp14": "Clip",
      "lp15": "Video",
      "lp16": "No videos in selected time.",
      "lp17": "Adjust",
      "lp18": "Time:",
      "lp19": "Save",
      "lp20": "Download",
      "lp21": "Cancel",
      "lp22": "All day",
      "lp23": "Video playback finished!",
      "lp28": "OK",
      "lp70": "More",
      "lp68": "Video clip time:",
      "lp57": "Please enter the file name you want to save",
      "lp72": "",
      "lp9": "Live",
      "lp56": "Save to the cloud disk.",
      "lp58": "You don't have the rights to edit video.",
      "lp59": "Clip failed, please try again.",
      "lp60": "There are editing tasks being carried out.",
      "lp61": "Editing tasks do not exist.",
      "lp62": "Get the clip task information failure",
      "lp63": "Local download",
      "lp65": "Video clip",
      "lp66": "事件云录像暂不支持剪辑操作！",
      "lp67": "事件云录像部分暂不支持剪辑操作！",
      "lp101": "Select period",
      "lp113": "Save video",
      "lp114": "Select scale"
    },
    "jp": {
      "lp1": "ビデオがありません",
      "lp2": "読み込み中…",
      "lp3": "サムネイルありません",
      "lp33": "年",
      "lp34": "月",
      "lp35": "日",
      "lp36": "月曜日",
      "lp37": "火曜日",
      "lp38": "水曜日",
      "lp39": "木曜日",
      "lp40": "金曜日",
      "lp41": "土曜日",
      "lp42": "日曜日",
      "lp53": "保存しました!",
      "lp54": "分",
      "lp55": "秒",
      "lp14": "ビデオ",
      "lp15": "再生",
      "lp16": "ビデオが選択されていません",
      "lp17": "調整時間目盛",
      "lp18": "編集時長：",
      "lp19": "保存",
      "lp20": "ダウンロード",
      "lp21": "キャンセル",
      "lp22": "24時間",
      "lp23": "録画放送が終わり！",
      "lp28": "OK",
      "lp114": "スケールを選択",
      "lp70": "もっと",
      "lp72": "",
      "lp9": "ライブ映像を見る",
      "lp101": "日付を選択",
    }
  };
  var tpl = [
    "<div class = 'video-play-menus'>",
    "<div class = 'opacity-bg'></div>",
    '<div class = "time-list-wrap">',
    "<div class = 'play-type-menus'>",
    "<button class = 'play-video'><span>{lp15}</span></button>",
    "<button class = 'play-zhibo enable'><span>{lp9}</span></button>",
    "</div>",
    "<a class = 'mtime-list-menu-wrap'>",
    "<span class = 'tt'>{lp17}</span>",
    "<span class='caret'></span>",
    "</a>",

    "<div class = 'date-list-menu-wrap'>",
    '<button class="btn btn-default dropdown-toggle btn-pro-date-list" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">',
    "<span class = 'tt'>{lp101}</span>",
    "<span class='caret'></span>",
    '</button>',
    "</div>",

    "<div class = 'time-list-menu-wrap'>",
    '<button class="btn btn-default dropdown-toggle btn-time-list" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">',
    "<span class = 'tt'>{lp17}</span>",
    "<span class='caret'></span>",
    '</button>',

    '<button class="btn btn-default dropdown-toggle btn-pro-time-list" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">',
    "<span class = 'tt'>{lp114}</span>",
    "<span class='caret'></span>",
    '</button>',
    "</div>",



    "</div>",
    "<div class = 'video-loading'><p>(@﹏@)~  {lp1}</p><p>{lp2}</p></div>",
    '<div class="timeline">',
    "<a class = 'prev d'><i class='pic-mon-l'></i><span class='glyphicon glyphicon-menu-left hide h' aria-hidden='true'></span></a>",
    "<a class = 'next d'><i class='pic-mon-r'></i><span class='glyphicon glyphicon-menu-right hide h r' aria-hidden='true'></span></a>",
    '<a class = "time-thumbnail">',
    "<img class = 't' />",
    "<span class = 'arrow'></span>",
    "<span class = 'r'></span>",
    '</a>',
    "<div class = 'l-wrap'>",
    "<a class = 'left-d'><div class='radius-l'></div></a>",
    "<a class = 'right-d'><div class='radius-r'></div></a>",
    "<div class = 'scroll-wrap'>",
    '<a class = "m-time-tip">',
    '<span class="fulltime">2016-12-12 21:00</span>',
    '<span class="sp"></span>',
    '</a>',
    "<div class = 'timeline-main'>",
    "<div class = 'tmleft'>",
    "<div class='tmplaylist'></div>",
    '<img src="/public/images/timeline_loop.png">',
    "</div>",
    '<div class = "timeline-wrap">',
    '<a class = "drag-trigger hidden"><i class = "pic-p1"></i></a>',
    '<a class = "time-tip"><span></span></a>',
    '<div class = "jianji-op">',
    '<div class = "trigger"><a class = "a1"></a><div class = "dragger"></div><a class = "a2"></a></div>',
    '<div class = "ops">',
    '<p>{lp18}<span></span></p>',
    '<button class = "save-jianji"><span>{lp19}</span></button>',
    '<button class = "download-jianji"><span>{lp20}</span></button>',
    '<button class = "cancel-jianji"><span>{lp21}</span></button>',
    '</div>',
    '</div>',
    '<div class = "playlist"></div>',
    "<div class = 'timelines'></div>",
    '</div>',
    "<div class = 'tmright'>",
    "<div class='tmplaylist'></div>",
    "<img src='/public/images/timeline_full.png' style='width: 320px;'>",
    "</div>",
    "<div class = 'timetags'></div>",
    "</div>",
    "</div>",
    "</div>",
    '</div>',
    '<div class="days">',
    '<div class = "btn-group" role = "group"></div>',
    '</div>',
    "<div class = 'hour-list'>",
    "<ul>",
    "<li _v = '-1'><a>{lp22}</a></li>",
    "</ul>",
    "</div>",
    "</div>"
  ].join("");
  var timeLineTpl = new IX.ITemplate({
    tpl: [
      "<tpl id = 'items'><a style='width:{w}px;left:{l}px;background-color:#{c}' _area='{a}' _t='{t}'></a></tpl>"
    ]
  });

  var timeListTpl = new IX.ITemplate({
    tpl: [
      "<tpl id = 'items'><li _v = '{h}' _d = '{d}' class = '{clz}'><a>{ls}</a></li></tpl>"
    ]
  });
  var timelinesTpl = new IX.ITemplate({
    tpl: [
      "<tpl id = 'items'><img src = '/public/images/timeline_loop.png' ></tpl><img src = '/public/images/timeline_full.png' >"
    ]
  });
  var timelines_whiteTpl = new IX.ITemplate({
    tpl: [
      "<tpl id = 'items'><img src = '/public/images/timeline-loop-white.png' ></tpl><img src = '/public/images/timeline-full-white.png' >"
    ]
  });

  var timelines_proTpl = new IX.ITemplate({
    tpl: [
      "<tpl id = 'items'><img src = '/public/images/gismap/pro_timeline_loop.png' ></tpl><img src = '/public/images/gismap/pro_timeline_full.png' >"
    ]
  });
  var timeTags_day_tpl = new IX.ITemplate({
    tpl: [
      "<tpl id = 'items'><span class='zero'>00:00<a class='pro-zero'>{day1}</a></span><span>06:00</span><span>12:00</span><span>18:00</span></tpl><span class='zero'>00:00<a class='pro-tom'>" + IX.Date.getDateByFormat(new Date(new Date().getTime() + 24 * 3600 * 1000), "MM/dd") + "</a></span>"
    ]
  });
  var timeTags_hour_tpl = new IX.ITemplate({
    tpl: [
      "<tpl id = 'items'><span>{h}:00</span><span>{h}:15</span><span>{h}:30</span><span>{h}:45</span></tpl><span>00:00</span>"
    ]
  });
  var plugin = function(cfg) {
    var $s_play_zhibo, $container, $f_show_history, $basecontainer, $pause, $time_tip;
    var player, dateEnd, dateStart, dateFullStart, dateFullEnd, dateFullStartTime, dateFullEndTime, currentScrollTime;
    var deviceInfo, config, sourcePlayList, historyData, unitWidth_on_date = 1,
      unitWidth_on_hour = 1;
    var currentDateIndex = 0,
      timeTipTrigger, timeLineTrigger, currentHourIndex = 0,
      dplaylisttime, currentPlayCategory = "live_play",
      timelineReady = false;
    var language = "zh-cn",
      timeType = "day",
      menuToFloat = false,
      // bindStartTime = 0,
      itemWidth, $lwrap;
    var $jianjimenu, $jianjiops, $playlist, $hourlist, $date_choosen_wrap, $timelineWrap, $scrollwrap;
    var currentHistoryStartTime, currentHistoryEndTime, playListCount, currentTime, currentDate;
    var timelineValue = 0,
      timelineMainWidth; //isShowDateDialog
    var $timelineMain, $time_thumbnail; //, $cloudmenu
    var hls_play_time = 0,
      hls_pause_time = 0;
    var mvideoTimeStart, mtimeStart, before_time;
    var isContainOps;
    var playHistory, getUnitTimeWidth, getVideoList, getWidthByDTime, getDTimeByWidth, getLeftByTime, getTextByDTime,
      getScrollLeftByTime, scrollTimeline, getVideoPlayTimeArea, isContainVideo, loadTimeThumbnail, addZero,
      renderHourList, renderDays, renderTimeTrigger, moveToTime, moveToMTime, renderTimeline, setTimeType,
      timeLineTriggerFn, bindEvent, parsePlayList, parseLingYangPlayList, initTimeline, getHistoryList, bindJianJiEvent,
      getTpl, resetSize, init, _model, triggerVideo;
    var isFullScreen, isVideo;
    // var eventsVideoList;

    playHistory = function(_start, _end, _tag) {
      var currentPlayUrl = document.location.origin + '/api/v2/pcs/device?method=vod&deviceid=' + (!config.isPrivate ? ('&shareid=' + deviceInfo.shareid + "&password=" + deviceInfo.password + "&uk=" + deviceInfo.uk) : (deviceInfo.deviceid)) + '&st=' + _start + '&et=' + _end + (_tag === 3 ? '&type=event' : '');
      player.trigger("play_category_changed", "video_play", currentPlayUrl);
    };

    setTimeType = function(_type) {
      if (_type === timeType) return;
      timeType = _type;
      if (timeType === "day") {
        $container.removeClass("on-list-by-time");
      } else {
        $container.addClass("on-list-by-time");
      }
      renderTimeline();
    };

    getVideoPlayTimeArea = function(_start, _timeArea) {
      currentHistoryStartTime = _start / 1000;
      if ((_timeArea[1] / 1000 - currentHistoryStartTime) <= 900) {
        currentHistoryEndTime = _timeArea[1] / 1000;
      } else {
        currentHistoryEndTime = currentHistoryStartTime + 600;
      }
    };

    moveToTime = function(_time, _moveX) {
      var left_time_by_day, left_time_by_hour;
      var activeTime, activeHourTime;
      if (_time === currentScrollTime) return;
      currentScrollTime = currentScrollTime || 0;
      left_time_by_day = new Date(IX.Date.getDateByFormat(_time, "yyyy/MM/dd 00:00:00")).getTime();
      left_time_by_hour = new Date(IX.Date.getDateByFormat(_time, "yyyy/MM/dd HH:00:00")).getTime();

      if (!currentScrollTime) {
        renderDays();
        renderHourList();
      }

      if (timeType === "day") {
        if (!currentScrollTime) {
          scrollTimeline(left_time_by_day, _moveX);
        } else if (_time < currentScrollTime || _time >= currentScrollTime + 6 * 60 * 60 * 1000) {
          if (Math.abs(_time - currentScrollTime) <= 6 * 60 * 60 * 1000) {
            if (_time < currentScrollTime) {
              scrollTimeline(currentScrollTime - 6 * 60 * 60 * 1000, _moveX);
            } else {
              scrollTimeline(currentScrollTime + 6 * 60 * 60 * 1000, _moveX);
            }
          } else
            scrollTimeline(left_time_by_day, _moveX);
        }
      } else {
        if (_time < currentScrollTime || _time >= currentScrollTime + 15 * 60 * 1000) {
          if (Math.abs(_time - currentScrollTime) <= 15 * 60 * 1000) {
            if (_time < currentScrollTime) {
              scrollTimeline(currentScrollTime - 15 * 60 * 1000, _moveX);
            } else {
              scrollTimeline(currentScrollTime + 15 * 60 * 1000, _moveX);
            }
          } else
            scrollTimeline(left_time_by_hour, _moveX);
        }
      }
      activeTime = historyData.day.items[currentDateIndex].date;
      if (timeType === "day") {
        if (Math.abs(activeTime - currentScrollTime) >= 24 * 60 * 60 * 1000) {
          currentDateIndex = historyData.day.videoHash[left_time_by_day].itemIndex;
          currentHourIndex = new Date(_time).getHours();
          renderDays(currentDateIndex);
          renderHourList();
        }
      } else {
        activeHourTime = historyData.day.videoHash[activeTime].hours[currentHourIndex].d;
        if (Math.abs(activeTime - currentScrollTime) >= 60 * 60 * 1000) {
          currentDateIndex = historyData.day.videoHash[left_time_by_day].itemIndex;
          currentHourIndex = new Date(_time).getHours();
          renderDays(currentDateIndex);
          renderHourList();
        } else if (Math.abs(activeHourTime - currentScrollTime) <= 60 * 60 * 1000) {
          currentHourIndex = new Date(_time).getHours();
          renderHourList();
        }
      }
    };

    timeLineTriggerFn = function() {
      var timeUnitWidth = getUnitTimeWidth() * 1000;
      var c = 0;
      if (timeLineTrigger) {
        clearInterval(timeLineTrigger);
      }

      timeLineTrigger = setInterval(function() {

        timelineValue = Number($container.find(".timeline-main").css("margin-left").replace('px', '')) || 0;
        c -= timeUnitWidth;
        if (c <= -0.2) {
          moveToMTime(c, true);
          c = 0;
        } else {
          moveToMTime(c, true, true);
        }

      }, 1000);
    };

    moveToMTime = function(_moveX, istrigger, noMoveTline) {
      var moveX, left;
      var currentTmp, c_hour, left_time_by_day;
      if (!IX.browser.versions.mobile) {
        return;
      }
      if (!mtimeStart) {
        renderDays();
        renderHourList();
      }
      if (!istrigger) {
        player.pause();
        if (timeLineTrigger) {
          clearInterval(timeLineTrigger);
        }
      }
      if (_moveX) {
        moveX = timelineValue + _moveX;
      } else {
        if (timeType === "day") {
          moveX = -currentDateIndex * (itemWidth - 1);
        } else {
          moveX = -currentDateIndex * 24 * (itemWidth - 1) - currentHourIndex * (itemWidth - 1);
        }
      }

      if (moveX < (-timelineMainWidth + itemWidth) - itemWidth / 2) {
        moveX = -timelineMainWidth + itemWidth - itemWidth / 2;
      }
      if (moveX > (itemWidth) / 2) moveX = (itemWidth) / 2;
      if (moveX > 0) left = -Math.abs(moveX) + itemWidth / 2;
      else left = Math.abs(moveX) + (itemWidth) / 2;

      left += Math.floor(left / itemWidth);
      mtimeStart = Math.floor(dateFullStartTime + left / getUnitTimeWidth());
      if (!_moveX && !istrigger) isContainVideo();

      if (before_time) {
        moveX += -(before_time - mtimeStart) * getUnitTimeWidth();
        mtimeStart = before_time;
        before_time = 0;
      } else {
        if (timeType === "day") {
          currentTmp = Math.floor(Math.abs((left - 1) / (itemWidth)));
          if (currentTmp > historyData.day.items.length - 1) {
            currentTmp = historyData.day.items.length - 1;
          }
          if (currentTmp !== currentDateIndex) {
            currentDateIndex = currentTmp;
          }
          renderDays(currentDateIndex);
        } else {
          left_time_by_day = new Date(IX.Date.getDateByFormat(mtimeStart, "yyyy/MM/dd 00:00:00")).getTime();
          c_hour = new Date(mtimeStart).getHours();
          // c_day = new Date(mtimeStart).getDate();
          currentDateIndex = historyData.day.videoHash[left_time_by_day].itemIndex;
          if (c_hour !== currentHourIndex) {
            currentHourIndex = c_hour;
          }
          renderDays(currentDateIndex);
          if (timeType !== "time") {
            renderHourList();
          }
        }
      }




      renderTimeTrigger(new Date(mtimeStart));
      if (!noMoveTline) scrollTimeline("", moveX);
    };
    triggerVideo = function($target, e) {
      var t, left, videoTimeStart, timeStart, tag, tmp;
      t = $target.attr("_t").split(",");
      tmp = $target.attr("_area").split(",");
      tag = Number(tmp[2]);

      hls_pause_time = 0;
      hls_play_time = 0;
      left = e.clientX - $playlist.offset().left;
      left += Math.floor(left / itemWidth);
      timeStart = Math.floor(dateFullStartTime + left / getUnitTimeWidth());
      videoTimeStart = Math.floor(timeStart + dplaylisttime * 1000);

      getVideoPlayTimeArea(Math.floor(timeStart / 1000) * 1000, t);
      renderTimeTrigger(new Date(currentHistoryStartTime * 1000));
      playHistory(Math.floor(videoTimeStart / 1000), currentHistoryEndTime + dplaylisttime, tag);
    };
    bindEvent = function() {
      var currentTimeThumbnailTarget, be;
      var leavePlaylist = true,
        leaveThumbnail = true;
      var flag = false;
      var choose_hour;
      $time_tip = $container.find(".time-tip");
      var renderBaseContainerClass = function(_action) {
        $basecontainer[_action]("show-history-list");
        $container.find(".play-type-menus button").removeClass("enable");
        $container.find(".play-type-menus button." + (_action === "removeClass" ? "play-zhibo" : "play-video")).addClass("enable");
      };



      be = !IX.browser.versions.mobile ? "click" : "touchend";
      player.on(_model.name, "play-state-changed", function(_state, _prev_state) {
        var hasPlayTime, find, i, ci;
        if (!historyData || currentPlayCategory === "live_play") {
          return;
        }
        if (_state === "playing") {
          hasPlayTime = 0;
          if (_prev_state === "pause") {
            hasPlayTime = hls_play_time - hls_pause_time;
          }
          hls_play_time = (new Date().getTime());
          hls_pause_time = hls_pause_time > 0 ? (new Date().getTime() - hls_pause_time) : 0;
          $pause.show().removeClass("play");
          if (!IX.browser.versions.mobile) {
            moveToTime(currentHistoryStartTime * 1000);
            renderTimeTrigger(new Date(currentHistoryStartTime * 1000 + hls_pause_time + hasPlayTime));
          } else {
            timeLineTriggerFn();
          }
        } else if (_state === "pause") {
          hls_pause_time = new Date().valueOf();
          $pause.show().addClass("play");
          if (timeTipTrigger) clearInterval(timeTipTrigger);
          if (timeLineTrigger) clearInterval(timeLineTrigger);
        } else {
          if (timeTipTrigger) clearInterval(timeTipTrigger);
          if (timeLineTrigger) clearInterval(timeLineTrigger);
          $pause.hide();
          if (_state === "stop" && _prev_state === "playing") {
            //var time = currentHistoryStartTime + (new Date().getTime()) - hls_play_time - hls_pause_time;
            find = false;
            for (i = 0; i < historyData.day.videoList.length; i++) {
              ci = historyData.day.videoList[i];
              if (ci.t[1] === currentHistoryEndTime * 1000) {
                ci = historyData.day.videoList[i + 1];
                if (ci) {
                  currentHistoryStartTime = ci.t[0];
                  find = true;
                }
                break;
              } else if (ci.t[0] <= currentHistoryEndTime * 1000 && ci.t[1] > currentHistoryEndTime * 1000) {
                currentHistoryStartTime = currentHistoryEndTime * 1000;
                find = true;
                break;
              }
            }
            if (!find) {
              player.showErrorMsg(languages[config.language]['lp23']);
            } else {
              if (IX.browser.versions.mobile) {
                moveToMTime(-(currentHistoryStartTime - mtimeStart) * getUnitTimeWidth());
              }
              getVideoPlayTimeArea(currentHistoryStartTime, ci.t);
              playHistory(currentHistoryStartTime + dplaylisttime, currentHistoryEndTime + dplaylisttime);
              if (IX.browser.versions.mobile) {
                player.playing();
              }
            }
          }
        }
      });

      player.on(plugin.key, "data-binded", function(_deviceInfo) {
        deviceInfo = _deviceInfo;
        deviceInfo.connect_type = Number(_deviceInfo.connect_type);
        // bindStartTime = new Date().getTime();
        if (deviceInfo.connect_type === 2) {
          dplaylisttime = 0;
        } else {
          dplaylisttime = 0; //8 * 60 * 60;
        }
        if (Number(deviceInfo['cvr_day']) > 0 && (Number(deviceInfo['share']) > 2 || config.isPrivate)) {
          getHistoryList();
        } else {
          $container.addClass("no-video");
        }
        if (document.location.search.indexOf("s=1") > -1 && deviceInfo.connect_type === 1) {
          $jianjiops.addClass("show-download");
        }
      });

      player.on(plugin.key, "resize", function(w, h) {
        var _time;
        resetSize(w, h);
        $time_thumbnail.hide();
        if (historyData) { // && currentPlayCategory !== "live_play"
          parsePlayList(sourcePlayList);
          timelineReady = false;
          _time = currentScrollTime;
          currentScrollTime = 0;
          initTimeline(_time, Number($container.find("a.time-tip").attr("_date")));
        }
      });

      player.on(plugin.key, "play_category_changed", function(_category) {
        if (_category === currentPlayCategory) return;
        $jianjimenu.hide();
        $container.removeClass(currentPlayCategory);
        currentPlayCategory = _category;
        $container.addClass(currentPlayCategory);
        if (currentPlayCategory === "live_play") {
          $pause.removeClass("play").hide();
        } else {
          if (historyData && !menuToFloat)
            $jianjimenu.show();
        }
      });
      player.on(plugin.key, "fullscreen", function(opt) {
        isFullScreen = opt;
        $container.removeClass("on-show-days");
        $container.removeClass("show-hour-list");
        // $container.removeClass("menu-professional");
        if (config.menuFloat === false) return;
        menuToFloat = config.menuFloat === "fixed" ? true : !!opt;
        $container[menuToFloat ? "addClass" : "removeClass"]("menu-float");
        $container[menuToFloat ? "removeClass" : (config.isProfessional ? "addClass" : "removeClass")]("menu-professional");
        if (config.isProfessional && !menuToFloat) {
          if ($time_tip.children("span").length === 0) {
            $time_tip.html("<span></span>");
          }
          if (isVideo) {
            //$pro_video_live.find("a>span").text("看直播");
            $pro_video_live.addClass("pro_video_now");
            $pro_video_live.find("a>i").addClass("playerNow");
            $container.find(".play-type-menus button.play-video").trigger("click");
          } else {
            //$pro_video_live.find("a>span").text("看录像");
            $pro_video_live.removeClass("pro_video_now");
            $pro_video_live.find("a>i").removeClass("playerNow");
            $container.find(".play-type-menus button.play-zhibo").trigger("click");
          }
        }
        if (opt) $jianjimenu.hide();
        if (!opt && currentPlayCategory === "video_play" && !menuToFloat) $jianjimenu.show();
      });
      player.on(plugin.key, "play-video-event", function(_category) {
        if (!IX.browser.versions.mobile && isContainOps) return;
        if (_category === "play-video") {
          $container.show();
          $container.find(".play-type-menus button.play-video").trigger("click");
        } else {
          $container.hide();
        }
      });
      $pause.click(function() {
        if ($pause.is(".play")) {
          $pause.removeClass("play");
          player.resume();
        } else {
          $pause.addClass("play");
          player.pause();
        }
      });
      $container.find(".play-type-menus button.play-zhibo").add($s_play_zhibo).click(function() {
        currentScrollTime = 0;
        timelineReady = false;
        isVideo = false;
        //$pro_video_live.find("a>span").text("看录像");
        $pro_video_live.removeClass("pro_video_now");
        $pro_video_live.find("a>i").removeClass("playerNow");
        $container.removeClass("on-show-days");
        $container.removeClass("show-hour-list");
        if (historyData) currentDateIndex = historyData.day.items.length - 1;
        // if (IX.browser.versions.mobile && isContainOps) {
        //   player.trigger("play-video-event", "play-zhibo");
        // }
        renderBaseContainerClass("removeClass");
        $jianjimenu.hide();
        // $cloudmenu.show();
        if (IX.browser.versions.mobile) {
          playHistory();
          if (timeLineTrigger) clearInterval(timeLineTrigger);
        }
        // if (currentPlayCategory === "live_play") return;
        player.trigger("play_category_changed", "live_play");
      });
      $container.find(".play-type-menus button.play-video").add($f_show_history).click(function() {
        renderBaseContainerClass("addClass");
        isVideo = true;
        timelineReady = false;
        // player.trigger("control-yuntai-oper","yuntai-menu-stop");
        if (historyData) {
          if (!menuToFloat) {
            $jianjimenu.show();
          }
          if (currentScrollTime) {
            initTimeline(currentScrollTime, Number($container.find("a.time-tip").attr("_date")));
          } else {
            initTimeline();
            if (IX.browser.versions.mobile) {
              player.stop();
              isContainVideo();
            }

          }
        }
      });

      $pro_video_live.click(function() {
        if (!isVideo) {
          //$pro_video_live.find("a>span").text("看直播");
          $pro_video_live.addClass("pro_video_now");
          $pro_video_live.find("a>i").addClass("playerNow");
          player.trigger("pro-vide-event", false);
          $container.find(".play-type-menus button.play-video").trigger("click");
        } else {
          //$pro_video_live.find("a>span").text("看录像");
          $pro_video_live.removeClass("pro_video_now");
          $pro_video_live.find("a>i").removeClass("playerNow");
          player.trigger("pro-vide-event", true);
          $container.find(".play-type-menus button.play-zhibo").trigger("click");
        }
      })

      $container.find(".date-list-menu-wrap").on(be,function() {
        if (!historyData) return;

        if ($container.is(".on-show-days")) {
          $container.removeClass("on-show-days");
        } else {
          $container.addClass("on-show-days");
          $container.removeClass("show-hour-list");
        }
      })
      $f_show_history.click(function() {
        if (!historyData) return;

        if ($container.is(".on-show-days")) {
          $container.removeClass("on-show-days");
        } else {
          $container.addClass("on-show-days");
          $container.removeClass("show-hour-list");
        }
      });
      $time_thumbnail.click(function() {
        triggerVideo(currentTimeThumbnailTarget.a, {
          clientX: currentTimeThumbnailTarget.x
        });
        $time_thumbnail.hide();
      });

      $playlist.mousemove(function(e) {
        var findThumbnails = [];
        var i, ci, tmp;
        var $target;
        var t, left;
        var videoTimeStart, timeStart;
        var find = false;
        leavePlaylist = false;
        currentTimeThumbnailTarget = null;
        $time_thumbnail.hide();
        if (IX.browser.versions.mobile) return;
        $target = $(e.target || e.srcElement);
        if ($target.is("a")) {
          t = $target.attr("_area").split(",");
          left = e.clientX - $playlist.offset().left;
          left += Math.floor(left / itemWidth);
          timeStart = Math.floor(dateFullStartTime + left / getUnitTimeWidth());
          videoTimeStart = Math.floor((timeStart + dplaylisttime * 1000) / 1000);

          find = null;
          for (i = 0; i < historyData.thumbnails.length; i++) {
            ci = historyData.thumbnails[i];
            tmp = historyData.thumbnails[i];
            if (i >= 650) {
              ci = tmp;
            }
            if (t[0] <= ci.time && t[1] >= ci.time) {
              findThumbnails.push(ci);

              if (ci.time - videoTimeStart > 0) {
                find = findThumbnails.length === 1 ? ci : findThumbnails[findThumbnails.length - 2];
                break;
              }
            }
          }
          if (!find && findThumbnails.length > 0) {
            find = findThumbnails.pop();
          }
          if (find) {
            $time_thumbnail.removeClass("no-thumbnail").show();
            currentTimeThumbnailTarget = {
              a: $target,
              time: find.time,
              x: e.clientX
            };
            $time_thumbnail.css({
              left: e.clientX - $container.find("div.timeline").offset().left + "px"
            });
            $time_thumbnail.find("img.t").attr("src", find.url);
          } else {
            $time_thumbnail.css({
              left: e.clientX - $container.find("div.timeline").offset().left + "px"
            });
            $time_thumbnail.show().addClass("no-thumbnail").find("span.r").text(languages[language]["lp3"]);
            $time_thumbnail.find("img.t").attr("src", "");
          }
        }
      }).mouseleave(function() {
        leavePlaylist = true;
        if (!leaveThumbnail) return;
        $time_thumbnail.hide();
      });

      $time_thumbnail.mouseover(function() {
        // showThumbnail = true;
        $time_thumbnail.show();
      }).mouseleave(function() {
        leaveThumbnail = true;
        if (!leavePlaylist) return;
        $time_thumbnail.hide();
      });

      $playlist.click(function(e) {
        var $target;
        if (IX.browser.versions.mobile) return;
        $target = $(e.target || e.srcElement);
        if ($target.is("a")) {
          triggerVideo($target, e);
        }
      });

      $container.find("div.timeline>a.d").click(function() {
        var $this = $(this);
        var d = 0;
        if (timeType === "day") {
          d = 6 * 60 * 60 * 1000;
        } else {
          d = 15 * 60 * 1000;
        }
        if ($this.is(".prev")) {
          moveToTime(Math.max(currentScrollTime - d, dateFullStartTime));
        } else {
          moveToTime(Math.min(currentScrollTime + d, dateFullEndTime + (timeType === "day" ? 0 : 23 * 60 * 60 * 1000)));
        }
      });

      $date_choosen_wrap.on(be,function(e) {
        var $target = $(e.target || e.srcElement).closest("button");
        var _date, timeTip_date;
        if (config.isProfessional) {
          if ($target.is(".show-sec") || ($target.index() < 63 && $target.index() > 32)) {
            $date_choosen_wrap.addClass("show-sec");
            $date_choosen_wrap.removeClass("show-fir");
            $date_choosen_wrap.removeClass("show-thi");
          } else if ($target.is(".show-fir") || $target.index() < 32 && $target.index() > 0) {
            $date_choosen_wrap.addClass("show-fir");
            $date_choosen_wrap.removeClass("show-sec");
            $date_choosen_wrap.removeClass("show-thi");
          } else if ($target.is(".show-thi") || $target.index() > 64) {
            $date_choosen_wrap.addClass("show-thi");
            $date_choosen_wrap.removeClass("show-fir");
            $date_choosen_wrap.removeClass("show-sec");
          }
        }
        if ($target.length === 0 || ($target.is(".active") && timeType === "day" && (config.menuFloat !== "fixed" && !isFullScreen)) || $target.is(".more") || $target.is(".zz")) {
          return;
        }
        setTimeType("day");
        $container.removeClass("on-show-days");
        _date = Number($target.attr("_date"));
        $f_show_history.find("span.s-date").text($target.find("span").eq(0).text());
        if (!IX.browser.versions.mobile) {
          moveToTime(_date);
          timeTip_date = $container.find("a.time-tip").attr("_date");
          if (timeTip_date) {
            renderTimeTrigger(new Date(Number(timeTip_date)));
          }
        } else {
          currentDateIndex = historyData.day.videoHash[_date].itemIndex;
          moveToMTime();
        }
      });

      $container.find(".btn-time-list").click(function() {
        $container.toggleClass("show-hour-list");
      });
      $container.find(".time-list-menu-wrap").bind(be,function() {
        if(!config.isProfessional) return;
        $container.toggleClass("show-hour-list");
        if ($container.is(".on-show-days")) {
          $container.removeClass("on-show-days");
        }
      });
      $container.find(".mtime-list-menu-wrap").bind("touchend", function() {
        $container.toggleClass("show-hour-list");
      });
      $hourlist.on(be,function(event) {
        // choose_hour(event);
        if (!IX.browser.versions.mobile) {
          choose_hour(event);
        } else {
          switch (event.type) {
            case 'touchstart':
              flag = false;
              break;
            case 'touchmove':
              flag = true;
              break;
            case 'touchend':
              if (!flag) {
                choose_hour(event);
              }
              break;
          }
        }
      });
      // var hammertime = new Hammer($hourlist[0]);
      // hammertime.on("tap", function(ev) {
      //   //控制台输出
      //   if (!IX.browser.versions.mobile)  return;
      //   choose_hour(ev);
      // });
      choose_hour = function(e) {
        var $target, h, timeTip_date;
        $target = $(e.target || e.srcElement).closest("li");
        if (!$target.is("li")) {
          return;
        }
        h = Number($target.attr("_v"));
        $hourlist.find(".selected").removeClass("selected");
        $target.addClass("selected");
        $container.removeClass("show-hour-list");
        if (h !== -1 && h !== "") {
          setTimeType("time");
          currentHourIndex = h;
          if (!IX.browser.versions.mobile) scrollTimeline(Number($target.attr("_d")));
          else moveToMTime();
        } else if (h === -1) {
          setTimeType("day");
          if (!IX.browser.versions.mobile) scrollTimeline(historyData.day.items[currentDateIndex].date);
          else moveToMTime();
        }
        if (!IX.browser.versions.mobile) {
          timeTip_date = $container.find("a.time-tip").attr("_date");
          if (timeTip_date) {
            renderTimeTrigger(new Date(Number(timeTip_date)));
          }
        }
      };
    };
    addZero = function(n) {
      return (n + "").length === 1 ? "0" + n : n;
    };

    getUnitTimeWidth = function() {
      if (timeType === "day") {
        return unitWidth_on_date;
      } else {
        return unitWidth_on_hour;
      }
    };
    getVideoList = function() {
      if (timeType === "day") {
        return historyData.day.videoList;
      } else {
        return historyData.hour.videoList;
      }
    };

    getWidthByDTime = function(_dtime, _unitWidth) {
      return _dtime * (_unitWidth || getUnitTimeWidth());
    };

    getDTimeByWidth = function(_width) {
      return Math.round(_width / getUnitTimeWidth());
    };

    getLeftByTime = function(_time, _unitWidth) {
      var dt = _time - dateFullStartTime;
      var left = 0;
      var unitWidth = _unitWidth || getUnitTimeWidth();
      left = unitWidth * dt;
      left = left - Math.floor(left / itemWidth);
      return Math.round(left * 10) / 10;
    };

    getScrollLeftByTime = function(_time, _unitWidth) {
      var dt = _time - dateFullStartTime;
      var left = 0;
      var unitWidth = _unitWidth || getUnitTimeWidth();
      left = unitWidth * dt;
      left = left - Math.floor(left / itemWidth);
      return Math.round(left * 10) / 10;
    };

    getTextByDTime = function(_dtime) {
      var minutes = Math.floor(_dtime / 60000);
      var second = Math.floor((_dtime - minutes * 60000) / 1000);
      return minutes + languages[config.language]['lp54'] + second + languages[config.language]['lp55'];
    };
    //将百度给的录像时间列表转换成需要的数据结构
    /*   [startTime, endTime,**]
      historyData = {
        day: {
          videoList: [
            l: 1,
            a: "123123123,123123123,0",
            w: 1
          ],
          videoHash: {
            date: {
              videoListIndex: 1,
              itemIndex: 2,
              hours: [
                {
                  s: 1点,
                  enable: false
                  videoListIndex: 1
                }
              ]
            }
          },
          items: [
            {
              date: i,//9月23 00:00:00  ＝＝  213213123123123
              day: (isSameYear ? "" : (ciObj.getFullYear() + "年")) + (ciObj.getMonth() + 1) + "月" + addZero(ciObj.getDate()) + "日",
              week: "星期" + parseWeek(ciObj.getDay()),
              enable: false
            }
          ]
        },
        hour: {
          videoList: [
            {
              l:1,
              a: "",
              w: 1
            }
          ]
        }
      };

      currentDateIndex = 1
      currentHourIndex = 3
    */
    parsePlayList = function(playList) {
      var dateStartTime = dateStart.getTime();
      var dateEndTime = dateEnd.getTime();
      var parseWeek;
      var isSameYear;
      var i, ci, ci_hash, ciObj, m;

      if (Number(deviceInfo.connect_type) === 2) {
        playList = parseLingYangPlayList(playList);
      }

      parseWeek = function(n) {
        switch (n) {
          case 1:
            return languages[config.language]['lp36'];
          case 2:
            return languages[config.language]['lp37'];
          case 3:
            return languages[config.language]['lp38'];
          case 4:
            return languages[config.language]['lp39'];
          case 5:
            return languages[config.language]['lp40'];
          case 6:
            return languages[config.language]['lp41'];
          case 0:
            return languages[config.language]['lp42'];
        }
      };

      isSameYear = dateStart.getFullYear() === dateEnd.getFullYear();

      historyData = {
        thumbnails: [],
        day: {
          videoList: [],
          videoHash: {},
          items: []
        },
        hour: {
          videoList: [],
          timelineList: []
        }
      };

      for (i = dateFullStartTime; i <= dateFullEndTime; i += 24 * 60 * 60 * 1000) {
        ciObj = new Date(i);
        ci = {
          date: i,
          day: (isSameYear ? "" : (ciObj.getFullYear() + languages[config.language]['lp33'])) + (config.isProfessional ? addZero((ciObj.getMonth() + 1)) : (ciObj.getMonth() + 1)) + (config.isProfessional ? "." : languages[config.language]['lp34']) + addZero(ciObj.getDate()) + (config.isProfessional ? "" : languages[config.language]['lp35']),
          day1: addZero((ciObj.getMonth() + 1)) + "/" + addZero(ciObj.getDate()),
          week: parseWeek(ciObj.getDay()),
          clz: "disable",
          enable: false
        };

        ci_hash = {
          itemIndex: historyData.day.items.length,
          hours: []
        };

        for (m = 0; m <= 23; m++) {
          historyData.hour.timelineList.push({
            h: addZero(m)
          });
          ci_hash.hours.push({
            ls: addZero(m) + languages[config.language]['lp72'],
            enable: false,
            clz: "disable",
            videoListIndex: 0,
            h: m,
            d: new Date(ciObj.getFullYear() + "/" + (ciObj.getMonth() + 1) + "/" + ciObj.getDate() + " " + m + ":00:00").getTime()
          });
        }

        historyData.day.videoHash[i] = ci_hash;
        historyData.day.items.push(ci);
      }

      _.each(playList, function(_timeStep) {
        var s1 = (_timeStep[0] - dplaylisttime) * 1000,
          s2 = (_timeStep[1] - dplaylisttime) * 1000;
        var begin, end, i, _date, _dateStart, _datetime;

        if (s1 > dateEndTime || s2 < dateStartTime) {
          return;
        }

        s1 = Math.max(s1, dateStartTime);
        s2 = Math.min(s2, dateEndTime);

        historyData.day.videoList.push({
          a: _timeStep.join(),
          t: [s1, s2],
          w: getWidthByDTime(s2 - s1, unitWidth_on_date),
          l: getLeftByTime(s1, unitWidth_on_date),
          c: _timeStep[2] === 3 ? "FF4F7B" : ""
        });

        historyData.hour.videoList.push({
          a: _timeStep.join(),
          t: [s1, s2],
          w: getWidthByDTime(s2 - s1, unitWidth_on_hour),
          l: getLeftByTime(s1, unitWidth_on_hour),
          c: _timeStep[2] === 3 ? "FF4F7B" : ""
        });
        // if(_timeStep[2] === 3) return true;
        s1 = new Date(s1);
        s2 = new Date(s2);
        begin = new Date(s1.getFullYear() + "/" + (s1.getMonth() + 1) + "/" + s1.getDate() + " " + s1.getHours() + ":00:00").getTime();
        end = new Date(s2.getFullYear() + "/" + (s2.getMonth() + 1) + "/" + s2.getDate() + " " + s2.getHours() + ":00:00").getTime();
        for (i = begin; i <= end; i += 60 * 60 * 1000) {
          _date = new Date(i);
          _dateStart = new Date(_date.getFullYear() + "/" + (_date.getMonth() + 1) + "/" + _date.getDate() + " 00:00:00");
          _datetime = _dateStart.getTime();
          historyData.day.items[historyData.day.videoHash[_datetime].itemIndex].clz = "";
          historyData.day.videoHash[_datetime].hours[_date.getHours()].clz = "";
        }

      });
      playListCount = historyData.hour.videoList.length;
      if (playListCount === 0) historyData = null;
    };
    parseLingYangPlayList = function(playList) {
      var temp = [];
      var i, ci;


      if (!IX.isArray(playList)) {
        if (playList.events) {
          // eventsVideoList = playList.events;
          playList = playList.videos.concat(playList.events);
        } else playList = playList.videos;
      }

      for (i = 0; i < playList.length; i++) {
        ci = playList[i];
        if (ci.url) temp.push([ci.begin, ci.end, 3]);
        else temp.push([ci.from, ci.to, 4]);
      }
      return _.sortBy(temp, function(data) {
        return data[0]
      });
    };

    loadTimeThumbnail = function(_index) {
      var start, end;
      _index = _index === undefined ? currentDateIndex : _index;

      if (!historyData.day.items[_index] || historyData.day.items[_index].thumbnails) return;

      historyData.day.items[_index].thumbnails = 1;

      start = historyData.day.items[_index].date;
      start = Math.floor(start / 1000);
      end = start + 24 * 60 * 60;

      CallServer.CallServer["video_play_thumbnail_callserver"](_.extend({
        method: "thumbnail",
        st: start,
        et: end
      }, (deviceInfo.needpassword === 1 && deviceInfo.share_expires_in > 0) ? {
        password: deviceInfo.password
      } : {}, !config.isPrivate ? {
        shareid: deviceInfo.shareid,
        uk: deviceInfo.uk
      } : {
        deviceid: deviceInfo['deviceid']
      }), function(_data) {
        historyData.thumbnails = historyData.thumbnails.concat(_data.list || []);
      }, function() {
        //todo
      });

      loadTimeThumbnail(_index - 1);
      loadTimeThumbnail(_index + 1);
    };

    //生成日期选择区域
    renderDays = function(_index) {
      var items, pro_days, days, start, rangeStart, rangeEnd;
      var showDateDialog, dateDialog;
      if (!historyData) {
        return;
      }
      items = [];
      days = historyData.day.items;
      pro_days = _.clone(historyData.day.items)
      if (config.isProfessional && !isFullScreen) {
        items = pro_days;

        if (items.length === 90) {
          items.splice(31, 0, {
            clz: "zz show-sec",
            date: "show-sec",
            day: ">",
            week: ""
          });
          items.splice(32, 0, {
            clz: "zz show-fir",
            date: "show-fir",
            day: "<",
            week: ""
          });
          items.splice(63, 0, {
            clz: "zz show-thi",
            date: "show-thi",
            day: ">",
            week: ""
          });
          items.splice(64, 0, {
            clz: "zz show-sec",
            date: "prev",
            day: "<",
            week: ""
          });
        }
        // if(items.leng)
      } else if (days.length >= 7) {
        if (_index === undefined) {
          items = days.slice(days.length - 6);
        } else {
          start = _index <= 2 ? _index : (_index - 2);
          if (_index <= 2) {
            start = 0;
          } else if (days.length - (_index + 1) <= 6) {
            start = days.length - 6;
          } else {
            start = _index - 2;
          }
          items = days.slice(start, start + 6);
        }
        // if(IX.browser.versions.mobile){
        //   for(var i in items){
        //     items[i].week = "";
        //   }
        // }

        items = items.concat([{
          clz: "more",
          date: "more",
          day: languages[language]['lp70'],
          week: ""
        }]);
      } else {
        items = days;
      }

      $date_choosen_wrap.html(new IX.ITemplate({
        tpl: [
          "<tpl id = 'items'>",
          "<button _date='{date}' class = 'bb {clz}'><span>{day}</span><span class='w'>{week}</span></button>",
          "</tpl>"
        ]
      }).renderData("", {
        items: items
      }));
      if (_index === undefined) {
        $date_choosen_wrap.find("button.bb:not(.zz):not(.more):last").addClass("active");
        if (config.isProfessional && !isFullScreen) $date_choosen_wrap.addClass("show-thi");
      } else {
        $date_choosen_wrap.find("button.bb:not(.zz):not(.more)[_date='" + historyData.day.items[_index].date + "']").addClass("active");
      }

      $f_show_history.find("span.s-date").text(historyData.day.items[currentDateIndex].day);
      if (menuToFloat) {
        $date_choosen_wrap.find("button").each(function() {
          this.style.width = (100 / $date_choosen_wrap.find("button.bb:not(.more)").length) + "%";
        });
      }
      if (config.isProfessional) {
        if ($date_choosen_wrap.find("button.bb:not(.more)").length === 7) {
          $date_choosen_wrap.find("button").each(function() {
            this.style.width = (100 / $date_choosen_wrap.find("button.bb:not(.more)").length) + "%";
          });
        }
        if ($date_choosen_wrap.find("button.bb:not(.more)").length === 30) {
          $date_choosen_wrap.addClass("days-30");
          $date_choosen_wrap.find("button").each(function() {
            this.style.width = (200 / $date_choosen_wrap.find("button.bb:not(.more)").length) + "%";
          });
        }
        if ($date_choosen_wrap.find("button.bb:not(.more)").length >= 90) {
          $date_choosen_wrap.addClass("days-90");
          $date_choosen_wrap.find("button").each(function() {
            this.style.width = (100 / 16) + "%";
          });
        }

      }
      rangeStart = new Date(historyData.day.items[0].date);
      rangeEnd = new Date(historyData.day.items[historyData.day.items.length - 1].date);
      if (!IX.browser.versions.mobile) {
        loadTimeThumbnail();
        $date_choosen_wrap.find("button.more").datetimepicker({
          language: config.language === "zh-cn" ? "zh-CN" : "en",
          minView: 2,
          initialDate: _index === undefined ? rangeEnd : new Date(historyData.day.items[_index].date),
          autoclose: true,
          pickerPosition: "bottom-right",
          startDate: rangeStart.getFullYear() + "-" + (rangeStart.getMonth() + 1) + "-" + rangeStart.getDate() + " 00:00:00",
          endDate: rangeEnd.getFullYear() + "-" + (rangeEnd.getMonth() + 1) + "-" + rangeEnd.getDate() + " 23:59:00"
        }).on("changeDate", function(ev) {
          var date = new Date(ev.date.getFullYear() + "/" + (ev.date.getMonth() + 1) + "/" + ev.date.getDate() + " 00:00:00").getTime();
          setTimeType("day");
          moveToTime(date);
        });
      } else {
        showDateDialog = function() {
          var flag = false;
          var chooseDialogDate;
          var changeScrollTop = function() {
            if (currentDateIndex > 4) {
              dateDialog.$.scrollTop((currentDateIndex - 4) * 46 + 11);
            }
          };
          dateDialog = new Dialog({
            title: languages[config.language]['lp101'],
            className: "date-list",
            showDialog: function() {
              changeScrollTop();
            },
            html: new IX.ITemplate({
              tpl: [
                "<ul>",
                "<tpl id = 'items'>",
                "<li _date='{date}' class = 'cc {clz}'><span>{day}</span><img class='checked' src='/public/images/checked.png'/></button>",
                "</tpl>",
                "</ul>"
              ]
            }).renderData("", {
              items: historyData.day.items
            })
          });

          dateDialog.$.find("li.cc[_date='" + historyData.day.items[currentDateIndex].date + "']").addClass("active");

          dateDialog.show();



          chooseDialogDate = function(e) {
            var date;
            var $target = $(e.target || e.srcElement);
            if ($target.is("li") || $target.parent().is("li")) {
              date = $target.attr("_date");
              dateDialog.remove();
              // isShowDateDialog = false;
              currentDateIndex = historyData.day.videoHash[date].itemIndex;
              moveToMTime();
            }
          };
          dateDialog.$.find("li").on('touchstart touchmove touchend', function(event) {
            switch (event.type) {
              case 'touchstart':
                flag = false;
                break;
              case 'touchmove':
                flag = true;
                break;
              case 'touchend':
                if (!flag) {
                  chooseDialogDate(event);
                }
                break;
            }
          });
          // dateDialog.$.find("li").bind("touchend",function() {

          // });
        };
        $date_choosen_wrap.find("button.more").click(showDateDialog);
      }
    };

    //显示时间刻度指针
    renderTimeTrigger = function(_date, noTrigger) {
      var $mtime_tip, left, _dateTime; //$time_tip, 
      var timeUnitWidth, _m;
      var last_video_start, last_video_end, client_x;
      if (!_date) {
        return;
      }
      $time_tip = $container.find(".time-tip").show();
      $mtime_tip = $container.find(".m-time-tip").show();
      if (!IX.browser.versions.mobile) {
        if (_date === "init") {
          last_video_start = historyData.day.videoList[historyData.day.videoList.length - 1].t[0];
          last_video_end = historyData.day.videoList[historyData.day.videoList.length - 1].t[1];
          client_x = $playlist.find("a:last-of-type").offset().left;
          if (last_video_end - last_video_start > 30 * 60 * 1000) {
            _date = new Date(last_video_end - 30 * 60 * 1000);
            client_x = client_x + ((last_video_end - 30 * 60 * 1000 - last_video_start) * getUnitTimeWidth());
          }
          if (isVideo) {
            triggerVideo($playlist.find("a:last-of-type"), {
              clientX: client_x
            });
            return;
          }
        }
        _dateTime = _date.getTime();
        if (_dateTime < dateFullStartTime || _date.getTime() - dateFullEndTime > 24 * 3600000) {
          return;
        }
        $mtime_tip.hide();
        $time_tip.show();
        if (timeTipTrigger) {
          clearInterval(timeTipTrigger);
        }
        timeUnitWidth = getUnitTimeWidth();
        _m = _date.getMinutes();
        left = getLeftByTime(_date.getTime());
        if (config.isProfessional && !menuToFloat)
          $time_tip.find("span").text(addZero(_date.getHours()) + ":" + addZero(_m)).attr("_date", _date.getTime());
        else
          $time_tip.text(addZero(_date.getHours()) + ":" + addZero(_m)).attr("_date", _date.getTime());
        $time_tip.css("left", (left - ((config.isProfessional && !menuToFloat) ? 19 : 22)) + "px");
        if (noTrigger) {
          return;
        }
        timeTipTrigger = setInterval(function() {
          var m;
          _dateTime += 1000;
          _date = new Date(_dateTime);
          m = _date.getMinutes();
          if (m !== _m) {
            _m = m;
            left += timeUnitWidth;
            $time_tip.css("left", (left - ((config.isProfessional && !menuToFloat) ? 19 : 22)) + "px");
          }
          if (config.isProfessional)
            $time_tip.find("span").text(addZero(_date.getHours()) + ":" + addZero(m)).attr("_date", _dateTime);
          else
            $time_tip.text(addZero(_date.getHours()) + ":" + addZero(m)).attr("_date", _dateTime);
        }, 1000);
      } else {
        $time_tip.hide();
        $mtime_tip.show();
        $mtime_tip.find("span.fulltime").text(addZero(_date.getFullYear()) + "-" + addZero(_date.getMonth() + 1) + "-" + addZero(_date.getDate()) + " " + addZero(_date.getHours()) + ":" + addZero(_date.getMinutes())); //+ ":" + addZero(_date.getSeconds())
      }
    };

    renderHourList = function() {
      if (!historyData) {
        return;
      }
      $hourlist.html(timeListTpl.renderData("", {
        items: [{
          ls: languages[config.language]['lp22'],
          h: -1,
          clz: "selected"
        }].concat(historyData.day.videoHash[historyData.day.items[currentDateIndex].date].hours)
      }));
      if (timeType === "time")
        $hourlist.find("li[_v='" + currentHourIndex + "']").addClass("selected");
    };

    //判断是否包含录像区域
    isContainVideo = function() {
      var isContain, t, i, ci;
      var lvt = historyData.day.videoList[historyData.day.videoList.length - 1].t[1];
      if (mtimeStart > lvt) {
        player.showErrorMsg(languages[config.language]['lp16']);
        playHistory();
        return;
      } else {
        for (i = 0; i < historyData.day.videoList.length; i++) {
          ci = historyData.day.videoList[i];
          if (ci.t[0] <= mtimeStart && ci.t[1] > mtimeStart) {
            player.showErrorMsg();
            isContain = true;
            t = ci.t;
            break;
          }
        }
      }
      if (!isContain) {
        player.showErrorMsg(languages[config.language]['lp16']);
        playHistory();
        return;
      }
      mvideoTimeStart = Math.floor(mtimeStart + dplaylisttime * 1000);
      getVideoPlayTimeArea(mvideoTimeStart, t);
      currentHistoryStartTime = Math.floor(mtimeStart / 1000);
      playHistory(Math.floor(mvideoTimeStart / 1000), currentHistoryEndTime + dplaylisttime);
    };
    //生成录像选择区域
    renderTimeline = function() {
      var $timetagWrap, touchArea;
      var width, dw, startPos, endPos;
      if (!historyData) {
        return;
      }

      $timetagWrap = $container.find("div.timetags");
      touchArea = {
        // 判断设备是否支持touch事件
        isTouch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch,
        slider: $scrollwrap[0],
        // 事件
        events: {
          slider: $scrollwrap[0], // this为slider对象
          handleEvent: function(event) {
            // this指events对象
            var self = this;
            if (event.type === 'touchstart') {
              self.start(event);
            } else if (event.type === 'touchmove') {
              self.move(event);
            } else if (event.type === 'touchend') {
              self.end(event);
            }
          },
          // 滑动开始
          start: function(event) {
            var touch = event.touches[0]; // touches数组对象获得屏幕上所有的touch，取第一个touch
            startPos = { // 取第一个touch的坐标值
              x: touch.pageX,
              y: touch.pageY,
              time: +new Date()
            };
            endPos = {
              x: 0,
              y: 0
            };
            player.showErrorMsg();
            timelineValue = Number($container.find(".timeline-main").css("margin-left").replace('px', '')) || 0;
            // 绑定事件
            this.slider.addEventListener('touchmove', this, false);
            this.slider.addEventListener('touchend', this, false);
          },
          // 移动
          move: function(event) { // 当屏幕有多个touch或者页面被缩放过，就不执行move操作
            var touch, isScrolling;
            if (event.touches.length > 1 || event.scale && event.scale !== 1) {
              return;
            }
            touch = event.touches[0];

            endPos = {
              x: touch.pageX - startPos.x, //
              y: touch.pageY - startPos.y
            };
            isScrolling = Math.abs(endPos.x) < Math.abs(endPos.y) ? 1 : 0; //isScrolling为1时，表示纵向滑动，0为横向滑动
            if (isScrolling === 0) {
              event.preventDefault();
              moveToMTime(endPos.x);
              // scrollTimeline("", endPos.x );
            }
          },
          // 滑动释放
          end: function() { //event
            var duration = +new Date() - startPos.time; // 滑动的持续时间
            if (duration < 300) return;
            isContainVideo();

            // 解绑事件
            this.slider.removeEventListener('touchmove', this, false);
            this.slider.removeEventListener('touchend', this, false);
          }
        },
        // 初始化
        init: function() {
          // this指slider对象
          var self = this;
          // addEventListener第二个参数可以传一个对象，会调用该对象的handleEvent属性
          if (!!self.isTouch) {
            self.slider.addEventListener('touchstart', self.events, false);
          }
        }
      };
      if (timeType === "day") {
        $playlist.html(timeLineTpl.renderData("", {
          items: historyData.day.videoList
        }));

        $timelineWrap.html((!menuToFloat ? (config.isProfessional ? timelines_proTpl : timelinesTpl) : timelines_whiteTpl).renderData("", {
          items: (new Array(historyData.day.items.length - 1)).join("1").split("1")
        }));
        $timetagWrap.html(timeTags_day_tpl.renderData("", {
          items: historyData.day.items
        }));
        width = (historyData.day.items.length - 1) * (itemWidth - 1) + itemWidth;
        // $container.find(".timeline-main").width(width + 60);
        $container.find(".timeline-wrap").width(width);
        $timelineWrap.find("img").width(itemWidth - 1);
        $timelineWrap.find("img:last").width(itemWidth);

        dw = width / (4 * historyData.day.items.length);
        $timetagWrap.find("span").width(dw);
        // $timetagWrap.find("span:first, span:last").width(dw / 2 + 20);

        if (!IX.browser.versions.mobile) {
          $container.find(".timeline-main").width(width + ((config.isProfessional && !menuToFloat) ? 40 : 60)); //
          $timetagWrap.find("span:first, span:last").width(dw / 2 + ((config.isProfessional && !menuToFloat) ? 18 : 20));
        } else {
          $container.find(".timeline-main").width(width);
          $container.find(".tmleft").css({
            "width": itemWidth / 2,
            "left": -itemWidth / 2,
            "display": "inline-block"
          });
          $container.find(".tmleft img").css({
            "width": itemWidth,
            "left": -(itemWidth - 1) / 2
          });
          $container.find(".tmright").css({
            "width": itemWidth / 2,
            "right": -itemWidth / 2,
            "display": "inline-block"
          });
          $container.find(".tmright img").css({
            "width": itemWidth,
            "right": -(itemWidth - 1) / 2
          });
          $timetagWrap.find("span:first").css("padding-left", "0px");
          $timetagWrap.find("span:last").css("padding-right", "0px");
          $timetagWrap.find("span:first, span:last").width(dw / 2);
          timelineMainWidth = width;
          touchArea.init();
        }
      } else {
        $playlist.html(timeLineTpl.renderData("", {
          items: historyData.hour.videoList
        }));
        $timelineWrap.html((!menuToFloat ? (config.isProfessional ? timelines_proTpl : timelinesTpl) : timelines_whiteTpl).renderData("", {
          items: (new Array(historyData.day.items.length * 24 - 1)).join("1").split("1")
        }));
        $timetagWrap.html(timeTags_hour_tpl.renderData("", {
          items: historyData.hour.timelineList
        }));
        width = (historyData.day.items.length * 24 - 1) * (itemWidth - 1) + itemWidth;


        $container.find(".timeline-wrap").width(width);
        $timelineWrap.find("img").width(itemWidth - 1);
        $timelineWrap.find("img:last").width(itemWidth);

        dw = width / (4 * historyData.day.items.length * 24);
        $timetagWrap.find("span").width(dw);

        if (!IX.browser.versions.mobile) {
          $container.find(".timeline-main").width(width + ((config.isProfessional && !menuToFloat) ? 40 : 60));
          $timetagWrap.find("span:first, span:last").width(dw / 2 + ((config.isProfessional && !menuToFloat) ? 18 : 10));
        } else {
          $container.find(".timeline-main").width(width);
          $container.find(".tmleft").css({
            "width": itemWidth / 2,
            "left": -itemWidth / 2,
            "display": "inline-block"
          });
          $container.find(".tmleft img").css({
            "width": itemWidth,
            "left": -(itemWidth - 1) / 2
          });
          $container.find(".tmright").css({
            "width": itemWidth / 2,
            "right": -itemWidth / 2,
            "display": "inline-block"
          });
          $container.find(".tmright img").css({
            "width": itemWidth,
            "right": -(itemWidth - 1) / 2
          });
          $timetagWrap.find("span:first").css("padding-left", "0px");
          $timetagWrap.find("span:last").css("padding-right", "0px");
          $timetagWrap.find("span:first, span:last").width(dw / 2);
          timelineMainWidth = width;
          touchArea.init();
        }
      }
    };


    scrollTimeline = function(_date, _moveX) {
      var left;
      if (!IX.browser.versions.mobile) {
        currentScrollTime = _date;
        left = Math.min(Math.max(getScrollLeftByTime(_date), 0), getScrollLeftByTime(dateFullEndTime + 24 * 60 * 60 * 1000));
        $scrollwrap[0].scrollLeft = left;
      } else {
        $timelineMain.css("margin-left", _moveX + "px");
      }
    };
    initTimeline = function(_scrollTime, _playTime) {
      if (timelineReady || !isVideo) return;
      timelineReady = true;
      renderTimeline();
      if (!IX.browser.versions.mobile) {
        moveToTime(_scrollTime || historyData.day.items[currentDateIndex].date, -timelineMainWidth + itemWidth);
        renderTimeTrigger(_playTime ? new Date(_playTime) : "init");
        renderDays(currentDateIndex);
        renderHourList();
      } else {
        if (mtimeStart) {
          before_time = mtimeStart;
          moveToMTime("", true);
        } else {
          moveToMTime(-timelineMainWidth + itemWidth, true);
        }
      }
    };
    getHistoryList = function() {
      var stime, etime;
      dateEnd = currentDate;
      var tmpDate = new Date(currentTime - 86400000 * ((deviceInfo.isMyCamera ? deviceInfo['cvr_day'] : 7) - 1));
      dateStart = new Date(tmpDate.getFullYear() + "/" + (tmpDate.getMonth() + 1) + "/" + tmpDate.getDate() + " 00:00:00"); //.toLocaleDateString());
      dateFullStart = new Date(dateStart.getFullYear() + "/" + (dateStart.getMonth() + 1) + "/" + dateStart.getDate() + " 00:00:00");
      dateFullEnd = new Date(dateEnd.getFullYear() + "/" + (dateEnd.getMonth() + 1) + "/" + dateEnd.getDate() + " 00:00:00");

      dateFullStartTime = dateFullStart.getTime();
      dateFullEndTime = dateFullEnd.getTime();

      stime = dateStart.getTime() / 1000 + dplaylisttime;
      etime = dateEnd.getTime() / 1000 + dplaylisttime;

      CallServer.CallServer["video_play_list_callserver"](_.extend({
          method: "playlist",
          st: stime,
          et: etime
        }, !config.isPrivate ? {
          shareid: deviceInfo.shareid,
          password: deviceInfo.password,
          uk: deviceInfo.uk
        } : {
          deviceid: deviceInfo['deviceid']
        }),
        function(data) {
          if (data && !data.error_code) {
            sourcePlayList = typeof(data['results']) !== "undefined" ? data['results'] : [];
            parsePlayList(sourcePlayList);

            if (historyData) {
              $container.addClass("enable-video");
              currentDateIndex = historyData.day.items.length - 1;
              currentHourIndex = 0;
              $f_show_history.find("span.s-date").text(historyData.day.items[historyData.day.items.length - 1].day);
              if ($basecontainer.is(".show-history-list")) {
                initTimeline();
              }
            }
          }
          if (!historyData) {
            $container.addClass("no-video");
          }
        },
        function() {
          $container.addClass("no-video");
        }
      );
    };

    bindJianJiEvent = function() {
      var startJianji = false,
        startX = 0,
        jianjiMove = 0,
        startWidth;

      var $jianji_op_trigger = $container.find(".jianji-op .trigger");
      var $jianji_time = $container.find(".jianji-op .ops>p>span");
      var triggerBorderWidth = 0,
        triggerBorderWidth_2x = 0;
      var $jianjiop = $container.find("div.jianji-op");

      var clipErrorTime = 0;

      var dialog;
      var getClipProgress, getTriggerWidth, getJianjiTimeArea, checkEventVideoArea, checkJianjiTimeArea, onJianjiTriggerMove,
        stopJianjiTriggerMove, onJianjiMove, stopJianjiMove;
      var startLeft, maxLeft, minLeft, maxWidth;

      getClipProgress = function() {
        var _html, files, i, ci, timeout;
        //$tmp.css("width", "100%");
        dialog.$.find(".progress").show();
        CallServer.CallServer[deviceInfo.connect_type === 2 ? "video_clipVideo_ly_callserver" : "video_clipVideo_callserver"]({
          method: 'infoclip',
          clipid: deviceInfo.clipid,
          deviceid: deviceInfo.deviceid,
          type: 'task'
        }, function(data) {
          if (data && typeof(data['progress']) !== 'undefined') {
            clipErrorTime = 0;
            //$("#clipBar").css("width", data['progress'] + '%');
            dialog.$.find(".progress-bar").css("width", data['progress'] + '%');
            if (Number(data['progress']) !== 0) {
              dialog.$.find(".progress-bar span").text(data['progress'] + '%');
            }
            if (deviceInfo.connect_type === 2 && Number(data["status"]) === -1) {
              AppLog.error(languages[config.language]['lp59']);
              return;
            }
            if (Number(data['progress']) !== 100) {
              if (timeout) clearTimeout(timeout);
              timeout = setTimeout(function() {
                getClipProgress();
              }, 1000);
            } else if (deviceInfo.connect_type === 2 && Number(data.status) === 0 || deviceInfo.connect_type !== 2 && Number(data['progress']) === 100) {
              dialog.remove();
              data.segments = data.segments || [];
              if (deviceInfo.connect_type === 2 && data.segments.length > 0) {
                (new Dialog({
                  title: languages[config.language]['lp63'],
                  noFooter: true,
                  html: (function() {
                    _html = new IX.ITemplate({
                      tpl: "<ul class = 'clip-files'><tpl id = 'files'><li><span>{name}</span><a href = '{href}' target='_blank'>" + languages[config.language]["lp20"] + "</a></li></tpl></ul>"
                    });
                    files = [];
                    for (i = 0; i < data.segments.length; i++) {
                      ci = data.segments[i];
                      files.push({
                        name: languages[config.language]['lp65'] + (files.length + 1),
                        href: ci.download
                      });
                    }
                    return _html.renderData("", {
                      files: files
                    });
                  })()
                })).show();
              } else if (deviceInfo.connect_type !== 2) {
                (new Dialog({
                  title: languages[config.language]['lp63'],
                  noFooter: true,
                  html: (function() {
                    _html = new IX.ITemplate({
                      tpl: "<ul class = 'clip-files'><tpl id = 'files'><li><span>{name}</span><a href = '{href}' target='_blank'>" + languages[config.language]["lp20"] + "</a></li></tpl></ul>"
                    });
                    files = [];
                    files.push({
                      name: data.name,
                      href: data.url
                    });
                    return _html.renderData("", {
                      files: files
                    });
                  })()
                })).show();
              }
            }
          } else {
            clipErrorTime++;
            if (clipErrorTime > 10) {
              return;
            }
            getClipProgress();
          }
        }, function() {
          //todo
        });
      };

      getTriggerWidth = function() {
        return Number($jianji_op_trigger[0].style.width.replace("px", "")) - triggerBorderWidth_2x;
      };
      $jianjimenu.click(function() {
        var hasFind, timeLength, videoList, i, ci, a, playTime, _start, d;
        if (!historyData) {
          return;
        }
        $container.addClass("on-jianji");
        if (timeType === "day") {
          if (historyData.day.items[currentDateIndex].clz === "disable") {
            $date_choosen_wrap.find("button:not(.disable):not(.more):not(.zz):last").trigger("click");
          }
          //$hourlist.find("li[_v!='-1']:not(.disable):last").trigger("click");
        } else if (historyData.day.videoHash[historyData.day.items[currentDateIndex].date].hours[currentHourIndex].clz === "disable") {
          $hourlist.find("li[_v!='-1']:not(.disable):last").trigger("click");
        }
        hasFind = false;
        timeLength = 0;
        triggerBorderWidth = Number($jianji_op_trigger.css("border-width").replace("px", ""));
        triggerBorderWidth_2x = triggerBorderWidth * 2;
        videoList = getVideoList();
        playTime = Number($container.find("a.time-tip").attr("_date"));
        if (playTime >= currentScrollTime && playTime <= currentScrollTime + (timeType === "day" ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000)) {
          _start = 0;
          d = 15 * 60 * 1000;
          for (i = 0; i < playListCount; i++) {
            ci = videoList[i];
            // a = Number(ci.a.split(",")[2]);
            if (ci.t[0] <= playTime && ci.t[1] >= playTime) { //&& a !== 3
              hasFind = true;
              if (playTime === ci.t[0] || playTime - ci.t[0] <= d) {
                _start = ci.t[0];
              } else {
                _start = playTime - d;
              }
              $jianjiop.css("left", getLeftByTime(_start) - triggerBorderWidth);
              timeLength = ci.t[1] - _start;
              $jianji_op_trigger.width(Math.min(ci.l + ci.w - getLeftByTime(_start), itemWidth));
              break;
            }
          }
        }
        if (!hasFind) {
          for (i = 0, ci; i < playListCount; i++) {
            ci = videoList[i];
            // a = Number(ci.a.split(",")[2]);
            if (ci.t[0] <= currentScrollTime && ci.t[1] >= currentScrollTime) { //&& a !== 3
              hasFind = true;
              $jianjiop.css("left", getLeftByTime(currentScrollTime) - triggerBorderWidth);
              timeLength = ci.t[1] - currentScrollTime;
              $jianji_op_trigger.width(Math.min(ci.l + ci.w - getLeftByTime(currentScrollTime), itemWidth));
              break;
            } else if (ci.t[0] >= currentScrollTime) { //&& a !== 3
              hasFind = true;
              $jianjiop.css("left", getLeftByTime(ci.t[0]) - triggerBorderWidth);
              if (timeType === "day") {
                timeLength = Math.min(currentScrollTime + 24 * 60 * 60 * 1000, ci.t[1]) - ci.t[0];
              } else {
                timeLength = Math.min(currentScrollTime + 60 * 60 * 1000, ci.t[1]) - ci.t[0];
              }
              $jianji_op_trigger.width(Math.min(itemWidth - ci.l + getLeftByTime(ci.t[0]), ci.w));
              break;
            }
          }
        }
        if (!hasFind) {
          return;
        }
        $jianji_time.text(getTextByDTime(timeLength));
        checkJianjiTimeArea(currentScrollTime, timeLength);
      });

      $container.find(".cancel-jianji").click(function() {
        $container.removeClass("on-jianji");
      });


      getJianjiTimeArea = function() {
        var left = Number($jianjiop.css("left").replace("px", "")) + triggerBorderWidth;
        var width = getTriggerWidth();

        var start = dateFullStartTime + (left + Math.floor(left / itemWidth)) / getUnitTimeWidth();
        var end = start + getDTimeByWidth(width);

        var _s = Math.floor((start + dplaylisttime * 1000) / 1000);
        var _e = Math.floor((end + dplaylisttime * 1000) / 1000);
        var _s1 = Math.floor(start / 1000);
        var _e1 = Math.floor(end / 1000);

        return {
          s: _s,
          e: _e,
          s1: _s1,
          e1: _e1
        };
      };

      checkEventVideoArea = function(_ts, _te) {
        var videoList = getVideoList();
        var eCount = 0,
          cCount = 0;
        for (i = 0; i < playListCount; i++) {
          var ci = videoList[i];
          var s1 = ci.t[0] / 1000,
            s2 = ci.t[1] / 1000;
          var a = Number(ci.a.split(",")[2]);
          if ((_ts > s1 && _ts < s2) || (_te > s1 && _te < s2)) {
            if (a === 3) {
              eCount++;
            } else {
              cCount++;
            }
          }
        }
        if (cCount === 0 && eCount !== 0) {
          AppLog.error(languages[config.language]['lp66']);
          return false;
        } else if (cCount !== 0 && eCount !== 0) {
          AppLog.error(languages[config.language]['lp67']);
          return true;
        }
        // if (getTextByDTime(_te - _ts) === "0分0秒")return false;
        // for (i = 0; i < eventsVideoList.length; i++) {
        //   var ci = eventsVideoList[i];
        //   // if (startTime > ci.begin && startTime > ci.begin) {};
        //   // if (begin1Time <= begin2Time &&  end1Time <= end2Time) {
        //   //   AppLog.error(languages[config.language]['lp66']);
        //   //   return false;
        //   // };
        //   if((_ts > ci.begin &&  _ts < ci.end) || (_te > ci.begin && _te <ci.end ))
        //   {
        //     AppLog.error(languages[config.language]['lp66']);
        //     return false;
        //   }
        // }
        return true;
      }
      checkJianjiTimeArea = function(startTime, timeCount) {
        var timeLength = 0,
          maxTime = 30 * 60 * 1000,
          start = false,
          starti = 0,
          end = false,
          endi = 0,
          // endType = 0,
          endTime = 0;

        var left = Number($jianjiop.css("left").replace("px", "")) + triggerBorderWidth;
        var width = getTriggerWidth();
        var videoList, i, ci; //ctime
        var dtime;
        // var ltag,lcId;
        timeCount = timeCount || getDTimeByWidth(width);

        videoList = getVideoList();
        for (i = 0; i < playListCount; i++) {
          ci = videoList[i];
          // a = Number(ci.a.split(",")[2]);
          // endType = 0;
          // if(a === 3) continue;
          // if(a === 3 && !ltag){
          //   lcId = i - 1;
          //   ltag = true;
          // }
          if (start) {
            // ctime = ci.t[1] - ci.t[0];
            // if(lcId && a === 3){
            //   endi = lcId;
            //   end = videoList[endi];
            //   endTime = end.t[1];
            //   // endType = 1;
            //   width = getWidthByDTime(end.t[1] - startTime);
            //   AppLog.error(languages[config.language]['lp66']);
            //   break;
            // }
            if (ci.t[0] >= endTime) {
              endi = i - 1;
              end = videoList[endi];
              endTime = end.t[1];
              // endType = 1;
              width = getWidthByDTime(end.t[1] - startTime);
            } else if (ci.t[0] < endTime && ci.t[1] >= endTime) {
              endi = i;
              end = ci;
              // endType = 2;
              width = getWidthByDTime(endTime - startTime);
            } else if (i === playListCount - 1) {
              endi = i;
              end = ci;
              // endType = 2;
              width = getWidthByDTime(end.t[1] - startTime);
            }
            if (end) break;
          } else {
            // if (a === 3) {
            //   start = videoList[lcId];
            //   left = start.l + start.w;
            //   startTime = start.t[1];
            //   starti = lcId;
            //   continue;
            // };
            if (ci.l > left) {
              if (ci.l < left + width) {
                left = ci.l;
                start = ci;
                startTime = ci.t[0];
                starti = i;
              } else {
                if ($playlist.children().eq(i).offset().left >= $scrollwrap.offset().left + $scrollwrap.width() - ((config.isProfessional && !menuToFloat) ? 13 : 30)) { //
                  i--;
                  start = videoList[i];
                  left = start.l;
                  starti = i;
                  startTime = start.t[0];
                } else {
                  left = ci.l;
                  start = ci;
                  startTime = ci.t[0];
                  starti = i;
                }
              }
              i--;
            } else if (ci.l === left) {
              start = ci;
              startTime = ci.t[0];
              starti = i;
              i--;
            } else if (ci.l < left && ci.l + ci.w >= left) {
              start = ci;
              startTime = getDTimeByWidth(left - ci.l) + ci.t[0];
              starti = i;
              i--;
            }
            if (start) {
              endTime = startTime + Math.min(timeCount, maxTime);
            }
          }
        }

        if (!start) {
          endi = starti = playListCount - 1;
          end = start = videoList[starti];
          left = Math.max(start.l, getLeftByTime(currentScrollTime));
          dtime = start.t[1] - Math.max(currentScrollTime, start.t[0]);
          timeLength = Math.min(dtime, maxTime);
          width = getWidthByDTime(timeLength);
          startTime = Math.max(currentScrollTime, start.t[0]);
          endTime = startTime + timeLength;
        }
        $jianjiop[0].style.left = left - triggerBorderWidth + "px";
        $jianji_op_trigger.width(width);
        $jianji_time.text(getTextByDTime(endTime - startTime));
      };
      $jianjiop.find("button.save-jianji").click(function() {
        var time = getJianjiTimeArea();
        if (!checkEventVideoArea(time.s, time.e)) return;
        var timesArea = deviceInfo.description + "_" + (IX.Date.getDateByFormat(time.s1 * 1000, "yyyyMMddHHmmss")) + "_" + (IX.Date.getDateByFormat(time.e1 * 1000, "yyyyMMddHHmmss"));
        //alert(timesArea);
        dialog = new Dialog({
          title: languages[config.language]['lp113'],
          noFooter: true,
          html: [
            "<div class = 'save-video-wrap " + config.language + "'>",
            "<p style = 'display:none;'>" + languages[language]['lp68'] + "" + $(".jianji-op .ops p span").text() + "</p>",
            "<div class = 'clip-name' style = 'display:none;'>" + languages[language]['lp57'] + "<input type = 'text' id = 'clipname' value='" + timesArea + "' /></div>",
            "<div class='progress'>",
            "<div class='progress-bar progress-bar-danger' role='progressbar' data-transitiongoal='100'><span></span></div>",
            "</div>",
            "<div class = 'btns'>",
            "<button class = 'cancel'><span>" + languages[language]['lp21'] + "</span></button>",
            "<button class = 'save'><span>" + languages[language]['lp28'] + "</span></button>",
            "</div>",
            "</div>"
          ].join("")
        });
        dialog.show();
        dialog.$.find("button.save").click(function() {
          var errorCode;
          CallServer.CallServer[deviceInfo.connect_type === 2 ? "video_clipVideo_ly_callserver" : "video_clipVideo_callserver"]({
            method: 'clip',
            deviceid: deviceInfo.deviceid,
            st: time.s,
            et: time.e,
            name: dialog.$.find("input").val().trim()
          }, function(data) {

            if (data && typeof(data['error_code']) !== "undefined") {
              //todo
            } else {
              clipErrorTime = 0;
              deviceInfo.clipid = data.clipid;
              getClipProgress();
            }
          }, function(data) {
            data = JSON.parse(data.responseText);
            errorCode = {
              "31354": languages[config.language]['lp58'],
              "31372": languages[config.language]['lp59'],
              "31374": languages[config.language]['lp69'],
              "31375": languages[config.language]['lp60'],
              "31376": languages[config.language]['lp61'],
              "31377": languages[config.language]['lp62']
            };
            AppLog.error(errorCode[data['error_code']] || data.error_msg);
          });
        });

        dialog.$.find("button.cancel").click(function() {
          dialog.remove();
        });
      });
      $jianjiop.find("button.download-jianji").click(function() {
        var time = getJianjiTimeArea();
        var f;

        CallServer.CallServer["video_downloadClipVideo_callserver"]({
          method: 'vodlist',
          deviceid: deviceInfo.deviceid,
          st: time.s,
          et: time.e
        }, function(data) {
          //var num = data.length;
          if (data) {
            (new Dialog({
              title: languages[config.language]['lp63'],
              noFooter: true,
              html: (function() {
                var _html = new IX.ITemplate({
                  tpl: "<ul class = 'clip-files'><tpl id = 'files'><li><span>{name}</span><a href = '{href}'>" + languages[config.language]["lp20"] + "</a></li></tpl></ul>"
                });
                var files = [];
                for (f in data) {
                  if (/^\d+$/.test(f)) {
                    files.push({
                      name: languages[config.language]['lp65'] + (files.length + 1),
                      href: data[f]
                    });
                  }
                }
                return _html.renderData("", {
                  files: files
                });
              })()
            })).show();
          }
        });
      });

      $jianjiop.find(".dragger").mousedown(function(e) {
        startJianji = true;
        startX = e.clientX;
        jianjiMove = 3;
        startLeft = Number($jianjiop.css("left").replace("px", ""));
        minLeft = getLeftByTime(currentScrollTime) - triggerBorderWidth;
        maxLeft = minLeft + triggerBorderWidth + itemWidth - getTriggerWidth();
        $(document).bind({
          mousemove: onJianjiTriggerMove,
          mouseup: stopJianjiTriggerMove
        });
      });

      onJianjiTriggerMove = function(e) {
        var dx, left;
        if (!startJianji || jianjiMove !== 3) {
          return;
        }
        document.onselectstart = function() {
          return false;
        };
        dx = e.clientX - startX;
        left = startLeft + dx;
        left = Math.min(Math.max(left, minLeft), maxLeft);
        $jianjiop.css("left", left + "px");
      };

      stopJianjiTriggerMove = function() { //e
        document.onselectstart = function() {
          return true;
        };
        startJianji = false;
        $(document).unbind({
          "mousemove": onJianjiTriggerMove,
          "mouseup": stopJianjiTriggerMove
        });
        checkJianjiTimeArea();
      };

      onJianjiMove = function(e) {
        var dx, _left;
        if (!startJianji || jianjiMove === 3) {
          return;
        }
        document.onselectstart = function() {
          return false;
        };
        dx = e.clientX - startX;
        if (jianjiMove === 2) {
          if (startWidth + dx > maxWidth) {
            return;
          }
          $jianji_op_trigger.width(Math.max(startWidth + dx, 1 + triggerBorderWidth_2x));
        }
        if (jianjiMove === 1) {
          _left = startLeft + dx;
          if (_left < minLeft || _left > maxLeft) {
            return;
          }
          $jianjiop.css("left", Math.max(_left, 0) + "px");
          $jianji_op_trigger.width(Math.max(startWidth - dx, 1));
        }
        $jianji_time.text(getTextByDTime(getDTimeByWidth(getTriggerWidth())));
      };

      stopJianjiMove = function() {
        document.onselectstart = function() {
          return true;
        };
        startJianji = false;
        $(document).unbind("mousemove", onJianjiMove).unbind("mouseup", stopJianjiMove);
        checkJianjiTimeArea();
      };
      $container.find(".jianji-op .trigger a.a1").mousedown(function(e) { //var $a1 =
        startJianji = true;
        startX = e.clientX;
        jianjiMove = 1;
        startWidth = getTriggerWidth();
        startLeft = Number($jianjiop.css("left").replace("px", ""));
        minLeft = getLeftByTime(currentScrollTime) - triggerBorderWidth;
        maxLeft = startLeft + getTriggerWidth() - 1;
        $(document).mousemove(onJianjiMove).mouseup(stopJianjiMove);
      }).mouseup(stopJianjiMove);
      $container.find(".jianji-op .trigger a.a2").mousedown(function(e) { //var $a2 =
        startJianji = true;
        startX = e.clientX;
        jianjiMove = 2;
        startWidth = getTriggerWidth();
        startLeft = Number($jianjiop.css("left").replace("px", ""));
        minLeft = getLeftByTime(currentScrollTime) - triggerBorderWidth;
        maxWidth = itemWidth - (startLeft + triggerBorderWidth - getLeftByTime(currentScrollTime));
        $(document).mousemove(onJianjiMove).mouseup(stopJianjiMove);
      }).mouseup(stopJianjiMove);
    };
    getTpl = function(opt, _tpl) {
      var f;
      var pros = _tpl.match(/\{[^\{\}]*\}/g).join();
      for (f in opt) {
        if (pros.indexOf("{" + f + "}") > -1) {
          _tpl = _tpl.replaceAll("{" + f + "}", opt[f]);
        }
      }
      return _tpl;
    };

    resetSize = function(_width) { //_height

      if (!IX.browser.versions.mobile) {
        if (config.isProfessional && !menuToFloat) {
          $lwrap.width(_width - 52);
          itemWidth = _width - 52 - 40;
        } else {
          $lwrap.width(_width - 78);
          itemWidth = _width - 78 - 60;
        }

      } else {
        itemWidth = _width;
      }
      unitWidth_on_date = itemWidth / (24 * 3600000);
      unitWidth_on_hour = itemWidth / 3600000;

    };

    init = function() {
      player = cfg.player;
      $basecontainer = cfg.container;
      config = cfg.config;
      language = config.language;
      $container = $(getTpl(languages[language], tpl)).appendTo($basecontainer);
      $date_choosen_wrap = $container.find(".btn-group");
      $playlist = $container.find(".playlist");
      $hourlist = $container.find(".hour-list>ul");
      $scrollwrap = $container.find("div.scroll-wrap");
      $lwrap = $container.find("div.l-wrap");
      $timelineWrap = $container.find("div.timelines");
      $pause = cfg.menuwrap.find("div.menu.pause");
      $jianjimenu = cfg.menuwrap.find("div.menu.jianji");
      $jianjiops = $container.find("div.jianji-op .ops");

      $s_play_zhibo = cfg.menuwrap.find("div.menu.f-play-zhibo");
      $pro_video_live = cfg.menuwrap.find("div.menu.pro-video-live");
      $f_show_history = cfg.menuwrap.find("div.menu.f-show-history");

      $time_thumbnail = $container.find("a.time-thumbnail");

      currentTime = CURRENT_PROJECT_TIME * 1000;
      currentDate = new Date(currentTime);

      $timelineMain = $container.find(".timeline-main");
      if (IX.browser.versions.mobile) {
        $basecontainer["addClass"]("mobile-video");
        if (config.plugins.indexOf("ops") > -1) {
          isContainOps = true;
          // $container.hide();
        }
      }
      resetSize(config.width, config.height);
      if (config.menuFloat === "fixed") {
        $container.addClass("menu-float");
        $container.removeClass("menu-professional");
        menuToFloat = true;
      }
      if (config.isProfessional) {
        $container.addClass("menu-professional");
      }
      // $container.html(tpl.renderData("", _.extend({
      //   clz: [document.location.search.indexOf("s=1") > -1 ? "show-download" : ""].join(" "),
      //   id: IX.id()
      // }, languages[config.language])));

      player.registEvent("play-video-event");
      bindEvent();
      bindJianJiEvent();

      if (config.playType === "videoplay") {
        $container.find(".play-type-menus").hide();
        $container.find(".play-type-menus button.play-video").click();
      }
    };

    _model = {};
    init();
    return _model;
  };

  plugin.key = "video";
  plugin.menus = [{
    name: "video-pause",
    d: "left",
    clz: "pause",
    i_clz: "pic-pause",
    title: ""
  }, {
    name: "video-jianji",
    d: "right",
    clz: "jianji",
    i_clz: "pic-jianji",
    prev: "fullscreen",
    title: function(_language) {
      return languages[_language]['lp14'];
    }
  }, {
    name: "video-history-btn",
    d: "right",
    behind: "fullscreen",
    clz: "f-show-history",
    getMenu: function(_language, $menu) {
      $menu.append([
        '<button class="btn btn-default dropdown-toggle btn-show-history" type="button">',
        '<span class = "s-date"></span>',
        '<span class="caret"></span>',
        '</button>'
      ].join(""));
    }
  }, {
    name: "video-liveplay",
    d: "right",
    behind: "fullscreen",
    clz: "f-play-zhibo",
    getMenu: function(_language, $menu) {
      $menu.append('<button class = "s-play-zhibo enable"><span>' + languages[_language]["lp9"] + '</span></button>');
    }
  }, {
    name: "pro-video-live",
    d: "right",
    prev: "",
    clz: "pro-video-live",
    getMenu: function(_language, $menu) {
      $menu.append('<a class="histroy-play1"><i class="histroy-play2"></i></a>');
    }
  }];
  return plugin;
});