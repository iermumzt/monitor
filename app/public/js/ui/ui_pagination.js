define(["IX"], function() {
  var languages = {
    "zh-cn": {
      "lp1": "第",
      "lp2": "条",
      "lp3": "上一页",
      "lp4": "下一页"
    },
    "en": {
      "lp1": "",
      "lp2": "",
      "lp3": "prev",
      "lp4": "next"
    }
  };
  var tpl = new IX.ITemplate({
    tpl: [
      "<nav class = 'zbase-ui pagination {clz}'>",
      "<p>{lp1}<span class = 'start-page'></span>-<span class = 'end-page'></span>{lp2}/<span class = 'sum-count'></span>{lp2}</p>",
      "<ul class = 'pager'>",
      "<li class = 'prev'><a>{prevLabel}</a></li>",
      "<li class = 'next'><a>{nextLabel}</a></li>",
      "</ul>",
      "</nav>"
    ]
  });

  var numberTpl = new IX.ITemplate({
    tpl: ["<li class = 'n' _index = '{i}'><a>{i}</a></li>"]
  });

  var Pagination = function(cfg) {
    var config = _.extend({
      container: null,
      pageSize: 10,
      dataCount: 0,
      type: 1,
      closeNums: 2,
      align: "center",
      language: "zh-cn",
      beginIndex: 1,
      onPageChanged: function() {/**/}
    }, cfg);


    var $container, $pagination, $prev, $next, $p;
    var currentIndex = 0,
      pageCount = 1,
      pageSize = 1,
      count = 0;

    var types = {
      1: "",
      2: "pagination-2",
      3: "pagination-3",
      4: "pagination-4"
    };


    var renderPageInfo = function() {
      pageCount = Math.max(Math.ceil(count / pageSize), 1);
    };

    

    var renderPageItems = function(_currentPage) {
      var _html = numberTpl.renderData("", {
        i: 1
      });

      var currentPage = _currentPage,
        pageItemCount = 5 + 2 * config.closeNums, i, minIndex, maxIndex;

      $prev.removeClass("disabled");
      $next.removeClass("disabled");
      if (currentIndex === 0) {
        $prev.addClass("disabled");
      }
      if (currentIndex === pageCount - 1) {
        $next.addClass("disabled");
      }
      $p.find("span.sum-count").text(count);
      $p.find("span.start-page").text((currentPage - 1) * pageSize + 1);
      $p.find("span.end-page").text(Math.min(currentPage * pageSize, count));
      if (pageCount <= pageItemCount) {
        for (i = 2; i <= pageCount; i++) {
          _html += numberTpl.renderData("", {
            i: i
          });
        }
      } else {
        minIndex = currentPage - config.closeNums;
        maxIndex = currentPage + config.closeNums;

        if (minIndex - 1 < 3) {
          for (i = 2; i <= pageItemCount - 2; i++) {
            _html += numberTpl.renderData("", {
              i: i
            });
          }
        } else {
          _html += "<li class = 'prevs'><a>...</a></li>";

          if (pageCount - maxIndex > 3) {
            for (i = minIndex; i <= maxIndex; i++) {
              _html += numberTpl.renderData("", {
                i: i
              });
            }
          } else {
            for (i = pageCount - (pageItemCount - 3); i < pageCount; i++) {
              _html += numberTpl.renderData("", {
                i: i
              });
            }
          }
        }
        if (pageCount - maxIndex >= 3) {
          _html += "<li class = 'nexts'><a>...</a></li>";
        }
        _html += numberTpl.renderData("", {
          i: pageCount
        });
      }

      $container.find(".n, .nexts, .prevs").remove();
      if (config.type === 3) {
        $prev.before(_html);
      } else {
        $prev.after(_html);
      }
      $container.find(".n[_index='" + currentPage + "']").addClass("selected");
    };

    var bindEvent = function() {
      $pagination.click(function(e) {
        var $target = $(e.target || e.srcElement),
          _index, _tempIndex;
        if ($target.closest("li.next").length > 0) {
          _index = Math.min(currentIndex + 1, pageCount - 1);
        } else if ($target.closest("li.prev").length > 0) {
          _index = Math.max(currentIndex - 1, 0);
        } else {
          $target = $target.closest("li.n");
          if ($target.length === 0) {
            return;
          }
          _index = Number($target.attr("_index")) - 1;
        }
        if (_index === currentIndex) {
          return;
        }
        _tempIndex = _index;
        _index = currentIndex;
        currentIndex = _tempIndex;
        renderPageItems(currentIndex + 1);
        config.onPageChanged(currentIndex + config.beginIndex, _index);
      });
    };
    var init = function() {
      config = _.extend({
        prevLabel: config.type === 2 ? "&lt;" : languages[config.language]["lp3"],
        nextLabel: config.type === 2 ? "&gt;" : languages[config.language]["lp4"],
        align: "right"
      }, config);
      $container = $(config.container);

      $pagination = $(tpl.renderData("", _.extend({
        prevLabel: config.prevLabel,
        nextLabel: config.nextLabel,
        clz: types[config.type] || ""
      }, languages[config.language]))).appendTo($container);

      $p = $pagination.find("p");

      $prev = $pagination.find("li.prev");
      $next = $pagination.find("li.next");

      pageSize = config.pageSize;
      count = config.dataCount;

      renderPageInfo();

      bindEvent();
    };

    var _model = {
      get: function() {
        return {
          pageSize: pageSize,
          pageIndex: currentIndex + config.beginIndex
        };
      },
      set: function(_cfg) {
        if ("pageIndex" in _cfg) {
          currentIndex = Number(_cfg.pageIndex);
          if (config.beginIndex === 1) {
            currentIndex--;
          }
        }
        if ("pageSize" in _cfg) {
          pageSize = Number(_cfg.pageSize);
        }
        if ("count" in _cfg) {
          count = Number(_cfg.count);
        }
        renderPageInfo();
        currentIndex = Math.min(currentIndex, pageCount - 1);
        currentIndex = Math.max(currentIndex, 0);
        renderPageItems(currentIndex + 1);
      }
    };
    init();
    return _model;
  };


  return Pagination;
});
