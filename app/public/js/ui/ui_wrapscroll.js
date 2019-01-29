define([], function() {

  /*
    需要实现的效果：
    1. 左滑动、右滑动时的带有惯性的滚动效果
    2. 当按住不放手滑动时，按照固定位移滑动
    3. 当滑动时，突然按住，停在按住的位置
    4. 当超出菜单范围时，自动快速归位
  */
  var WrapScroller = function(cfg) {
    var config = _.extend({
      container: null,
      width: "auto"
    }, cfg);

    var $container, $parent;

    var start = false,
      startTransformX = 0,
      startTime, has_animate = false;
    var startTouchX = 0,
      endTouchX = 0;
    var transformX = 0,
      is_animate = false,
      animateTrigger;
    var time = 200,
      min_time = 0.2;
    //var d_padding = 2;

    var getTouch = function(e) {
      if (e.touches) {
        return e.touches[0];
      } else if (e.originalEvent) {
        if (e.originalEvent.touches && e.originalEvent.touches.length > 0) {
          return e.originalEvent.touches[0];
        }
        return e.originalEvent.changedTouches[0];
      }
      return null;
    };
    var onTouchStart = function(e) {
      if (animateTrigger) {
        clearTimeout(animateTrigger);
      }
      start = true;

      if (is_animate) {
        is_animate = false;

      }
      startTouchX = getTouch(e).pageX;
      startTransformX = transformX;
      startTime = new Date().getTime();

    };
    var onTouchMove = function(e) {
      var x;
      if (!start) {
        return;
      }
      x = getTouch(e).pageX;
      transformX = (x - startTouchX + startTransformX);
      $container.css({
        "transition-duration": "50ms",
        "transform": "translate(" + transformX + "px, 0px) scale(1) translateZ(0px)"
      });
      return false;
    };

    var check_scroll = function(_tx) {
      var min = $parent.width() - config.width;
      return _tx > 0 ? 1 : _tx < min ? 2 : 0;
    };

    var setTransform = function(_tx, _time, no_check) {
      var _check_scroll, min;
      _tx = _tx === undefined ? transformX : _tx;
      _time = _time === undefined ? min_time : _time;

      _check_scroll = check_scroll(_tx);
      min = $parent.width() - config.width;
      if (!no_check) {
        if (_check_scroll === 1) {
          _tx = 0;
          _time = min_time;
        } else if (_check_scroll === 2) {
          _tx = min;
          _time = min_time;
        }
      } else {
        if (_check_scroll === 1) {
          _tx = 50;
        } else if (_check_scroll === 2) {
          _tx = min - 50;
        }
      }
      transformX = _tx;
      $container.css({
        "transition-duration": _time + "s",
        "transform": "translate(" + _tx + "px, 0px) scale(1) translateZ(0px)"
      });
      return _time;
    };
    var onTouchEnd = function(e) {
      var dx, endTime, d_time, _check_scroll, x;
      start = false;
      endTouchX = getTouch(e).pageX;
      dx = endTouchX - startTouchX;
      if (Math.abs(dx) <= 20) {
        return setTransform();
      }

      endTime = new Date().getTime();
      d_time = endTime - startTime;
      has_animate = d_time <= time;

      if (has_animate) {
        is_animate = true;
        //var dd = d_time * d_padding / time;
        _check_scroll = check_scroll(transformX);
        if (_check_scroll !== 0) {
          return setTransform();
        }

        x = dx + dx * (Math.abs(dx) / 20) + startTransformX;
        transformX = x;
        setTransform(transformX, 0.6, true);

        animateTrigger = setTimeout(function() {
          is_animate = false;
          setTransform();
        }, 600);
      } else {
        return setTransform();
      }

    };

    var toggleEvent = function(_bindEvent) {
      $container[_bindEvent ? "bind" : "unbind"]({
        touchstart: onTouchStart,
        touchmove: onTouchMove,
        touchend: onTouchEnd
      });
      if (_bindEvent) {
        $container.addEventListener("touchstart", onTouchStart, false);
        $container.addEventListener("touchmove", onTouchMove, false);
        $container.addEventListener("touchend", onTouchEnd, false);
      } else {
        $container.removeEventListener("touchstart", onTouchStart, false);
        $container.removeEventListener("touchmove", onTouchMove, false);
        $container.removeEventListener("touchend", onTouchEnd, false);
      }
    };

    var init = function() {
      var width;
      $container = $(config.container);
      $parent = $container.parent();
      
      width = config.width === "auto" ? $container.outerWidth() : config.width;
      $container.css({
        width: width + "px",
        "transition-duration": "0s",
        "transition-property": "transform",
        "transform-origin": "0px 0px 0px",
        "transform": "translate(0px, 0px) scale(1) translateZ(0px)"
      });
    };

    var _model = {
      toggleEvent: toggleEvent,
      setScroll: function(_d_left) {
        setTransform(-1 * (_d_left - $parent.width() / 2), 0);
      }
    };

    init();

    return _model;
  };


  return WrapScroller;
});
