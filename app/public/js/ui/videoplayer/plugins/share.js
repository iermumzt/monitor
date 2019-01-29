define(function() {
  var languages = {
    "zh-cn": {
      "lpp83": "分享给好友",
      "lpp84": "分享给站外好友",
      "lpp85": "视频地址",
      "lpp86": "复制",
      "lpp87": "把视频贴到博客或论坛",
      "lpp88": "怎么贴",
      "lpp89": "通用代码",
      "lpp90": "转发到",
      "lpp91": "QQ空间",
      "lpp92": "新浪微博",
      "lpp93": "腾讯微博",
      "lpp94": "微信",
      "lpp95": "飞信",
      "lpp96": "天涯社区",
      "lpp97": "QQ好友",
      "lpp98": "百度贴吧",
      "lpp99": "网易微博",
      "lpp100": "宜信",
      "lpp101": "米聊",
      "lpp102": "豆瓣"
    },
    "en": {
      "lpp83": "Share with friends",
      "lpp84": "Share with off-site friends",
      "lpp85": "Video address",
      "lpp86": "Copy",
      "lpp87": "Put the video on the blog or BBS",
      "lpp88": "How to post",
      "lpp89": "Generic code",
      "lpp90": "Forwarded to the",
      "lpp91": "QQ空间",
      "lpp92": "新浪微博",
      "lpp93": "腾讯微博",
      "lpp94": "微信",
      "lpp95": "飞信",
      "lpp96": "天涯社区",
      "lpp97": "QQ好友",
      "lpp98": "百度贴吧",
      "lpp99": "网易微博",
      "lpp100": "宜信",
      "lpp101": "米聊",
      "lpp102": "豆瓣"
    }
  };
  var tpl_menu = [
    "<div class = 'find-div-body'><span class='sp1'></div>",
    "<div class = 'video-share-jiathis'>",
    '<div class="jiathis_style_32x32">',
    '<a class="jiathis_button_cqq" title="分享到QQ好友">',
    '</a>',
    '<a class="jiathis_button_tsina" title="分享到新浪微博">',
    '</a>',
    '<a class="jiathis_button_weixin" title="分享到微信">',
    '</a>',
    '<a class="jiathis_button_qzone" title="分享到QQ空间">',
    '</a>',
    '<a class="jiathis_button_tqq" title="分享到腾讯微博">',
    '</a>',
    '<a class="jiathis_button_tieba" title="分享到百度贴吧">',
    '</a>',
    '<a class="jiathis_button_douban" title="分享到豆瓣">',
    '</a>',
    '<a class="jiathis_button_feixin" title="分享到飞信">',
    '</a>',
    '<a class="jiathis_button_yixin" title="分享到易信">',
    '</a>',
    '<a class="jiathis_button_tianya" title="分享到天涯">',
    '</a>',
    '</div>',
    "</div>"
  ].join("");

  var tpl = [
    "<div class = 'share-detail'>",
    "<p>分享给站外好友：</p>",
    "<div>",
    "<label>视频地址：</label>",
    "<input type = 'text'  class = 'share-url'>",
    "<a for = 'share-url' class = 'copy'>复制</a>",
    "</div>",
    "<p>把视频贴到博客或论坛：<a href = '/support/#p2'>怎么贴？</a></p>",
    "<div>",
    "<label>通用代码：</label>",
    "<input type = 'text' class = 'share-code'>",
    "<a for = 'share-code' class = 'copy'>复制</a>",
    "</div>",
    "</div>"
  ].join("");

  var plugin = function(cfg) {
    var player, shareUrl;
    var jiathis_script = "<script type='text/javascript' src='http://v3.jiathis.com/code/jia.js' charset='utf-8'></script>";
    var $container, $basecontainer, $menuContainer, language = "zh-cn";
    var bindEvent = function() {
      $menuContainer.find("a.drop-handle").click(function() {
        $menuContainer.toggleClass("show-share-detail");
      });

      $menuContainer.find("a.copy").click(function() {
        $menuContainer.find("." + this.getAttribute("for")).select();
        document.execCommand("Copy");
        AppLog.success("复制成功。现在您可以粘贴（ctrl+v）到博客或论坛中了。");
      });

      player.on(plugin.key, "data-binded", function(_deviceInfo) {
        window.jiathis_config = {
          url: shareUrl,
          summary: _deviceInfo.description,
          title: _deviceInfo.description,
          shortUrl: false,
          hideMore: true
        };
        $menuContainer.find(".jiathis_style_32x32").after(jiathis_script);
        $menuContainer.find(".share-right").after(jiathis_script);
      });
    };
    var getTpl = function(opt, _tpl) {
      var f ;
      var pros = _tpl.match(/\{[^\{\}]*\}/g).join();
      for (f in opt) {
        if (pros.indexOf("{" + f + "}") > -1) {
          _tpl = _tpl.replace("{" + f + "}", opt[f]);
        }
      }
      return _tpl;
    };
    var init = function() {
      shareUrl = document.location.origin + document.location.pathname;
      $basecontainer = cfg.container;
      language = cfg.config.language;

      $menuContainer = $basecontainer.find(".video-ops .share div");
      $menuContainer.addClass("show-share-ops").append(tpl_menu);

      $container = $(tpl).appendTo($menuContainer);

      $container.find("input.share-url").val(shareUrl);
      $container.find("input.share-code").val('<iframe height="360" width="640" src = "' + shareUrl + '"  frameborder=0 allowfullscreen></iframe>');

      player = cfg.player;
      bindEvent();
    };

    var _model = {};
    init();
    return _model;
  };

  plugin.key = "share";

  return plugin;
});
