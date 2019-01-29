define(["jquery"], function() {
  var ArrowPager;
  var arrowTpl = ["<ul class='zbase-ui switch-ctrl'>",
    "<a class='prev'><i class='wc-mpic-left_btn'><span></span></i></a>",
    "<a class='next'><i class='wc-mpic-right_btn'><span></span></i></a>",
    " </ul>"
  ].join("");

  ArrowPager = function(cfg) {
    var config = $.extend(true, {
      container: null,
      containerImg: null,
      licounts: 3,
      time: 5000,
      delaytime: 0,
      //isAutoExe: true,    
      onPageChanged: function() { 
        // empty;
      }, //删除括号中的_current,_prev;
      onPageMoved: function() {
        // emtpy;
      },
      touchArea: null,
      isTiming: true,
      autoTiming: true,
      isShow: true,
      isGo: false,
      isTransition: false,
      transitionContainer: null,
      transitionTime: 600
    }, cfg);
    var $container, $pagination, $touchArea;
    var currentIndex = 0;
    var afterIndex = -1;
    var count;
    var timeTrigger;
    var tag = -1;
    var flag = 0;
    var init,setIndex,indexChange,bindEvent,timingTask,stopTimingTask,_model;
    init = function() {
      var _html = "";
      var i;
      $container = $(config.container);
      $pagination = $(arrowTpl).appendTo($container);
      $touchArea = $(config.touchArea)[0];
      count = config.licounts;
      if (count < 0) {
        return;
      }
      for (i = 1; i <= count; i++) {
        if (i === 1) {
          _html += "<li class='active' _index = '" + i + "'></li>";
        } else {
          _html += "<li _index = '" + i + "'></li>";
        }
      }
      $pagination.find(".prev").after(_html);

      if (!config.isShow) {
        $pagination.hide();
      }
      bindEvent();
    };

    setIndex = function(currentIndex, afterIndex) {
      $pagination.find("li").eq(currentIndex).addClass('active').siblings().removeClass('active');
      config.onPageChanged(currentIndex, afterIndex);
      flag = flag + 1;
    };

    indexChange = function(_clickIndex) {
      var indexc;
      if (tag === 0) { //点击向左按钮或者向左滑动
        indexc = (currentIndex - 1) < 0 ? count - 1 : currentIndex - 1;
      } else if (tag === 1 || tag === 3) { //点击向右按钮或者向右滑动
        indexc = (currentIndex + 1) > (count - 1) ? 0 : currentIndex + 1;
      } else if (tag === 2 && _clickIndex !== -1) { //点击组件圆点
        indexc = _clickIndex;
      } else {
        return;
      }

      if (tag !== 3 && !config.isGo) {
        stopTimingTask();
      }
      afterIndex = currentIndex;
      if (indexc === currentIndex) {
        return;
      }
      currentIndex = indexc;
      setIndex(currentIndex, afterIndex);

    };
    bindEvent = function() {
      var $target;
      var lastClickTime = new Date().getTime();
      var delay = config.transitionTime; // transition的延迟
      var startPos, endPos;
      var touchArea ;
      if (config.transitionContainer) {
        config.transitionContainer.click(function(e) {
          if (config.isTransition) {
            stopTimingTask();
            if (new Date().getTime() - lastClickTime < delay) {
              setTimeout(function() {
                timingTask();
              }, 600);
              return;
            }
            lastClickTime = new Date().getTime();
            timingTask();
          }
          $target = $(e.target || e.srcElement);
          if ($target.is("i.homepic-lbz")) {
            tag = 0;
          } else if ($target.is("i.homepic-lby")) {
            tag = 1;
          } else {
            return;
          }
          indexChange(-1);
        });
      }

      $pagination.click(function(e) {
        var $target,clickIndex;
        if (config.isTransition) {
          stopTimingTask();
          if (new Date().getTime() - lastClickTime < delay) {
            setTimeout(function() {
              timingTask();
            }, 600);
            return;
          }
          lastClickTime = new Date().getTime();
          timingTask();
        }

        $target = $(e.target || e.srcElement);
        if ($target.is("i.wc-mpic-left_btn") || $target.is("i.wc-mpic-left_btn span")) {
          tag = 0;
        } else if ($target.is("i.wc-mpic-right_btn") || $target.is("i.wc-mpic-right_btn span")) {
          tag = 1;
        } else if ($target.is("li")) {
          tag = 2;
          clickIndex = Number($target.attr("_index")) - 1;
        } else {
          return;
        }
        indexChange(clickIndex);
      });

      if (config.isTiming && config.autoTiming) {
        timingTask();
      }

      if (config.containerImg) {
        config.containerImg.each(function() {
          var clickIndex;
          var $this = $(this);
          $this.click(function() {
            if ($this.is(".active")) {
              return;
            }
            config.containerImg.removeClass("active");
            $this.addClass("active");
            //var t = currentIndex;
            clickIndex = config.containerImg.index(this);
            //clearTimeout(timeTrigger);
            tag = 2;
            //config.onPageChanged(currentIndex, t);
            indexChange(clickIndex);
          });
        });
      }
      touchArea = {
        // 判断设备是否支持touch事件
        isTouch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch,
        slider: $touchArea,
        // 事件
        events: {
          slider: $touchArea, // this为slider对象
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
              y: touch.clientY,
              time: +new Date()
            };

            // 绑定事件
            this.slider.addEventListener('touchmove', this, false);
            this.slider.addEventListener('touchend', this, false);
            if (config.isTransition) {
              stopTimingTask();
            }
          },
          // 移动
          move: function(event) { // 当屏幕有多个touch或者页面被缩放过，就不执行move操作
            var touch,isScrolling;
            if (event.touches.length > 1 || event.scale && event.scale !== 1) {
              return;
            }
            touch = event.touches[0];
            endPos = {
              x: touch.pageX - startPos.x, //
              y: touch.clientY - startPos.y
            };
            isScrolling = Math.abs(endPos.x) < Math.abs(endPos.y) ? 1 : 0; //isScrolling为1时，表示纵向滑动，0为横向滑动
            if (isScrolling === 0) {
              //console.log(Math.abs(endPos.y));
              event.preventDefault(); // 阻止触摸事件的默认动作,即阻止滚屏
              config.onPageMoved(endPos.x);
            }
          },
          // 滑动释放
          end: function() { //event
            var duration = +new Date() - startPos.time; // 滑动的持续时间
            //this.icon[this.index].className = '';
            if (config.isTransition) {
              if (new Date().getTime() - lastClickTime < delay) {
                setTimeout(function() {
                  timingTask();
                }, 600);
                return;
              }
              lastClickTime = new Date().getTime();
              timingTask();
            }
            if (Number(duration) <= 100 || Math.abs(endPos.x) < 20 || Math.abs(endPos.y) > 20) {
              return;
            }
            if (endPos.x > 20) {
              tag = 0;
            } else if (endPos.x < -20) {
              tag = 1;
            }

            indexChange(-1);
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
            this.slider.addEventListener('touchstart', self.events, false);
          }
        }
      };
      if (config.touchArea) {
        touchArea.init();
      }
    };

    timingTask = function() {
      stopTimingTask();
      timeTrigger = setTimeout(function() {
        //currentIndex = (currentIndex + 1) > (count - 1)  ? 0 : currentIndex + 1;
        tag = 3;
        //console.log(currentIndex);
        indexChange(-1);
        timingTask();
      }, config.time);
    };

    stopTimingTask = function() {
      if (timeTrigger)
        clearTimeout(timeTrigger);
    };
    getCurrentIndex = function(){
      return currentIndex;
    }
    _model = {
      timingTask: timingTask,
      stopTimingTask: stopTimingTask,
      getCurrentIndex:getCurrentIndex
    };
    init();
    return _model;

  };

  return ArrowPager;
});
