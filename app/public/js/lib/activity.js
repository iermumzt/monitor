define(function() {
  var ActivityManager = function(cfg) {
    var config = $.extend({
      data: null,
      plat: "mobile"
    }, cfg);
    var $container;
    var timeTrigger, passTime = 0,
      activityData;

    var bindData = function() {
      $container.css("background-color", activityData.option["backgroundColor"]);
      $container.find("a.main").attr("href", activityData.weburl || "#");
    };

    var bindEvent = function() {
      var loopFn = function() {
        if (passTime === 0) {
          $container.hide();
          return;
        }
        $container.find("a.pass span.time").html(passTime);
        timeTrigger = setTimeout(function() {
          passTime--;
          loopFn();
        }, 1000);
      };

      $container.find("a.pass").click(function() {
        if (timeTrigger) {
          clearTimeout(timeTrigger);
        }
        $container.hide();
      });

      $container.find("a.main").click(function() {
        _hmt.push(['_trackEvent', '首页闪屏', 'click', (activityData.name || activityData.title || '闪屏链接') + "：" + activityData.weburl, '']);
      });

      loopFn();
    };

    var init = function() {
      $container = $(".iermu-activity");
      activityData = config.data;
      if ($container.length === 0 || !activityData || activityData.error_code || !activityData.title) return;
      activityData.option = JSON.parse(activityData.option);

      if (activityData.currentTime >= activityData.endTime || activityData.currentTime < activityData.startTime) return;

      $("div.msbody").remove();
      passTime = activityData.option.passTime;

      $container.removeClass("hide");

      bindData();
      bindEvent();
    };

    init();
  };

  return ActivityManager;
});
