define(["app"], function(Services) {

  var LayoutManager = function() {

    var events = [], _model,
      currentWidthType;
    //var WIDTHS = [1400];
    var __scrollBarWidth = null;

    var getScrollBarWidth = function() {
      var scrollBarHelper;
      if (__scrollBarWidth) {
        return __scrollBarWidth;
      }

      scrollBarHelper = document.createElement("div");
      // if MSIE
      // 如此设置的话，scroll bar的最大宽度不能大于100px（通常不会）。
      scrollBarHelper.style.cssText = "overflow:scroll;width:100px;height:100px;";
      // else OTHER Browsers:
      // scrollBarHelper.style.cssText = "overflow:scroll;";
      document.body.appendChild(scrollBarHelper);
      if (scrollBarHelper) {
        __scrollBarWidth = {
          horizontal: scrollBarHelper.offsetHeight - scrollBarHelper.clientHeight,
          vertical: scrollBarHelper.offsetWidth - scrollBarHelper.clientWidth
        };
      }
      document.body.removeChild(scrollBarHelper);
      return __scrollBarWidth;
    };
    var refresh = function() {
      var i = 0;
      _model.currentWidth = document.documentElement.clientWidth + __scrollBarWidth.vertical;
      if (_model.currentWidth <= 1000) {
        currentWidthType = 300;
      } else if (_model.currentWidth < 1320) {
        _model.mainContentWidth = 980;
        currentWidthType = 100;
      } else if (_model.currentWidth > 1320) {
        _model.mainContentWidth = 1231;
        currentWidthType = 200;
      }
      if (currentWidthType === _model.widthType) {
        return;
      }
      _model.widthType = currentWidthType;
      while (events[i]) {
        try {
          events[i](_model.widthType);
          i++;
        } catch (ex) {
          events.splice(i, 1);
        }
      }
    };

    var init = function() {
      $(window).resize(function() {
        refresh();
      });
      getScrollBarWidth();
      refresh();
    };

    var bind = function(_e) {
      events.push(_e);
    };

    _model = {
      mainContentWidth: 0,
      widthType: 100,
      on: bind
    };

    init();

    return _model;
  };
  Services.service("LayoutManager", LayoutManager);
  return new LayoutManager();
});
