define(["js/callserver/cservice", "js/ui/ui_dialog", "oauth", "zbase",  "js/ui/swfobject", "js/ui/blsplayer", "ui_datetimepicker", "ui_datetimepicker_zhcn"], function(CallServer, Dialog, OAuth) {//, ZBase
  var strfu = window.location.href;
  var languages = {
    "zh-cn": {
      "lp1": "您还未购买云台配件哦！",
      "lp2": "放大",
      "lp3": "快来购买，体验想看哪里看哪里！",
      "lp4": "缩小",
      "lp5": "全屏",
      "lp6": "设置",
      "lp7": "分享设置",
      "lp8": "剪辑",
      "lp9": "看直播",
      "lp10": "手动操作",
      "lp11": "关闭云台",
      "lp12": "静音",
      "lp13": "音量",
      "lp14": "暂停",
      "lp15": "看录像",
      "lp16": "云台",
      "lp17": "调整时间刻度",
      "lp18": "剪辑时长：",
      "lp19": "保存",
      "lp20": "下载",
      "lp21": "取消",
      "lp22": "全天",
      "lp23": "公开分享",
      "lp24": "私密分享",
      "lp25": "分享录像",
      "lp26": "关闭分享",
      "lp27": "分享链接：",
      "lp28": "确定",
      "lp29": "关闭",
      "lp30": "双击画面,点哪转哪儿",
      "lp31": "正在自动旋转,帮您多角度观看",
      "lp32": "星期",
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
      "lp43": "分享设置",
      "lp44": "分享声明:建议您在使用分享录像之前,请务必仔细阅读本条款.分享录像,该视频将会以加密链接的形式分享给好友,获得链接的好友可以观看视频内容!请自我确定分享视频内容健康不触犯法律,如发现视频内容违反国家有关法律及被网友举报,该视频将在审核后被自动关闭分享.您是否同意以上条款?",
      "lp45": "我的云摄像头给你看了哦~    亲!快过来、快过来看看呀!大家快来看啊,这是我自己的“i耳目”云摄像头,我把视频分享给大家,里面有你想要知道的惊喜哦~",
      "lp46": "我的云摄像头分享啦!~",
      "lp47": "分享到：",
      "lp48": "QQ好友",
      "lp49": "微信",
      "lp50": "新浪微博",
      "lp51": "禁止创建共享！",
      "lp52": "分享关闭成功！",
      "lp53": "保存成功!",
      "lp54": "分",
      "lp55": "秒",
      "lp56": "保存到云盘",
      "lp57": "请输入想保存的文件名：",
      "lp58": "没有剪辑录像权限",
      "lp59": "剪辑失败,请重试",
      "lp60": "已经有其他剪辑任务正在进行中",
      "lp61": "剪辑任务不存在",
      "lp62": "获取剪辑任务信息失败",
      "lp63": "本地下载",
      "lp64": "自动旋转",
      "lp65": "视频片段",
      "lp66": "剪辑视频时长：",
      "lp67": "设备已取消分享！",
      "lp68": "设备已离线！",
      "lp69": "超出剪辑容量",

      "lp70": "更多",
      "lp71": "zh",
      "lp72": "点",
      "lp73": "加载中",

      "lpp70": "我要举报公共摄像机",
      "lpp71": "请选择举报原因：",
      "lpp72": "色情低俗",
      "lpp73": "政治谣言",
      "lpp74": "侵害隐私",
      "lpp75": "广告骚扰",
      "lpp76": "诽谤他人",
      "lpp77": "其它",
      "lpp78": "提交",
      "lpp79": "收藏",
      "lpp80": "已收藏",
      "lpp81": "举报",
      "lpp82": "已举报",
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
      "lpp102": "豆瓣",

      "lpp104": "请登陆",
      "lpp105": "提交成功",
      "lpp106": "请选择举报原因：",
      "lpp107": "万",
      "lpp108": "登录才能执行此操作",
      "lpp109": "要登录吗？",
      "lpp110": "登录",
      "lpp111": "取消",
      "lpp112": "分享描述",
      "lp113": "保存录像"
    },
    "en": {
      "lp1": "You did not buy the PTZ accessories.",
      "lp2": "Zoom In",
      "lp3": "Come and buy, experience to see where to see where!",
      "lp4": "Zoom Out",
      "lp5": "Full Screen",
      "lp6": "Set Up",
      "lp7": "Shared Settings",
      "lp8": "Clip",
      "lp9": "Live",
      "lp10": "Manual",
      "lp11": "Close PTZ",
      "lp12": "Mute",
      "lp13": "Volume",
      "lp14": "Pause",
      "lp15": "Video",
      "lp16": "PTZ",
      "lp17": "Adjust",
      "lp18": "Time:",
      "lp19": "Save",
      "lp20": "Download",
      "lp21": "Cancel",
      "lp22": "All day",
      "lp23": "Publicly shared",
      "lp24": "Private sharing",
      "lp25": "Video sharing",
      "lp26": "Close sharing",
      "lp27": "Share link",
      "lp28": "OK",
      "lp29": "Close",
      "lp30": "Double click the picture, the point where to turn.",
      "lp31": "Automatically rotating, to help you more than a point of view",
      "lp32": "",
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
      "lp43": "Shared Settings",
      "lp44": "Share statement: You are advised to read this article carefully before you use the video to share video, the video will be encrypted link to the form of a friend, to get the link to watch video content, please self determined to share video content health is not violated laws, such as video content is in violation of the relevant laws and users report, the video will be automatically shut down after the audit.",
      "lp45": "I've shared it with the cloud camera.   Come on, come and see! we come see ah, this is my own \"I spy\" cloud camera, I put the video to share with you, which you want to know the surprise.",
      "lp46": "I shared my cloud camera.",
      "lp47": "Shared:",
      "lp48": "QQ friends",
      "lp49": "WeChat",
      "lp50": "Sina Weibo",
      "lp51": "Prohibit creating shared",
      "lp52": "Close to share success",
      "lp53": "Save success",
      "lp54": "min",
      "lp55": "s",
      "lp56": "Save to the cloud disk.",
      "lp57": "Please enter the file name you want to save",
      "lp58": "You don't have the rights to edit video.",
      "lp59": "Clip failed, please try again.",
      "lp60": "There are editing tasks being carried out.",
      "lp61": "Editing tasks do not exist.",
      "lp62": "Get the clip task information failure",
      "lp63": "Local download",
      "lp64": "Automatic",
      "lp65": "Video clip",
      "lp66": "Video clip time:",
      "lp67": "Equipment has been canceled to share!",
      "lp68": "Camera has been offline!",
      "lp69": "Out of clip capacity",
      "lp70": "More",
      "lp71": "en",
      "lp72": "",
      "lp73": "Loading",
      "lpp70": "I want to report a public video camera",
      "lpp71": "Please select a report:",
      "lpp72": "Pornographic vulgarity",
      "lpp73": "Political rumors",
      "lpp74": "Violation of privacy",
      "lpp75": "The ads",
      "lpp76": "Calumny others",
      "lpp77": "other",
      "lpp78": "submit",
      "lpp79": "collection",
      "lpp80": "Already collected",
      "lpp81": "Report",
      "lpp82": "Has been reported",
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
      "lpp102": "豆瓣",
      "lpp103": "转发到",
      "lpp104": "Please login!",
      "lpp105": "Submitted successfully",
      "lpp106": "Please select a report:",
      "lpp107": "w",
      "lpp108": "Log in to perform this operation ",
      "lpp109": "To log in? ",
      "lpp110": " log in",
      "lpp112":"Share description",
      "lp113": "Save video"

    }
  };

  var mobile_yuntai_tpl = [

        "<div class = 'yuntaiops'>",
          "<div class = 'yuntaiops-auto'>",
              "<i class = 'pic-cloud-auto'></i>",
              "<span></span>",
          "</div>",          "<div class = 'yuntaiops-manua'>",
            "<i class = 'pic-cloud-manua'></i>",
            "<span></span>",
          "</div>",
          "<div class = 'yuntaiops-close'>",
              "<i class = 'pic-cloud-op'></i>",
              "<span></span>",
          "</div>",
        "</div>"
  ].join("");

  var bottom_controller_tpl = [
        '<div class="video-op bottom-controller">',
          "<div class = 'bc-menu btn-history'>",
            '<button class="btn btn-default dropdown-toggle btn-show-history" type="button">',
              '<span class = "s-date"></span>',
              '<span class="caret"></span>',
            '</button>',
          "</div>",
          "<div class = 'bc-menu fullscreen'>",
            "<a class = 'e-fullscreen' title='{lp5}'><i class = 'pic-fullscreen'></i></a>",
          "</div>",
          "<div class = 'bc-menu config'>",
            "<a class = 'e-config' title='{lp6}'><i class = 'pic-config'></i></a>",
          "</div>",
          "<div class = 'bc-menu share'>",
            "<a class = 'e-share-config' title='{lp7}'><i class = 'pic-share-config'></i></a>",
          "</div>",
          "<div class = 'bc-menu jianji'>",
            "<a class = 'e-jianji' title='{lp8}'><i class = 'pic-jianji'></i></a>",
          "</div>",
          "<div class = 'bc-menu splay-zhibo'>",
            '<button class = "s-play-zhibo enable"><span>{lp9}</span></button>',
          "</div>",
          "<div class = 'bc-menu yuntai'>",
            '<a class = "e-cloud-config" title="{lp16}"><i class = "pic-cloud-op"></i></a>',
            '<div class = "cloud-op">',
              '<ul>',
                '<li _v="1" class="manua"><span></span>{lp10}</li>',
                '<li _v="2"><span></span>{lp64}</li>',
                '<li _v="3" class="ns"><span></span>{lp11}</li>',
                '<div class="f"><span class="sp1"> </span></div>',
              '<ul>',
            '</div>',
          "</div>",
          '<div class="bc-menu volume-op enable">',
            '<a title="{lp12}"><i class = "pic-p1"></i></a>',
            '<div class="volume-wrap">',
              '<a></a>',
              '<div class="volume-bar" title="{lp13}">',
              '</div>',
            '</div>',
          '</div>',
          "<div class = 'bc-menu pause'>",
            "<a class = 'e-pause' title='{lp14}'><i class = 'pic-p1'></i></a>",
          "</div>",
        '</div>'
  ].join("");

  var size_controller_tpl = [
    '<div class="video-op size-controller">',
        "<button title='{lp2}' type = 'button' class = 'bigger'><i class = 'pic-p1'></i></button>",
        '<div>',
          '<span class = "size"></span>',
        '</div>',
        '<button title="{lp4}" type = "button" class = "smaller"><i class = "pic-p1"></i></button>',
    '</div>'
  ].join("");

  var video_exts_tpl = [
    "<div class = 'video-op video-exts'>",
          "<div class = 'opacity-bg'></div>",
          '<div class = "time-list-wrap">',
          "<div class = 'play-type-menus'>",
          "<button class = 'play-video'><span>{lp15}</span></button>",
      "<button class = 'play-zhibo enable'><span>{lp9}</span></button>",
      "</div>",
      "<a class = 'mtime-list-menu-wrap'>",
      "<span class = 'tt'>{lp17}</span>",
      "</a>",
      "<div class = 'time-list-menu-wrap'>",
      '<button class="btn btn-default dropdown-toggle btn-time-list" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">',
      "<span class = 'tt'>{lp17}</span>",
      "<span class='caret'></span>",
      '</button>',
      "</div>",
      "</div>",
      '<div class="timeline">',
      "<a class = 'prev'></a>",
      "<a class = 'next'></a>",
      "<div class = 'l-wrap'>",
      "<a class = 'left-d'></a>",
      "<a class = 'right-d'></a>",
      "<div class = 'scroll-wrap'>",
      '<a class = "m-time-tip"><span class="fulltime">2016-12-12 21:00</span></a>',
      "<div class = 'timeline-main'>",
      "<div class = 'tmleft'>",
      "<div class='tmplaylist'></div>",
      '<img src="/public/images/timeline_loop.png">',
      "</div>",
      '<div class = "timeline-wrap">',
      '<a class = "drag-trigger hidden"><i class = "pic-p1"></i></a>',
      '<a class = "time-tip">21:00</a>',
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
      "<div class = 'fns '>",
      "<div class = 'fn-play'>",
      "<span class = 'ico'>",
      "<i class = 'pic-playstat'></i>",
      "</span>",
      "<span class = 'stat'>",
      "",
      "</span>",
      "</div>",
      "<a class = 'fn-updown'>",
      "<span class = 'ico'>",
      "<i class = 'pic-playdown'></i>",
      "<i class = 'pic-updown'></i>",
      "</span>",
      "<span class = 'stat'>",
      "",
      "</span>",
      "</a>",
      "<div class = 'fn-collect'>",
      "<a class = 'nocollect'>",
      "<span class = 'ico'>",
      "<i class = 'pic-collect'></i>",
      "</span>",
      "<span class = 'stat'>{lpp79}</span>",
      "</a>",
      "<a class = 'collect'>",
      "<span class = 'ico'>",
      "<i class = 'pic-collect'></i>",
      "</span>",
      "<span class = 'stat'>{lpp80}</span>",
      "</a>",
      "</div>",
      "<div class = 'fn-warning'>",
      "<a class = 'nowarning'>",
      "<span class = 'ico'>",
      "<i class = 'pic-warning'></i>",
      "</span>",
      "<span class = 'stat'>{lpp81}</span>",
      "</a>",
      "<a class = 'warning'>",
      "<span class = 'ico'>",
      "<i class = 'pic-warning'></i>",
      "</span>",
      "<span class = 'stat'>{lpp82}</span>",
      "</a>",
      "</div>",
      "<div class = 'fn-splite2'>",
      "</div>",
      "<div class = 'fn-share'>",
      "<div class = 'share fn-hover'>",
      "<div class = 'fn'>",
      "<ul class = 'shares'>",
      "<li class='one'>",
      "<a href = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=http%3A%2F%2Fwww.jiathis.com%2F%23jtss-qzone&title=JiaThis+-+中国最大的社会化分享按钮及分享代码提供商！&pics=http%3A%2F%2Fblog.jiathis.com%2Fwp-content%2Fuploads%2F2013%2F02%2Fjtweixin.jpg&summary='>",

      "<span class = 'ico'>",
      "<i class = 'pic-qzone'></i>",
      "</span>",
      "</a>",
      "</li>",
      "<li>",
      "<a href = 'http://connect.qq.com/widget/shareqq/index.html?url=http%3A%2F%2Fwww.jiathis.com%2F%23jtss-cqq&showcount=0&desc=JiaThis+-+中国最大的社会化分享按钮及分享代码提供商！&summary=JiaThis+-+中国最大的社会化分享按钮及分享代码提供商！&title=JiaThis+-+中国最大的社会化分享按钮及分享代码提供商！&site=jiathis&pics=http%3A%2F%2Fblog.jiathis.com%2Fwp-content%2Fuploads%2F2013%2F02%2Fjtweixin.jpg'>",

      "<span class = 'ico'>",
      "<i class = 'pic-qq'></i>",
      "</span>",
      "</a>",
      "</li>",
      "<li>",
      "<a href = 'http://s.jiathis.com/?webid=weixin&url=http%3A%2F%2Fwww.jiathis.com%2F&title=JiaThis%20-%20中国最大的社会化分享按钮及分享代码提供商！提供最全面的分享按钮代码及最精准的数据统计服务，通过访客不...&isexit=false'>",

      "<span class = 'ico'>",
      "<i class = 'pic-weixin'></i>",
      "</span>",
      "</a>",
      "</li>",
      "<li>",
      "<a href = 'http://share.v.t.qq.com/index.php?c=share&a=index&title=JiaThis+-+中国最大的社会化分享按钮及分享代码提供商！%20&url=http%3A%2F%2Fwww.jiathis.com%2F%23jtss-tqq&appkey=ce15e084124446b9a612a5c29f82f080&site=www.jiathis.com&pic=http%3A%2F%2Fblog.jiathis.com%2Fwp-content%2Fuploads%2F2013%2F02%2Fjtweixin.jpg'>",

      "<span class = 'ico'>",
      "<i class = 'pic-weibo'></i>",
      "</span>",
      "</a>",
      "</li>",
      "</ul>",
      "<div class='jiathis_style_32x32'>",
      " <a class='jiathis_button_qzone'></a>",
      " <a class='jiathis_button_cqq' ></a>",
      "<a class='jiathis_button_weixin' ></a>",
      " <a class='jiathis_button_tsina' ></a>",
      "</div>",
      "<script type='text/javascript' src='http://v3.jiathis.com/code/jia.js' charset='utf-8'></script>",
      "<span class ='friend'>{lpp83}</span>",
      "</div>",
      "<div class = 'fn-handle'>",
      "<a>",
      "<i class = 'pic-drophandle'></i>",
      "<i class = 'pic-uphandle'></i>",
      "</a>",
      "</div>",
      "</div>",
      "</div>",
      "</div>",
      "<div class = 'panels'>",
      "<div class = 'panell panell-share'>",
      "<div class = 'panell-con border-hide'>",
      "<div class ='p1'>",
      "<h4>{lpp84}</h4>",
      "<div class = 'item sview'>",
      "<span class = 'label'>{lpp85}:</span>",
      "<input type = 'text' class = 'form_input form_input_s' id = 'link1' value = ''>",
      "<div class = 'form_btn form_btn_s'>",
      "<span class = 'form_btn_text next'>{lpp86}</span>",
      "</div>",
      "</div>",
      "<h4>{lpp87}</h4>",
      "<div class = 'help'>",
      "<a href = '/support/#p2' target = '_blank' class='lian'>{lpp88}?</a>",
      "</div>",
      "<div class = 'item sview2'>",
      "<span class = 'label'>flash地址:</span>",
      "<input type = 'text' class = 'form_input form_input_s' id = 'link2' value = 'http://myvideo.php?deviceid=137893661011#/'>",
      "<div class = 'form_btn form_btn_s'>",
      "<span class = 'form_btn_text next2'>{lpp86}</span>",
      "</div>",
      "</div>",
      "<div class = 'item sview3'>",
      "<span class = 'label'>html代码:</span>",
      "<input type = 'text' class = 'form_input form_input_s' id = 'link3' value = 'http://myvideo.php?deviceid=137893661011#/'>",
      "<div class = 'form_btn form_btn_s'>",
      "<span class = 'form_btn_text next3'>{lpp86}</span>",
      "</div>",
      "</div>",
      "<div class = 'item sview4'>",
      "<span class = 'label'>{lpp89}:</span>",
      "<input type = 'text' class = 'form_input form_input_s' id = 'link4' value='<iframe height=\"360\" width=\"640\" src = \"" + strfu + "\"  frameborder=0 allowfullscreen></iframe>'>",
      "<div class = 'form_btn form_btn_s'>",
      "<span class = 'form_btn_text next4'>{lpp86}</span>",
      "</div>",
      "</div>",
      "</div>",
      "<div class = 'p2'>",
      "<h4>{lpp90}</h4>",
      "<div class = 'g1'>",
      "<a title='转发到QQ空间' id='s_qq1' href='http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=http%3A%2F%2Fwww.jiathis.com%2F%23jtss-qzone&title=JiaThis+-+%E4%B8%AD%E5%9B%BD%E6%9C%80%E5%A4%A7%E7%9A%84%E7%A4%BE%E4%BC%9A%E5%8C%96%E5%88%86%E4%BA%AB%E6%8C%89%E9%92%AE%E5%8F%8A%E5%88%86%E4%BA%AB%E4%BB%A3%E7%A0%81%E6%8F%90%E4%BE%9B%E5%95%86%EF%BC%81&pics=http%3A%2F%2Fblog.jiathis.com%2Fwp-content%2Fuploads%2F2013%2F02%2Fjtweixin.jpg&summary=' target='_blank'><img src = '/images/button/kongjian.png' class='pic_qzone'>QQ空间</a>",
      "<a title='转发到新浪微博' charset='400-03-10' id='s_xinlang1' href='http://service.weibo.com/share/share.php?title=JiaThis+-+%E4%B8%AD%E5%9B%BD%E6%9C%80%E5%A4%A7%E7%9A%84%E7%A4%BE%E4%BC%9A%E5%8C%96%E5%88%86%E4%BA%AB%E6%8C%89%E9%92%AE%E5%8F%8A%E5%88%86%E4%BA%AB%E4%BB%A3%E7%A0%81%E6%8F%90%E4%BE%9B%E5%95%86%EF%BC%81%20&url=http%3A%2F%2Fwww.jiathis.com%2F%23jtss-tsina&source=bookmark&appkey=2992571369&pic=http%3A%2F%2Fblog.jiathis.com%2Fwp-content%2Fuploads%2F2013%2F02%2Fjtweixin.jpg&ralateUid=1647863564' target='_blank'><img src='/images/button/xinlang.png' class='pic_xinlang'>新浪微博</a>",
      "<a title='转发到腾讯微博' charset='400-03-12' id='s_tengxun1' href='http://share.v.t.qq.com/index.php?c=share&a=index&title=JiaThis+-+%E4%B8%AD%E5%9B%BD%E6%9C%80%E5%A4%A7%E7%9A%84%E7%A4%BE%E4%BC%9A%E5%8C%96%E5%88%86%E4%BA%AB%E6%8C%89%E9%92%AE%E5%8F%8A%E5%88%86%E4%BA%AB%E4%BB%A3%E7%A0%81%E6%8F%90%E4%BE%9B%E5%95%86%EF%BC%81%20&url=http%3A%2F%2Fwww.jiathis.com%2F%23jtss-tqq&appkey=ce15e084124446b9a612a5c29f82f080&site=www.jiathis.com&pic=http%3A%2F%2Fblog.jiathis.com%2Fwp-content%2Fuploads%2F2013%2F02%2Fjtweixin.jpg' target='_blank'><img src='/images/button/tengxun.png' class='pic_tengxun'>腾讯微博</a>",
      "<a title='转发到微信' charset='400-03-17' id='s_weixin1' href='http://hz.youku.com/red/click.php?tp=1&amp;cp=4000361&amp;cpp=1000208&amp;url=http%3A//sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey%3Furl%3Dhttp%253A%252F%252Fv.youku.com%252Fv_show%252Fid_XMTMwMzEzMzEwNA%253D%253D.html' target='_blank'><img src='/images/button/weixin.png' class='pic__weixin'>微信</a>",
      "<a title='转发到飞信' charset='400-03-8' id='s_feixin1' href='http://i.feixin.10086.cn/apps/share/share?appkey=3c3cd44d5b699e6aeb279d6eb9b03598&source=%E5%8A%A0%E7%BD%91&title=JiaThis+-+%E4%B8%AD%E5%9B%BD%E6%9C%80%E5%A4%A7%E7%9A%84%E7%A4%BE%E4%BC%9A%E5%8C%96%E5%88%86%E4%BA%AB%E6%8C%89%E9%92%AE%E5%8F%8A%E5%88%86%E4%BA%AB%E4%BB%A3%E7%A0%81%E6%8F%90%E4%BE%9B%E5%95%86%EF%BC%81&content=&pageid=&url=http%3A%2F%2Fwww.jiathis.com%2F%23jtss-feixin&pic=http%3A%2F%2Fblog.jiathis.com%2Fwp-content%2Fuploads%2F2013%2F02%2Fjtweixin.jpg' target='_blank'><img src='/images/button/feixin.png' class='pic_feixin'>飞信</a>",
      "<a title='转发到天涯社区' charset='400-03-8' id='s_tianya1' href='http://open.tianya.cn/widget/send_for.php?action=send-html&shareTo=1&appkey=&title=JiaThis+-+%E4%B8%AD%E5%9B%BD%E6%9C%80%E5%A4%A7%E7%9A%84%E7%A4%BE%E4%BC%9A%E5%8C%96%E5%88%86%E4%BA%AB%E6%8C%89%E9%92%AE%E5%8F%8A%E5%88%86%E4%BA%AB%E4%BB%A3%E7%A0%81%E6%8F%90%E4%BE%9B%E5%95%86%EF%BC%81&url=http%3A%2F%2Fwww.jiathis.com%2F%23jtss-tianya&picUrl=http%3A%2F%2Fblog.jiathis.com%2Fwp-content%2Fuploads%2F2013%2F02%2Fjtweixin.jpg' target='_blank'><img src='/images/button/tianya.png' class='pic_tianya'>天涯社区</a>",
      "</div>",
      "<div class='jiathis_style'>",

      "<a class='jiathis_button_qzone'>{lpp91}</a>",
      "<a class='jiathis_button_tsina'>{lpp92}</a>",
      " <a class='jiathis_button_tqq'>{lpp93}</a>",
      " <a class='jiathis_button_weixin'>{lpp94}</a>",
      " <a class='jiathis_button_feixin'>{lpp95}</a>",
      "<a class='jiathis_button_tianya'>{lpp96}</a>",


      " </div>",
      "<script type='text/javascript' src='http://v3.jiathis.com/code/jia.js?uid=' charset='utf-8'></script>",
      "<div class='jiathis_style'>",

      "<a class='jiathis_button_cqq'>{lpp97}</a>",
      "<a class='jiathis_button_tieba'>{lpp98}</a>",
      " <a class='jiathis_button_t163'>{lpp99}</a>",
      " <a class='jiathis_button_yixin'>{lpp100}</a>",
      " <a class='jiathis_button_miliao'>{lpp101}</a>",
      "<a class='jiathis_button_douban'>{lpp102}</a>",


      " </div>",
      "<script type='text/javascript' src='http://v3.jiathis.com/code/jia.js?uid=' charset='utf-8'></script>",
      "<div class = 'g2'>",
      "<a title='转发到QQ好友' charset='400-03-8' id='s_qqfriend' href='http://connect.qq.com/widget/shareqq/index.html?url=http%3A%2F%2Fwww.jiathis.com%2F%23jtss-cqq&showcount=0&desc=JiaThis+-+%E4%B8%AD%E5%9B%BD%E6%9C%80%E5%A4%A7%E7%9A%84%E7%A4%BE%E4%BC%9A%E5%8C%96%E5%88%86%E4%BA%AB%E6%8C%89%E9%92%AE%E5%8F%8A%E5%88%86%E4%BA%AB%E4%BB%A3%E7%A0%81%E6%8F%90%E4%BE%9B%E5%95%86%EF%BC%81&summary=JiaThis+-+%E4%B8%AD%E5%9B%BD%E6%9C%80%E5%A4%A7%E7%9A%84%E7%A4%BE%E4%BC%9A%E5%8C%96%E5%88%86%E4%BA%AB%E6%8C%89%E9%92%AE%E5%8F%8A%E5%88%86%E4%BA%AB%E4%BB%A3%E7%A0%81%E6%8F%90%E4%BE%9B%E5%95%86%EF%BC%81&title=JiaThis+-+%E4%B8%AD%E5%9B%BD%E6%9C%80%E5%A4%A7%E7%9A%84%E7%A4%BE%E4%BC%9A%E5%8C%96%E5%88%86%E4%BA%AB%E6%8C%89%E9%92%AE%E5%8F%8A%E5%88%86%E4%BA%AB%E4%BB%A3%E7%A0%81%E6%8F%90%E4%BE%9B%E5%95%86%EF%BC%81&site=jiathis&pics=http%3A%2F%2Fblog.jiathis.com%2Fwp-content%2Fuploads%2F2013%2F02%2Fjtweixin.jpg' target='_blank'><img src='/images/button/QQ.png' class='pic_qqfriend'>QQ好友</a>",
      "<a title='转发到百度贴吧' charset='400-03-10' id='s_tieba' href='http://tieba.baidu.com/f/commit/share/openShareApi?title=JiaThis+-+%D6%D0%B9%FA%D7%EE%B4%F3%B5%C4%C9%E7%BB%E1%BB%AF%B7%D6%CF%ED%B0%B4%C5%A5%BC%B0%B7%D6%CF%ED%B4%FA%C2%EB%CC%E1%B9%A9%C9%CC%A3%A1&desc=&comment=&pic=http%3A%2F%2Fblog.jiathis.com%2Fwp-content%2Fuploads%2F2013%2F02%2Fjtweixin.jpg&url=http%3A%2F%2Fwww.jiathis.com%2F%23jtss-tieba' target='_blank'><img src='/images/button/baidu.png' class='pic__tieba'>百度贴吧</a>",
      "<a title='转发到网易微博' charset='400-03-12' id='s_wangyi' href='http://s.jiathis.com/?webid=t163&url=http%3A%2F%2Fwww.jiathis.com%2F&title=JiaThis%20-%20%E4%B8%AD%E5%9B%BD%E6%9C%80%E5%A4%A7%E7%9A%84%E7%A4%BE%E4%BC%9A%E5%8C%96%E5%88%86%E4%BA%AB%E6%8C%89%E9%92%AE%E5%8F%8A%E5%88%86%E4%BA%AB%E4%BB%A3%E7%A0%81%E6%8F%90%E4%BE%9B%E5%95%86%EF%BC%81&jtss=1&pic=http%3A%2F%2Fblog.jiathis.com%2Fwp-content%2Fuploads%2F2013%2F02%2Fjtweixin.jpg' target='_blank'><img src='/images/button/wangyi.png' class='pic_wangyi'>网易微博</a>",
      "<a title='转发到易信' charset='400-03-17' id='s_yixin' href='https://open.yixin.im/login' target='_blank'><img src='/images/button/yixin.png' class='pic_yixin'>易信</a>",
      "<a title='转发到米聊' charset='400-03-8' id='s_miliao' href='http://hz.youku.com/red/click.php?tp=1&amp;cp=4000361&amp;cpp=1000208&amp;url=http%3A//sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey%3Furl%3Dhttp%253A%252F%252Fv.youku.com%252Fv_show%252Fid_XMTMwMzEzMzEwNA%253D%253D.html' target='_blank'><img src='/images/button/miliao.png' class='pic_miliao'>米聊</a>",
      "<a title='转发到豆瓣' charset='400-03-8' id='s_douban' href='http://www.douban.com/share/service?image=http%3A%2F%2Fblog.jiathis.com%2Fwp-content%2Fuploads%2F2013%2F02%2Fjtweixin.jpg&href=http%3A%2F%2Fwww.jiathis.com%2F%23jtss-douban&name=JiaThis+-+%E4%B8%AD%E5%9B%BD%E6%9C%80%E5%A4%A7%E7%9A%84%E7%A4%BE%E4%BC%9A%E5%8C%96%E5%88%86%E4%BA%AB%E6%8C%89%E9%92%AE%E5%8F%8A%E5%88%86%E4%BA%AB%E4%BB%A3%E7%A0%81%E6%8F%90%E4%BE%9B%E5%95%86%EF%BC%81&text=' target='_blank'><img src='/images/button/douban.png' class='pic_douban'>豆瓣</a>",
      "</div>",
      "</div>",
      "</div>",
      "</div>",
      "</div>",
      "</div>"
  ].join("");

  var pc_yuntai_tip_tpl = [
    '<div class="video-op cl-notice">',
      '<i class = "pic-cloud-notice"></i><span></span><i class = "pic-cloud-close"></i>',
    '</div>',
    '<div class="video-op cl-no">',
      '<div class="l"></div>',
      '<div class="u">',
        '<i class = "pic-cloud-close"></i>',
        '<p class = "t">{lp1}</p>',
        '<p>{lp3}</p>',
      '</div>',
    '</div>'
  ].join("");

  var tpl_tpl = [
      "<div class = 'video-player-wrap {clz}'>",
        "<div class = 'video-ops-wrap'>",
          "{pc_yuntai_tip_tpl}",
          '<div class="video-op show-desc">',
            '<div class = "bg"></div>',
            '<a target="_blank"></a>',
          '</div>',
          '{size_controller_tpl}',
          "{mobile_yuntai_tpl}",
          "<div class = 'zloading' id = 'video_loading'>",
            "<div></div>",
            "<p>",
              "<span class='flower-loader'>Loading&#8230;</span>",
              "<span class = 't'>{lp73}...</span>",
            "</p>",
          "</div>",
          "<div class = 'video-player'><div id = 'vp_{id}'></div></div>",
          '{bottom_controller_tpl}',
        "</div>",
        "{video_exts_tpl}",
      "</div>"
    ].join("");
  var timeLineTpl = new IX.ITemplate({
    tpl: [
      "<tpl id = 'items'><a style='width:{w}px;left:{l}px;' _area='{a}' _t='{t}'></a></tpl>"
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
  var timeTags_day_tpl = new IX.ITemplate({
    tpl: [
      "<tpl id = 'items'><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span></tpl><span>00:00</span>"
    ]
  });
  var timeTags_hour_tpl = new IX.ITemplate({
    tpl: [
      "<tpl id = 'items'><span>{h}:00</span><span>{h}:15</span><span>{h}:30</span><span>{h}:45</span></tpl><span>00:00</span>"
    ]
  });

  var shareConfigTpl = new IX.ITemplate({
    tpl: [
      "<div class = 'share-config'>",
      "<div class = 'share-types'>",
      "<div><input type = 'radio' name = 'sc_shareType' value = '1' /><span>{lp23}</span></div>",
      "<div><input type = 'radio' name = 'sc_shareType' value = '2'/><span>{lp24}</span></div>",
      "<div><input type = 'checkbox' id = 'sc_sharevideo' /><span>{lp25}</span></div>",
      "<div><input type = 'radio' name = 'sc_shareType' value = '0' /><span>{lp26}</span></div>",
      "</div>",
      "<div class='share-desc-model'>",
        "<textarea class='form-control share-desc' rows='3' placeholder='{lpp112}'></textarea>",
      "</div>",
      "<div class = 'link-content hide'>",
      "<p>{lp27}</p>",
      "<input type = 'text' id = 'sc_sharelink' />",
      "<div class = 'share-wrap'></div>",
      "</div>",
      "<div class = 'btns'>",
      "<button class = 'cancel'><span>{lp21}</span></button>",
      "<button class = 'ok'><span>{lp28}</span></button>",
      "<button class = 'close hide'><span>{lp29}</span></button>",
      "</div>",
      "</div>"
    ]
  });

  // var dateOptionTpl = new IX.ITemplate({
  //   tpl: [

  //     "<tpl id = 'items'><li>{day}</li>"
  //   ]
  // });
  var VideoPlayer = function(cfg) {
    var config = _.extend({
      container: null,
      controllers: [],
      width: 1060,
      height: 596,
      onConfig: function() {}, //显示个人播放页参数设置
      onBaseInfo: function() {},
      alwaysShowHistory: false,
      showOps: true,
      opsFloat: "fixed",
      currentDPI: 1080,
      showEditMenus: false,
      showShareOptions: false,
      language: "zh-cn",
      initFullScreen: false,
      playsinline: false,
      showDesc: false,
      showYuntai: false,
      isPrivate: true,
      IsMuted :false, //静音
      onPlaying: function(){
      },
      onError: function(){


      },
      currentUser: null,
      videoLivePlayData: null,
      modules: ["size-controller", "bottom-controller", "exts"] //mobile_yuntai
      /*getUser:function() {
            return config.currentUser;
      }*/
    }, cfg);

    var VIDEO_STATUS = {
      "on-layout-fixed": {
        clz: "on-layout-fixed",
        on: function(cbFn) {
          if (cbFn) {
            cbFn();
          }
        }
      },
      "on-show-edit-menus": { //显示个人摄像机的编辑按钮，如云台、剪辑、设置等
        clz: "on-show-edit-menus",
        on: function(cbFn) {
          if (cbFn) {
            cbFn();
          }
        }
      },
      "on-zhibo-playing": { //直播中
        clz: "on-zhibo-playing",
        on: function(cbFn) {
          $container.removeClass("on-show-history-menus on-history-playing");
          if (cbFn) {
            cbFn();
          }
        }
      },
      "on-has-history": { //有录像时
        clz: "on-has-history",
        on: function(cbFn) {
          if (cbFn) {
            cbFn();
          }
        }
      },
      "on-pause-play": { //有录像时
        clz: "on-pause-play",
        on: function(cbFn) {
          if (cbFn) {
            cbFn();
          }
        }
      },
      "on-show-history-menus": {
        clz: "on-show-history-menus",
        on: function(cbFn) {
          $container.removeClass("on-zhibo-playing on-jianji on-history-time on-show-history-hourlist");
          if (cbFn) {
            cbFn();
          }
        }
      }, //显示"调整时间刻度"列表时
      "on-history-playing": { //看录像中
        clz: "on-history-playing",
        on: function(cbFn) {
          if (cbFn) {
            cbFn();
          }
        }
      },
      "on-history-date": { //看录像，且时间轴显示为全天时
        clz: "on-history-date",
        on: function(cbFn) {
          $container.removeClass("on-history-time on-jianji has-error");
          if (cbFn) {
            cbFn();
          }
        }
      },
      "on-show-history-hourlist": {
        clz: "on-show-history-hourlist",
        on: function(cbFn) {
          if (cbFn) {
            cbFn();
          }
        }
      },
      "on-history-time": { //看录像，且时间轴显示为一个小时时
        clz: "on-history-time",
        on: function(cbFn) {
          $container.removeClass("on-jianji");
          if (cbFn) {
            cbFn();
          }
        }
      },
      "on-jianji": { //剪辑中
        clz: "on-jianji",
        on: function(cbFn) {
          if (cbFn) {
            cbFn();
          }
        }
      },
      "on-has-yuntai": { //有云台时
        clz: "on-has-yuntai",
        on: function(cbFn) {
          if (cbFn) {
            cbFn();
          }
        }
      },
      "on-show-yuntai-menu": { //显示云台菜单
        clz: "on-show-yuntai-menu",
        on: function(cbFn) {
          if (cbFn) {
            cbFn();
          }
        }
      },
      "on-show-yuntai-menu-nomanua": { //显示云台菜单，没有手动
        clz: "on-show-yuntai-menu-nomanua",
        on: function(cbFn) {
          if (cbFn) {
            cbFn();
          }
        }
      },
      "on-show-yuntai-buy": { //显示购买提示信息
        clz: "on-show-yuntai-buy",
        on: function(cbFn) {
          if (cbFn) {
            cbFn();
          }
        }
      },
      "on-granted": { //被授权的设备
        clz: "on-granted",
        on: function(cbFn) {
          if (cbFn) {
            cbFn();
          }
        }
      },
      "on-mobile": {
        clz: "on-mobile",
        on: function(cbFn) {
          if (cbFn) {
            cbFn();
          }
        }
      },
      "on-hidden-all-menus": {
        clz: "on-hidden-all-menus",
        on: function(cbFn) {
          if (cbFn) {
            cbFn();
          }
        }
      },
      "on-yuntai-man": {
        clz: "on-yuntai-man",
        on: function(cbFn) {
          $container.removeClass("on-yuntai-auto");
          $cloud_notice.find("span").text(languages[config.language]['lp30']);
          $cloud_config.find("i").removeClass().addClass("pic-cloud-manua");
          if (cbFn) {
            cbFn();
          }
        }
      },
      "on-yuntai-auto": {
        clz: "on-yuntai-auto",
        on: function(cbFn) {
          $container.removeClass("on-yuntai-man");
          $cloud_notice.find("span").text(languages[config.language]['lp31']);
          $cloud_config.find("i").removeClass().addClass("pic-cloud-auto");
          if (cbFn) {
            cbFn();
          }
        }
      },
      "on-yuntai-close": {
        clz: "on-yuntai-close",
        on: function(cbFn) {
          $cloud_config.find("i").removeClass().addClass("pic-cloud-op");
          $container.removeClass("on-yuntai-man on-yuntai-auto on-yuntai-close");
          if (cbFn) {
            cbFn();
          }
        }
      },
      "on-mouse-moving": { //当鼠标在播放器上移动时
        clz: "on-mouse-moving",
        on: function(cbFn) {
          if (cbFn) {
            cbFn();
          }
        }
      },
      "on-screen-bigger": { //当播放器视频被放大时
        clz: "on-screen-bigger",
        on: function(cbFn) {
          if (cbFn) {
            cbFn();
          }
        }
      },
      "on-full-screen": { //当全屏时
        clz: "on-full-screen",
        on: function(cbFn) {
          if (cbFn) {
            cbFn();
          }
        }
      },
      "on-show-fyuntai": { //当全屏时,显示云台
        clz: "on-show-fyuntai",
        on: function(cbFn) {
          if (cbFn) {
            cbFn();
          }
        }
      },
      "on-menus-float": { //当按钮需要浮动时，主要用于svideo，第三方嵌入页面
        clz: "on-menus-float",
        on: function(cbFn) {
          $container.find("img.img-timeline").attr("src", "/public/images/timeline_white.png");
          if (cbFn) {
            cbFn();
          }
        }
      },
      "on-menus-float-full-screen": {
        clz: "on-menus-float-full-screen",
        on: function(cbFn) {
          if (cbFn) {
            cbFn();
          }
        }
      },
      "on-menus-float-show-timeline": {
        clz: "on-menus-float-show-timeline",
        on: function(cbFn) {
          $container.removeClass("on-jianji");
          if (cbFn) {
            cbFn();
          }
        }

      }
    };

    var $container, $zloading, $videoPlayer, $cloud_notice, $cloud_no, $cloud_config, $date_choosen_wrap, $playlist, $hourlist ;
    var $scrollwrap, $lwrap, $timelineWrap, $debug;
    var $timelineMain;
    var timelineMainWidth,isShowDateDialog;

    var timelineValue = 0;
    var currentDateIndex = 0,
      currentHourIndex = 0,
      unitWidth_on_date = 1,
      unitWidth_on_hour = 1,
      player, rerenderPlayerTime = 0, dplaylisttime = 8 * 60 * 60;
    var player_size = 1,
      player_volume = 2,
      streamType = 'rtmp',
      currentHistoryStartTime;
    var getlivePlayUrlTime = 0,
      checkHlsStatusTimes = 0;
    var currentDate, currentTime, dateStart, dateEnd, dateFullStart, dateFullEnd, timelineReady, playListCount;
    var historyData, dateFullEndTime, dateFullStartTime, sourcePlayList, metaTrigger;
    var timeTipTrigger, startPlaying = false,
      itemWidth, bindStartTime, currentScrollTime;

    var deviceInfo, currentPlayUrl = "",
      currentDPI;


    var addZero = function(n) {
      return (n + "").length === 1 ? "0" + n : n;
    };
    var isOnStatus = function(_status) {
      var statusConfig = VIDEO_STATUS[_status];
      return (" " + $container[0].className + " ").indexOf(" " + statusConfig.clz + " ") > -1;
    };

    var getUnitTimeWidth = function() {
      if (!isOnStatus("on-history-time")) {
        return unitWidth_on_date;
      } else {
        return unitWidth_on_hour;
      }
    };
    var getVideoList = function() {
      if (!isOnStatus("on-history-time")) {
        return historyData.day.videoList;
      } else {
        return historyData.hour.videoList;
      }
    };

    var getWidthByDTime = function(_dtime, _unitWidth) {
      return _dtime * (_unitWidth || getUnitTimeWidth());
    };

    var getDTimeByWidth = function(_width) {
      return Math.round(_width / getUnitTimeWidth());
    };

    var getLeftByTime = function(_time, _unitWidth) {
      var dt = _time - dateFullStartTime;
      var left = 0;
      var unitWidth = _unitWidth || getUnitTimeWidth();
      left = unitWidth * dt;
      left = left - Math.floor(left / itemWidth);
      return Math.round(left * 10) / 10;
    };

    var getScrollLeftByTime = function(_time, _unitWidth) {
      var dt = _time - dateFullStartTime;
      var left = 0;
      var unitWidth = _unitWidth || getUnitTimeWidth();
      left = unitWidth * dt;
      left = left - Math.floor(left / itemWidth);
      return Math.round(left * 10) / 10;
    };

    var getTextByDTime = function(_dtime) {
      var minutes = Math.floor(_dtime / 60000);
      var second = Math.floor((_dtime - minutes * 60000) / 1000);
      return minutes + languages[config.language]['lp54'] + second + languages[config.language]['lp55'];
    };

    var renderVideoStatus = function(_status, cbFn, _isDelete) {
      //if(_isDelete && !isOnStatus(_status) || !_isDelete && isOnStatus(_status)) return;
      var statusConfig = VIDEO_STATUS[_status];
      if (!_isDelete) {
        $container.addClass(statusConfig.clz);
        statusConfig.on(cbFn);
      } else {
        $container.removeClass(statusConfig.clz);
      }
    };

    var parseLingYangPlayList = function(playList){
      var temp = [];

      if(!IX.isArray(playList)){
        playList = playList.videos;
      }

      for(var i = 0, ci; i < playList.length; i ++){
        ci = playList[i];
        temp.push([ci.from, ci.to, ci.server_index]);
      }
      return temp;
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
    var parsePlayList = function(playList) {
      var dateStartTime = dateStart.getTime();
      var dateEndTime = dateEnd.getTime();

      if(Number(deviceInfo.connect_type) === 2){
        playList = parseLingYangPlayList(playList);
      }

      var parseWeek = function(n) {
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

      var isSameYear = dateStart.getFullYear() === dateEnd.getFullYear();

      historyData = {
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

      for (var i = dateFullStartTime, ci, ci_hash, ciObj; i <= dateFullEndTime; i += 24 * 60 * 60 * 1000) {
        ciObj = new Date(i);
        ci = {
          date: i,
          day: (isSameYear ? "" : (ciObj.getFullYear() + languages[config.language]['lp33'])) + (ciObj.getMonth() + 1) + languages[config.language]['lp34'] + addZero(ciObj.getDate()) + languages[config.language]['lp35'],
          week: parseWeek(ciObj.getDay()),
          clz: "disable",
          enable: false
        };

        ci_hash = {
          itemIndex: historyData.day.items.length,
          hours: []
        };

        for (var m = 0; m <= 23; m++) {
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

        if (s1 > dateEndTime || s2 < dateStartTime) {
          return;
        }

        s1 = Math.max(s1, dateStartTime);
        s2 = Math.min(s2, dateEndTime);

        historyData.day.videoList.push({
          a: _timeStep.join(),
          t: [s1, s2],
          w: getWidthByDTime(s2 - s1, unitWidth_on_date),
          l: getLeftByTime(s1, unitWidth_on_date)
        });

        historyData.hour.videoList.push({
          a: _timeStep.join(),
          t: [s1, s2],
          w: getWidthByDTime(s2 - s1, unitWidth_on_hour),
          l: getLeftByTime(s1, unitWidth_on_hour)
        });
        s1 = new Date(s1);
        s2 = new Date(s2);
        var begin = new Date(s1.getFullYear() + "/" + (s1.getMonth() + 1) + "/" + s1.getDate() + " " + s1.getHours() + ":00:00").getTime();
        var end = new Date(s2.getFullYear() + "/" + (s2.getMonth() + 1) + "/" + s2.getDate() + " " + s2.getHours() + ":00:00").getTime();
        for (var i = begin, _date, _dateStart, _datetime; i <= end; i += 60 * 60 * 1000) {
          _date = new Date(i);
          _dateStart = new Date(_date.getFullYear() + "/" + (_date.getMonth() + 1) + "/" + _date.getDate() + " 00:00:00");
          _datetime = _dateStart.getTime();
          historyData.day.items[historyData.day.videoHash[_datetime].itemIndex].clz = "";
          historyData.day.videoHash[_datetime].hours[_date.getHours()].clz = "";
        }

      });
      playListCount = historyData.hour.videoList.length;
    };
    var showShareConfigDialog = function() {
      var shareDialog = new Dialog({
        title: languages[config.language]['lp43'],
        noFooter: true,
        html: shareConfigTpl.renderData("", languages[config.language])
      });

      shareDialog.show();

      if (deviceInfo.share > 0) {
        shareDialog.$.find(".share-desc-model").css("height","90px");
        shareDialog.$.find(".share-desc-model .share-desc").text(deviceInfo.intro);
      }

      shareDialog.$.find("[name='sc_shareType']").click(function() {
        if (this.checked && this.value === "0") {
          shareDialog.$.find("#sc_sharevideo").attr("disabled", "disabled");
          shareDialog.$.find(".share-desc-model").css("height","0");
          shareDialog.$.find(".share-desc-model .share-desc").text("");
        } else {
          shareDialog.$.find("#sc_sharevideo").prop("checked", false).removeAttr("disabled");
          shareDialog.$.find(".share-desc-model").css("height","90px");
          shareDialog.$.find(".share-desc-model .share-desc").text("");
        }
      });

      if (deviceInfo.share > 2) {
        shareDialog.$.find("[name='sc_shareType'][value='" + (deviceInfo.share - 2) + "']").prop("checked", true);
        shareDialog.$.find("#sc_sharevideo").prop("checked", true);
      } else {
        shareDialog.$.find("[name='sc_shareType'][value='" + (deviceInfo.share) + "']").prop("checked", true);
        shareDialog.$.find("#sc_sharevideo").prop("checked", false);
      }
      if (shareDialog.$.find("[name='sc_shareType'][value='0']").prop("checked")) {
        shareDialog.$.find("#sc_sharevideo").attr("disabled", "disabled");
      }

      shareDialog.$.find("button.ok").click(function() {
        var shareType = Number(shareDialog.$.find("[name='sc_shareType']:checked").val());
        if (shareDialog.$.find("#sc_sharevideo").prop("checked") && shareType > 0) {
          shareType += 2;
        }
        shareDialog.$.find("div.link-content").removeClass("show");
        deviceInfo.share = shareType;

        if (shareType > 0) {
          if (window.confirm(languages[config.language]["lp44"])) {
            CallServer.CallServer[deviceInfo.connect_type === 2 ? "camera_shareCamera_ly_callserver" : "camera_shareCamera_callserver"]({
              method: "createshare",
              deviceid: deviceInfo.deviceid,
              share: deviceInfo.share,
              intro: shareDialog.$.find(".share-desc").val()
            }, function(data) {
              if (data && typeof(data['shareid']) !== 'undefined') {
                shareDialog.$.find("div.link-content").addClass("show");
                shareDialog.$.find("button.close").addClass("show");
                shareDialog.$.find("button.cancel").hide();
                shareDialog.$.find("button.ok").hide();
                shareDialog.$.find("div.share-types").hide();
                shareDialog.$.find("div.share-desc-model").hide();
                shareDialog.$.find("div.link-content").addClass("show");
                var url = 'http://www.iermu.com/video/' + data['shareid'] + '/' + data['uk'];
                window.jiathis_config = {
                  url: url,
                  summary: shareDialog.$.find(".share-desc").val(),
                  title: languages[config.language]['lp46'],
                  shortUrl: false,
                  hideMore: true
                };
                shareDialog.$.find("#sc_sharelink").val(url);
                shareDialog.$.find(".share-wrap").html([
                  '<div class="jiathis_style">',
                  '<span class="jiathis_txt">' + languages[config.language]['lp47'] + '</span>',
                  '<a class="jiathis_button_cqq">' + languages[config.language]['lp48'] + '</a>',
                  '<a class="jiathis_button_weixin">' + languages[config.language]['lp49'] + '</a>',
                  '<a class="jiathis_button_tsina">' + languages[config.language]['lp50'] + '</a>',
                  '<a href="http://www.jiathis.com/share" class="jiathis jiathis_txt jiathis_separator jtico jtico_jiathis" target="_blank">' + languages[config.language]['lp70'] + '</a>',
                  '<script type="text/javascript" src="http://v3.jiathis.com/code/jia.js" charset="utf-8"></script>',
                  '</div>'
                ].join(""));
              } else {
                if (data.error_code && data.error_msg === "forbident to create share") {
                  alert(languages[config.language]['lp51']);
                }
              }

            });
          }
        } else {
          CallServer.CallServer["camera_cancelShare_callserver"]({
            method: "cancelshare",
            deviceid: deviceInfo.deviceid
          }, function() {
            alert(languages[config.language]['lp52']);
            shareDialog.remove();
          });
        }
      });

      shareDialog.$.find("button.close, button.cancel").click(function() {
        shareDialog.remove();
      });
    };

    var bindJianJiEvent = function() {
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
      var getClipProgress = function() {
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
            if(deviceInfo.connect_type === 2 && Number(data["status"]) === -1){
              alert(languages[config.language]['lp59']);
              return;
            }
            if (Number(data['progress']) !== 100) {
              getClipProgress();
            } else if(deviceInfo.connect_type === 2 && Number(data.status) === 0 || deviceInfo.connect_type !== 2 && Number(data['progress']) === 100) {
              alert(languages[config.language]['lp53']);
              dialog.remove();
              data.segments = data.segments || [];
              if(deviceInfo.connect_type === 2 && data.segments.length > 0){
                (new Dialog({
                  title: languages[config.language]['lp63'],
                  noFooter: true,
                  html: (function() {
                    var _html = new IX.ITemplate({
                      tpl: "<ul class = 'clip-files'><tpl id = 'files'><li><span>{name}</span><a href = '{href}' target='_blank'>" + languages[config.language]["lp20"] +  "</a></li></tpl></ul>"
                    });
                    var files = [];
                    for (var i = 0, ci; i < data.segments.length; i ++) {
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

        });
      };

      var getTriggerWidth = function() {
        return Number($jianji_op_trigger[0].style.width.replace("px", "")) - triggerBorderWidth_2x;
      };
      $container.find(".pic-jianji").click(function() {
        if (!historyData) {
          return;
        }
        if (!isOnStatus("on-history-time")) {
          if (historyData.day.items[currentDateIndex].clz === "disable") {
            $date_choosen_wrap.find("button:not(.disable):not(.more):last").trigger("click");
          }
          //$hourlist.find("li[_v!='-1']:not(.disable):last").trigger("click");
        } else if (historyData.day.videoHash[historyData.day.items[currentDateIndex].date].hours[currentHourIndex].clz === "disable") {
          $hourlist.find("li[_v!='-1']:not(.disable):last").trigger("click");
        }
        renderVideoStatus("on-jianji");
        var hasFind = false;
        var timeLength = 0;
        triggerBorderWidth = Number($jianji_op_trigger.css("border-width").replace("px", ""));
        triggerBorderWidth_2x = triggerBorderWidth * 2;
        var videoList = getVideoList(),
          i, ci;

        if (isOnStatus("on-history-playing")) {
          var playTime = Number($container.find("a.time-tip").attr("_date"));
          if (playTime >= currentScrollTime && playTime <= currentScrollTime + (!isOnStatus("on-history-time") ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000)) {
            var _start = 0,
              d = 15 * 60 * 1000;
            for (i = 0, ci; i < playListCount; i++) {
              ci = videoList[i];
              if (ci.t[0] <= playTime && ci.t[1] >= playTime) {
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
        }
        if (!hasFind) {
          for (i = 0, ci; i < playListCount; i++) {
            ci = videoList[i];
            if (ci.t[0] <= currentScrollTime && ci.t[1] >= currentScrollTime) {
              hasFind = true;
              $jianjiop.css("left", getLeftByTime(currentScrollTime) - triggerBorderWidth);
              timeLength = ci.t[1] - currentScrollTime;
              $jianji_op_trigger.width(Math.min(ci.l + ci.w - getLeftByTime(currentScrollTime), itemWidth));
              break;
            } else if (ci.t[0] >= currentScrollTime) {
              hasFind = true;
              $jianjiop.css("left", getLeftByTime(ci.t[0]) - triggerBorderWidth);
              if (!isOnStatus("on-history-time")) {
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
        renderVideoStatus("on-jianji", null, true);
      });


      var getJianjiTimeArea = function() {
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

      var checkJianjiTimeArea = function(startTime, timeCount) {
        var timeLength = 0,
          maxTime = 30 * 60 * 1000,
          start = false,
          starti = 0,
          end = false,
          endi = 0,
          endType = 0, endTime = 0;

        var left = Number($jianjiop.css("left").replace("px", "")) + triggerBorderWidth;
        var width = getTriggerWidth();
        timeCount = timeCount || getDTimeByWidth(width);

        var videoList = getVideoList();
        for (var i = 0, ci, ctime; i < playListCount; i++) {
          ci = videoList[i];
          endType = 0;
          if (start) {
            ctime = ci.t[1] - ci.t[0];
            if(ci.t[0] >= endTime){
              endi = i - 1;
              end = videoList[endi];
              endTime = end.t[1];
              endType = 1;
              width = getWidthByDTime(end.t[1] - startTime);
            }else if(ci.t[0] < endTime && ci.t[1] >= endTime) {
              endi = i;
              end = ci;
              endType = 2;
              width = getWidthByDTime(endTime - startTime);
            }else if(i === playListCount - 1){
              endi = i;
              end = ci;
              endType = 2;
              width = getWidthByDTime(end.t[1] - startTime);
            }
            if(end) break;
          } else {
            if (ci.l > left) {
              if (ci.l < left + width) {
                left = ci.l;
                start = ci;
                startTime = ci.t[0];
                starti = i;
              } else {
                if ($playlist.children().eq(i).offset().left >= $scrollwrap.offset().left + $scrollwrap.width() - 30) {
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
            if(start){
              endTime = startTime + Math.min(timeCount, maxTime);
            }
          }
        }

        if (!start) {
          endi = starti = playListCount - 1;
          end = start = videoList[starti];
          left = Math.max(start.l, getLeftByTime(currentScrollTime));
          var dtime = start.t[1] - Math.max(currentScrollTime, start.t[0]);
          timeLength = Math.min(dtime, maxTime);
          width = getWidthByDTime(timeLength);
          startTime = Math.max(currentScrollTime, start.t[0]);
          endTime = startTime + timeLength;
        }
        $jianjiop[0].style.left = left - triggerBorderWidth + "px";
        $jianji_op_trigger.width(width);
        $jianji_time.text(getTextByDTime(endTime - startTime));
      };
      var dialog;
      $jianjiop.find("button.save-jianji").click(function() {
        var time = getJianjiTimeArea();
        var timesArea = deviceInfo.description + "_" + (IX.Date.getDateByFormat(time.s1 * 1000, "yyyyMMddHHmmss")) + "_" + (IX.Date.getDateByFormat(time.e1 * 1000, "yyyyMMddHHmmss"));
        //alert(timesArea);
        dialog = new Dialog({
          title: languages[config.language][deviceInfo.connect_type === 2 ? "lp113" : 'lp56'],
          noFooter: true,
          html: [
            "<div class = 'save-video-wrap " + config.language + "'>",
            "<p style = '" + (deviceInfo.connect_type === 2 ? "display:none;":"") +  "'>" + languages[config.language]['lp66'] + "" + $(".jianji-op .ops p span").text() + "</p>",
            "<div class = 'clip-name' style = '" + (deviceInfo.connect_type === 2 ? "display:none;":"") +  "'>" + languages[config.language]['lp57'] + "<input type = 'text' id = 'clipname' value='" + timesArea + "' /></div>",
            "<div class='progress'>",
            "<div class='progress-bar progress-bar-danger' role='progressbar' data-transitiongoal='100'><span></span></div>",
            "</div>",
            "<div class = 'btns'>",
            "<button class = 'cancel'><span>" + languages[config.language]['lp21'] + "</span></button>",
            "<button class = 'save'><span>" + languages[config.language]['lp28'] + "</span></button>",
            "</div>",
            "</div>"
          ].join("")
        });
        dialog.show();
        dialog.$.find("button.save").click(function() {
          CallServer.CallServer[deviceInfo.connect_type === 2 ? "video_clipVideo_ly_callserver" : "video_clipVideo_callserver"]({
            method: 'clip',
            deviceid: deviceInfo.deviceid,
            st: time.s,
            et: time.e,
            name: dialog.$.find("input").val().trim()
          }, function(data) {
            if (data && typeof(data['error_code']) !== "undefined") {
              var errorCode = {
                "31354": languages[config.language]['lp58'],
                "31372": languages[config.language]['lp59'],
                "31374": languages[config.language]['lp69'],
                "31375": languages[config.language]['lp60'],
                "31376": languages[config.language]['lp61'],
                "31377": languages[config.language]['lp62']
              };
              alert(errorCode[data['error_code']] || data.error_msg);
            } else {
              clipErrorTime = 0;
              deviceInfo.clipid = data.clipid;
              getClipProgress();
            }
          });
        });

        dialog.$.find("button.cancel").click(function() {
          dialog.remove();
        });
      });
      $jianjiop.find("button.download-jianji").click(function() {
        var time = getJianjiTimeArea();
        
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
                  tpl: "<ul class = 'clip-files'><tpl id = 'files'><li><span>{name}</span><a href = '{href}'>" + languages[config.language]["lp20"] +  "</a></li></tpl></ul>"
                });
                var files = [];
                for (var f in data) {
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

      var startLeft, maxLeft, minLeft, maxWidth;
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

      var onJianjiTriggerMove = function(e) {
        if (!startJianji || jianjiMove !== 3) {
          return;
        }
        document.onselectstart = function() {
          return false;
        };
        var dx = e.clientX - startX;
        var left = startLeft + dx;
        left = Math.min(Math.max(left, minLeft), maxLeft);
        $jianjiop.css("left", left + "px");
      };

      var stopJianjiTriggerMove = function() { //e
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

      var onJianjiMove = function(e) {
        if (!startJianji || jianjiMove === 3) {
          return;
        }
        document.onselectstart = function() {
          return false;
        };
        var dx = e.clientX - startX;
        if (jianjiMove === 2) {
          if (startWidth + dx > maxWidth) {
            return;
          }
          $jianji_op_trigger.width(Math.max(startWidth + dx, 1 + triggerBorderWidth_2x));
        }
        if (jianjiMove === 1) {
          var _left = startLeft + dx;
          if (_left < minLeft || _left > maxLeft) {
            return;
          }
          $jianjiop.css("left", Math.max(_left, 0) + "px");
          $jianji_op_trigger.width(Math.max(startWidth - dx, 1));
        }
        $jianji_time.text(getTextByDTime(getDTimeByWidth(getTriggerWidth())));
      };

      var stopJianjiMove = function() {
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


    var bindSizeControllerEvent = function() {
      var $size = $container.find("span.size");
      $container.find(".bigger").click(function() {
        if (player_size > 6) {
          return;
        }
        player_size++;
        $size.height("+=20%");
        player.scale_vedio_size(player_size);
        renderVideoStatus("on-screen-bigger");
      });
      $container.find(".smaller").click(function() {
        if (player_size === 1) {
          return;
        }
        player_size--;
        player.scale_vedio_size(player_size);
        $size.height("-=20%");
        if (player_size === 1) {
          renderVideoStatus("on-screen-bigger", null, true);
        }
      });
    };

    var bindVolumnEvent = function() {
      //var $btn_volume = $container.find("button.btn_volume");
      var $volume_bar = $container.find(".volume-op>div>a");
      var $volume_tip = $container.find(".volume-op>div>div");
      var $volume_trigger = $container.find(".volume-op>a");
      var currentVolume = 36;
      var currentWidth;

      function _setVolume(e) {
        currentVolume = e.clientX - $volume_tip.offset().left;
        if (currentVolume < 13) {
          $volume_tip.width('13%');
          player_volume = 0;
          currentWidth = 13;
        } else if (currentVolume > 100) {
          $volume_tip.width('100%');
          player_volume = 5;
          currentWidth = 100;
        } else {
          $volume_tip.width(currentVolume + '%');
          player_volume = currentVolume * 5 / 87;
          currentWidth = currentVolume;
        }
        $volume_bar.css("left", $volume_tip.width() - 8 + "px");
        player.set_volume(player_volume);
        $volume_trigger.removeClass("close-volumn");
      }

      var start = 0,
        close_volume = 0;
      $volume_trigger.click(function() {
        if ($volume_trigger.is(".close-volumn")) {
          $volume_trigger.removeClass("close-volumn");
          $volume_tip.width(currentVolume + '%');
          player.set_volume(close_volume);
          $volume_bar.css("left", $volume_tip.width() - 8 + "px");
        } else {
          close_volume = player_volume;
          $volume_trigger.addClass("close-volumn");
          $volume_tip.width('0%');
          player_volume = 0;
          player.set_volume(player_volume);
          $volume_bar.css("left", "0px");
        }
      });
      $volume_bar.mousedown(function() {
        start = 1;
        return false;
      });
      $container.find(".volume-wrap").mouseup(function() { //e
        start = 0;
      }).mousemove(function(e) {
        if (start === 1) {
          _setVolume(e);
        }
        return false;
      });
      $container.find(".video-player").mouseover(function() {
        start = 0;
      });

    };

    var bindFullScreenEvent = function() {
      var is_support_fullscreen = document.webkitCancelFullScreen || document.mozCancelFullScreen || document.msExitFullscreen;
      var oldWidth, oldHeight;
      $container.find(".pic-fullscreen").click(function() { //var $btn_full =

        if (isOnStatus("on-full-screen") && isOnStatus("on-layout-fixed") || isOnStatus("on-menus-float-full-screen")) {
          onCancelFullScreen();
          if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
        } else {
          oldWidth = config.width;
          oldHeight = config.height;
          renderVideoStatus("on-full-screen");
          renderVideoStatus("on-menus-float");
          renderVideoStatus("on-menus-float-full-screen");
          renderVideoStatus("on-jianji", null, true);
          if (is_support_fullscreen) {
            resetSize(window.screen.width, window.screen.height);
          } else {
            resetSize(document.documentElement.clientWidth, document.documentElement.clientHeight);
          }
          if ($container[0].webkitRequestFullScreen) {
            $container[0].webkitRequestFullScreen();
          } else if ($container[0].mozRequestFullScreen) {
            $container[0].mozRequestFullScreen();
          } else if ($container[0].msRequestFullscreen) {
            $container[0].msRequestFullscreen();
          }
        }

      });

      var onCancelFullScreen = function() {
        resetSize(oldWidth, oldHeight);
        if (isOnStatus("on-layout-fixed")) {
          renderVideoStatus("on-menus-float", null, true);
          renderVideoStatus("on-full-screen", null, true);
          $date_choosen_wrap.find("button").each(function() {
            this.style.width = "auto";
          });
        }
        renderVideoStatus("on-menus-float-full-screen", null, true);
      };
      document.onwebkitfullscreenchange = document.onmozfullscreenchange = document.onmsfullscreenchange = function() {
        if (!document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
          onCancelFullScreen();
        }
      };
    };
    var firstDelay = false;
    var bindYunTaiEvent = function() {
      //云台手动旋转
      var $dbsn = 0;
      var manuaCloud = function(_afterX, _afterY) {
        
        var params = _.extend({
          direction: _afterX,
          step: 25
        }, !firstDelay ? {
          delay: 1000
        } : {} );
        if(deviceInfo.nameplate === "HDW" && !firstDelay){
          firstDelay = true;
        }
        CallServer.CallServer["video_play_list_callserver"](_.extend({
          method: "move",
          deviceid: deviceInfo['deviceid'],
          }, deviceInfo.nameplate === "HDW" ? params : {
            x1: currentDPI.w / 2,
            y1: currentDPI.h / 2,
            x2: _afterX,
            y2: _afterY
          }), function(data) {
          if (data) {}
        });
      };

      //云台自动旋转
      var autoCloud = function() {
        CallServer.CallServer["video_play_list_callserver"](_.extend({
          method: "rotate",
          rotate: "auto",
          deviceid: deviceInfo['deviceid']
        }), function(data) {
          if (data) {}
        });
      };


      //停止云台
      var stopCloud = function() {
        CallServer.CallServer["video_play_list_callserver"](_.extend({
          method: "rotate",
          rotate: "stop",
          deviceid: deviceInfo['deviceid']
        }), function(data) {
          if (data) {}
        });
      };

      var removeDbs = function(_dbs) { //移除双击效果
        setTimeout(function() {
          _dbs.remove();
        }, 4000);
      };

      function getScrollTop() {
        var scrollTop = 0;
        if (document.documentElement && document.documentElement.scrollTop) {
          scrollTop = document.documentElement.scrollTop;
        } else if (document.body) {
          scrollTop = document.body.scrollTop;
        }
        return scrollTop;
      }
      var createDbs = function(e) { //添加双击效果
        $dbsn++;
        var afterX,afterY,left, top, xdirection, ydirection, xUnitStep, yUnitStep, xmoveStep, ymoveStep;
        var playerw = $videoPlayer.width();
        var playerh = playerw * 9 / 16;
        // if(isOnStatus("on-show-fyuntai")){
        //   if(IX.browser.versions.mobile){
        //     e = ZBase.Event.getEventTouchObj(e);
        //     left = e.pageX;
        //     top = e.pageY;
        //   }else{
        //     left = e.clientX;
        //     top = e.clientY;
        //   }
        // }else{
          left = e.clientX - $videoPlayer.offset().left;
          top = e.clientY - $videoPlayer.offset().top + getScrollTop();
        // }
        if(deviceInfo.nameplate === "HDW"){
          //单位步距
          xUnitStep = playerw / 2 / 255;
          yUnitStep = playerh / 2 / 255;

          //判断方向
          // if(top > playerh / 2) {
          //   ydirection = "down";
          //   ymoveStep = (top - playerh / 2) * yUnitStep;
          // }else{
          //   ydirection = "up";
          //   ymoveStep = (playerh / 2) * yUnitStep;
          // } 
          // ymoveStep = Math.abs(top - playerh / 2) / yUnitStep;
          if(left > playerw / 2){
            xdirection = "right";
          } else {
            xdirection = "left";
          }
          // xmoveStep = Math.abs(left - playerw / 2) / xUnitStep;
          console.log("{" + xdirection + "," + xmoveStep +"}," + "{" + ydirection + "," + ymoveStep +"}");
          manuaCloud(xdirection);
        }else{
          if(!isOnStatus("on-full-screen")){
            afterX = currentDPI.w - left / ($videoPlayer.width() / currentDPI.w);
            afterY = currentDPI.h - top / ($videoPlayer.height() / currentDPI.h);
          }else{
            afterX = currentDPI.w - left / ($videoPlayer.width() / currentDPI.w);
            afterY = currentDPI.h - (top - ($videoPlayer.height() - playerh) / 2) / ($videoPlayer.height() / currentDPI.h);
            if(afterX < 0 || afterY < 0){return;}
          }
          manuaCloud(afterX, afterY);
        }

        $videoPlayer.append("<span class='dbs" + $dbsn + "'><i class='pic-cloud-dblclick'></i></span>");
        var $dbs = $container.find(".video-ops-wrap .dbs" + $dbsn); 
        $dbs.css("top", top - 27);
        $dbs.css("left", left - 27);

        
        removeDbs($dbs);
      };

      var cloudShowMenu = function() { //显示云台菜单
        if (deviceInfo === null) {
          return;
        }
        if (isOnStatus("on-has-yuntai")) {
          renderVideoStatus("on-show-yuntai-menu");
        } else {
          window.open("https://detail.tmall.com/item.htm?spm=a1z10.1-b.w5001-14092012353.4.a3zuw2&id=526398259435&scene=taobao_shop");
          $cloud_no.show();
        }
      };

      var cloudMenuOper = function(e) {
        var $target = $(e.target || e.srcElement).closest("li");
        if (!$target.is("li")) {
          return;
        }
        var h = Number($target.attr("_v"));
        var $size = $container.find("span.size");
        renderVideoStatus("on-show-yuntai-menu", null, true);
        if (h === 1) {
          $size.height("0%");
          player.scale_vedio_size(player_size);
          renderVideoStatus("on-yuntai-man");
          $cloud_notice.show();
          stopCloud();
        } else if (h === 2) {
          renderVideoStatus("on-yuntai-auto");
          $cloud_notice.show();
          autoCloud();
        } else {
          renderVideoStatus("on-yuntai-close");
          stopCloud();
        }
        var tc;
        if (!isOnStatus("on-yuntai-close")) {
          clearTimeout(tc);
          $cloud_notice.animate({
            opacity: 1
          });
          $cloud_notice.stop();
          $cloud_notice.fadeOut();
          tc = setTimeout(function() {
            $cloud_notice.fadeOut(2000);
          }, 3000);
        }
      };

      var clNoticeClose = function() {
        $cloud_notice.hide();
      };

      var cloudHideMenu = function() {
        renderVideoStatus("on-show-yuntai-menu", null, true);
      };

      var noCloudClose = function() {
        $cloud_no.hide();
      };

      $videoPlayer.dblclick(function(e) {
        if (!isOnStatus("on-yuntai-man")) {
          return;
        }
        createDbs(e);
      });
      var t = 0,st = 0;
      $videoPlayer.bind("touchend click",function(e){
        if (!isOnStatus("on-yuntai-man") || !IX.browser.versions.mobile) {
          return;
        }
        var cd = new Date();
        t++;
        if(t === 1) {
          st = cd.getTime();
        }
        if(t === 2) {
          if(cd.getTime()-st < 250){
            createDbs(e);
          }
          t = 0;
        }
      });

      $container.find(".cl-notice .pic-cloud-close").click(clNoticeClose);
      $container.find(".yuntai .cloud-op li").click(cloudMenuOper);
      $container.find(".yuntai .e-cloud-config").click(cloudShowMenu);
      $container.find(".yuntai .cloud-op").mouseleave(cloudHideMenu);
      $container.find(".yuntai").mouseleave(cloudHideMenu);
      $container.find(".cl-no .pic-cloud-close").click(noCloudClose);
      $container.find(".video-ops-wrap .yuntaiops .yuntaiops-close").bind("touchend click",function(){
          $(this).addClass('active').siblings().removeClass('active');
          renderVideoStatus("on-yuntai-close");
          stopCloud();
          clNoticeClose();
      });
      $container.find(".video-ops-wrap .yuntaiops .yuntaiops-manua").bind("touchend click",function(){
         $(this).addClass('active').siblings().removeClass('active');
          renderVideoStatus("on-yuntai-man");
          $cloud_notice.show();
          stopCloud();
      });
     $container.find(".video-ops-wrap .yuntaiops .yuntaiops-auto").bind("touchend click",function(){
       $(this).addClass('active').siblings().removeClass('active');
          renderVideoStatus("on-yuntai-auto");
          $cloud_notice.show();
          autoCloud();
      });
    };
    var bindViewEvent = function(_deviceInfo) {
      CallServer.CallServer["video_view_callserver"]({
        method: 'view',
        deviceid: _deviceInfo.deviceid
      }, function(_data) {
        if (_data.error_code) {
          _data = {
            viewnum: 0,
            device_list: []
          };
        }
        if (parseFloat(_data.viewnum) > 10000) {
          _data.viewnum = Math.round((_data.viewnum / 10000) * 10) / 10;
          _data.viewnum = _data.viewnum + languages[CURRENT_PROJECT_LANGUAGE].lpp107;

        } else {
          _data.viewnum = _data.viewnum;
        }
        $container.find(".fn-play span.stat").text(_data.viewnum);
      });
    };
    var playHistory = function(timeArea) {
      var timeStart = Number(timeArea);
      var timeEnd = timeStart + 600;
      currentPlayUrl = document.location.origin + '/api/v2/pcs/device?method=vod&deviceid=' + (!config.isPrivate ? ('&shareid=' + deviceInfo.shareid + "&uk=" + deviceInfo.uk) : (deviceInfo.deviceid)) + '&st=' + timeStart + '&et=' + timeEnd;
      streamType = "m3u8";
      renderPlayer();
    };

    var bindEvent = function() {
    window.addEventListener("message", function( event ) {
      console.info(event.data);
      if(event.data.command === "nocontrols"){
        player.controls = null;
      } 
      if(event.data.command === "controls"){
        player.controls = "controls";
      } 
      if(event.data.command === "play"){
        player.play();
      } 
      if(event.data.command === "pause"){
        player.pause();
      } 
      if(event.data.command === "enterfullscreen"){
        if (player.webkitRequestFullScreen) {
          player.webkitRequestFullScreen();
        } else if (player.mozRequestFullScreen) {
          player.mozRequestFullScreen();
        } else if (player.msRequestFullscreen) {
          player.msRequestFullscreen();
        } else if (player.webkitEnterFullScreen){
          player.webkitEnterFullScreen();
        }
      } 
      if(event.data.command === "exitfullscreen"){
        if (player.webkitCancelFullScreen) {
          player.webkitCancelFullScreen();
        } else if (player.mozCancelFullScreen) {
          player.mozCancelFullScreen();
        } else if (player.msExitFullscreen) {
          player.msExitFullscreen();
        } else if (player.webkitExitFullScreen){
          player.webkitExitFullScreen();
        }
      } 
      return player;
    }, false ); 
      $container.find(".e-share-config").click(showShareConfigDialog);
      $container.find(".pic-config").click(config.onConfig);
      $container.find(".btn-show-history").click(function() {
        if (!historyData) {
          return;
        }
        renderVideoStatus("on-show-history-menus");
        renderVideoStatus("on-history-date");
        renderVideoStatus("on-history-time", null, true);
        renderVideoStatus("on-menus-float-show-timeline", null, true);
        $chose_play_buttons.removeClass("enable");
        $chose_play_buttons.eq(0).addClass("enable");
        initTimeline();
      });
      $container.find("a.e-pause").click(function() {
        if (isOnStatus("on-pause-play")) {
          renderVideoStatus("on-pause-play", null, true);
          player.resume();
        } else {
          renderVideoStatus("on-pause-play");
          player.pause();
        }
      });
      var $s_play_video = $container.find(".s-play-zhibo");
      $s_play_video.click(function() {
        if (isOnStatus("on-zhibo-playing")) {
          return;
        }
        renderVideoStatus("on-zhibo-playing");
        $chose_play_buttons.removeClass("enable");
        $chose_play_buttons.eq(1).addClass("enable");
        bindData(deviceInfo);
      });
      var tt;
      $container.find(".video-ops-wrap").mousemove(function() {
        clearTimeout(tt);
        renderVideoStatus("on-mouse-moving");
        tt = setTimeout(function() {
          renderVideoStatus("on-mouse-moving", null, true);
        }, 2000);
      });
      if(!IX.browser.versions.mobile){
        $playlist.click(function(e) {
          var $target = $(e.target || e.srcElement);
          if ($target.is("a")) {
            renderVideoStatus("on-history-playing");
            var left = e.clientX - $playlist.offset().left;
            left += Math.floor(left / itemWidth);
            var videoTimeStart, timeStart;
            timeStart = Math.floor(dateFullStartTime + left / getUnitTimeWidth());
            videoTimeStart = Math.floor(timeStart + dplaylisttime * 1000);
            renderTimeTrigger(new Date(timeStart));
            currentHistoryStartTime = Math.floor(timeStart / 1000);
            playHistory(Math.floor(videoTimeStart / 1000));
          }
        });
      }
      
      var $chose_play_buttons = $container.find(".play-type-menus button");
      $chose_play_buttons.click(function() {
        var $this = $(this);
        $chose_play_buttons.removeClass("enable");
        $this.addClass("enable");
        if ($this.is(".play-zhibo") && !isOnStatus("on-zhibo-playing")) {
          renderVideoStatus("on-zhibo-playing");
          bindData(deviceInfo);
        } else if ($this.is(".play-video") && !isOnStatus("on-show-history-menus")) {
          renderVideoStatus("on-show-history-menus");
          renderVideoStatus("on-history-date");
          if (historyData) {
            initTimeline();
          }
          var timeTip_date = $container.find("a.time-tip").attr("_date");
          if (timeTip_date) {
            renderTimeTrigger(new Date(Number(timeTip_date)));
          }
        }
      });

      $container.find("div.timeline>a").click(function() {
        var $this = $(this);
        var d = 0;
        if (!isOnStatus("on-history-time")) {
          d = 6 * 60 * 60 * 1000;
        } else {
          d = 15 * 60 * 1000;
        }
        if ($this.is(".prev")) {
          scrollTimeline(Math.max(currentScrollTime - d, dateFullStartTime));
        } else {
          scrollTimeline(Math.min(currentScrollTime + d, dateFullEndTime + (!isOnStatus("on-history-time") ? 0 : 23 * 60 * 60 * 1000)));
        }
        var activeTime = historyData.day.items[currentDateIndex].date;
        if (!isOnStatus("on-history-time")) {
          if (Math.abs(activeTime - currentScrollTime) === 24 * 60 * 60 * 1000) {
            if ($this.is(".prev")) {
              currentDateIndex--;
            } else {
              currentDateIndex++;
            }
            currentDateIndex = Math.min(Math.max(0, currentDateIndex), historyData.day.items.length - 1);
            renderDays(currentDateIndex);
            currentHourIndex = 0;
            renderHourList();
          }
        } else {
          var activeHourTime = historyData.day.videoHash[activeTime].hours[currentHourIndex].d;
          if (activeTime > currentScrollTime && activeTime - currentScrollTime === 60 * 60 * 1000 || Math.abs(activeTime - currentScrollTime) === 24 * 60 * 60 * 1000) {
            if ($this.is(".prev")) {
              currentDateIndex--;
              currentHourIndex = 23;
            } else {
              currentDateIndex++;
              currentHourIndex = 0;
            }
            currentDateIndex = Math.min(Math.max(0, currentDateIndex), historyData.day.items.length - 1);
            renderDays(currentDateIndex);
            renderHourList();
            $hourlist.find("li[_v='" + currentHourIndex + "']").addClass("selected");
          } else if (Math.abs(activeHourTime - currentScrollTime) === 60 * 60 * 1000) {
            $hourlist.find(".selected").removeClass("selected");
            if ($this.is(".prev")) {
              currentHourIndex--;
            } else {
              currentHourIndex++;
            }
            currentHourIndex = Math.min(Math.max(0, currentHourIndex), 23);
            $hourlist.find("li[_v='" + currentHourIndex + "']").addClass("selected");
          }
        }
      });

      $date_choosen_wrap.click(function(e) {
        var $target = $(e.target || e.srcElement).closest("button");
        if ($target.length === 0 || $target.is(".more") || ($target.is(".active") && !isOnStatus("on-history-time") && !isOnStatus("on-menus-float"))) {
          return;
        }
        renderVideoStatus("on-history-date");
        if (isOnStatus("on-menus-float")) {
          renderVideoStatus("on-menus-float-show-timeline");
        }
        var _date = $target.attr("_date");

        $container.find("button.btn-show-history span.s-date").text($target.find("span").eq(0).text());
        currentDateIndex = historyData.day.videoHash[_date].itemIndex;
        currentHourIndex = 0;

        $date_choosen_wrap.find(".active").removeClass("active");
        $target.addClass("active");
        renderTimeline();
        scrollTimeline(Number(_date), true);
        
        renderHourList();

        if(!IX.browser.versions.mobile){
          var timeTip_date = $container.find("a.time-tip").attr("_date");
          if (timeTip_date) {
            renderTimeTrigger(new Date(Number(timeTip_date)));
          }
        }
      });



      //收藏
      var urls = document.location.pathname.split("/");
      var shareid = urls[urls.length - 2];
      var uk = urls[urls.length - 1];
      $container.find(".fn-collect").click(function() {
        if (config.currentUser !== null) {
          $container.find("a.nocollect").toggleClass("hide");
          $container.find("a.collect").toggleClass("show");
          if ($container.find("a.collect").hasClass("show")) {
            CallServer.CallServer["video_subscribe_callserver"]({
              method: 'subscribe',
              shareid: shareid,
              uk: uk
            }, function(_data) {

              if (_data.error_code) {
                _data = {
                  device_list: []
                };
              }

            });
          } else {
            CallServer.CallServer["video_unsubscribe_callserver"]({
              method: 'unsubscribe',
              shareid: shareid,
              uk: uk
            }, function(_data) {

              if (_data.error_code) {
                _data = {
                  device_list: []
                };
              }

            });
          }
        } else {
          DLdialog = new Dialog({
            title: languages[config.language]['lpp108'],
            noFooter: true,
            html: [
              "<div class = 'save-video-wrap3'>",
              "<p>" + languages[config.language]['lpp109'] + "</p>",
              "<div class = 'btns-3'>",
              "<a class = 'save-3' ><span>" + languages[config.language]['lpp110'] + "</span></a>",

              "</div>",
              "</div>"
            ].join("")
          });
          DLdialog.show();
          DLdialog.$.find("div.btns-3 a.save-3").click(function() {
            OAuth.init();
          });
        }



      });
      //点赞
      var dz = function() {

        CallServer.CallServer["video_approve_callserver"]({
          method: 'approve',
          deviceid: deviceInfo.deviceid,
        }, function(_data) {
          if (_data.error_code) {
            _data = {
              approvenum: 0,
              device_list: []
            };
          }
          if (parseFloat(_data.approvenum) > 10000) {
            _data.approvenum = Math.round((_data.approvenum / 10000) * 10) / 10;
            _data.approvenum = _data.approvenum + languages[CURRENT_PROJECT_LANGUAGE].lpp107;

          } else {
            _data.approvenum = _data.approvenum;
          }
          $container.find(".fn-updown span.stat").text(_data.approvenum);
        });
      };

      $container.find(".fn-updown").click(function() {
        if (config.currentUser !== null) {
          $container.find('i.pic-playdown').addClass('hide');
          $container.find('i.pic-updown').addClass('show');
          dz();
        } else {
          DLdialog = new Dialog({
            title: languages[config.language]['lpp108'],
            noFooter: true,
            html: [
              "<div class = 'save-video-wrap3'>",
              "<p>" + languages[config.language]['lpp109'] + "</p>",
              "<div class = 'btns-3'>",
              "<a class = 'save-3' ><span>" + languages[config.language]['lpp110'] + "</span></a>",

              "</div>",
              "</div>"
            ].join("")
          });
          DLdialog.show();
          DLdialog.$.find("div.btns-3 a.save-3").click(function() {
            OAuth.init();
          });
        }
      });


      //举报

      var dialog;
      var DLdialog;
      $container.find(".fn-warning").click(function() {

        if (config.currentUser !== null) {
          dialog = new Dialog({
            title: languages[config.language]['lpp70'],
            noFooter: true,
            html: [
              "<div class = 'save-video-wrap2'>",
              "<p>" + languages[config.language]['lpp71'] + "</p>",
              "<div class='y1 yuanyin'><a class='i1'><i class='pic-checkbox'_i=1></i><span>" + languages[config.language]['lpp72'] + "</span></a><a class='i2'><i class='pic-checkbox' _i=2></i><span>" + languages[config.language]['lpp73'] + "</span></a><a class='i3'><i class='pic-checkbox' _i=3></i><span>" + languages[config.language]['lpp74'] + "</span></a><br/><a class='i4'><i class='pic-checkbox' _i=4></i><span>" + languages[config.language]['lpp75'] + "</span></a><a class='i5'><i class='pic-checkbox' _i=5></i><span>" + languages[config.language]['lpp76'] + "</span></a></div>",

              "<div class = 'clip-name2'><textarea _i=0 type = 'text' id = 'clipname'  placeholder=" + languages[config.language]['lpp77'] + "></textarea></div>",
              "<div class = 'btns-2'>",
              "<button class = 'save-2'><span>" + languages[config.language]['lpp78'] + "</span></button>",
              "</div>",
              "</div>"
            ].join("")
          });
          dialog.show();

          dialog.$.find("div.yuanyin a ").click(function() {

            $(this).find("i").toggleClass("pic-checked");
            $(this).find("i").toggleClass("pic-checkbox");
            $(this).siblings().find("i").removeClass("pic-checked").addClass('pic-checkbox');
            //($(this).find("i").attr("_i");
          });

          dialog.$.find("button.save-2").click(function() {
            dialog.remove();

            var str1 = dialog.$.find(".clip-name2 textarea").val();
            var cs;

            if (dialog.$.find("div.yuanyin a i").hasClass("pic-checked")) {
              cs = dialog.$.find("div.yuanyin a i.pic-checked").attr("_i");

            } else if (str1 !== "") {
              cs = dialog.$.find(".clip-name2 textarea").attr('_i');
            } else {
              alert(languages[CURRENT_PROJECT_LANGUAGE].lpp106);
            }
            if (cs !== undefined) {
              alert(languages[CURRENT_PROJECT_LANGUAGE].lpp105);
              $container.find("a.nowarning").addClass("hide");
              $container.find("a.warning").addClass("show");
              CallServer.CallServer["video_report_callserver"]({
                method: 'report',
                deviceid: deviceInfo.deviceid,
                type: cs,
                reason: str1

              }, function(_data) {
                if (_data.error_code) {
                  _data = {
                    reprortnum: 0,
                    device_list: []
                  };
                }

              });
            }
          });

        } else {

          DLdialog = new Dialog({
            title: languages[config.language]['lpp108'],
            noFooter: true,
            html: [
              "<div class = 'save-video-wrap3'>",
              "<p>" + languages[config.language]['lpp109'] + "</p>",
              "<div class = 'btns-3'>",
              "<a class = 'save-3' ><span>" + languages[config.language]['lpp110'] + "</span></a>",

              "</div>",
              "</div>"
            ].join("")
          });
          DLdialog.show();
          DLdialog.$.find("div.btns-3 a.save-3").click(function() {
            OAuth.init();
          });
        }
      });

      $container.find(".fn-handle").click(function() {
        var Elem = $container.find('.panels').css('display');
        if (Elem === "none") {
          $container.find('.pic-drophandle').css('display', 'none');
          $container.find('.pic-uphandle').css('display', 'block');
          $container.find('.fn-share').css('border', '1px solid #ddd');
          $container.find('.fn-share').css('border-bottom', '1px solid #f9f9f9');
          $container.find(".panels").css('display', 'block');
        } else {
          $container.find('.pic-drophandle').css('display', 'block');
          $container.find('.fn-share').css('border', '1px solid transparent');
          $container.find('.pic-uphandle').css('display', 'none');
          $container.find('.border-hide').css('margin-top', '0px');
          $container.find(".panels").css('display', 'none');
        }
      });
      var fuzhi = function() {
        $container.find("#link1").val(strfu);
       };
      fuzhi();

      $container.find(".sview .form_btn_s span.next").click(function() {
        var $input_content = $container.find("#link1");
        $input_content.select();
        document.execCommand("Copy");
        alert("复制成功。现在您可以粘贴（ctrl+v）分享给站外好友了。");
      });
      $container.find(".sview2 .form_btn_s span.next2").click(function() {
        var $input_content = $container.find("#link2");
        $input_content.select();
        document.execCommand("Copy");
        alert("复制成功。现在您可以粘贴（ctrl+v）到博客或论坛中了。");
      });
      $container.find(".sview3 .form_btn_s span.next3").click(function() {
        var $input_content = $container.find("#link3");
        $input_content.select();
        document.execCommand("Copy");
        alert("复制成功。现在您可以粘贴（ctrl+v）到博客或论坛中了。");
      });
      $container.find(".sview4 .form_btn_s span.next4").click(function() {
        var $input_content = $container.find("#link4");
        $input_content.select();
        document.execCommand("Copy");
        alert("复制成功。现在您可以粘贴（ctrl+v）到博客或论坛中了。");
      });

      $container.find(".mtime-list-menu-wrap").bind("click",function(){
        renderVideoStatus("on-show-history-hourlist", null, isOnStatus("on-show-history-hourlist"));
      });
      $container.find(".btn-time-list").bind("click",function(){
        renderVideoStatus("on-show-history-hourlist", null, isOnStatus("on-show-history-hourlist"));
      });
      $hourlist.bind("touchstart click",function(e){
        var $target = $(e.target || e.srcElement).closest("li");
        if (!$target.is("li")) {
          return;
        }
        var h = Number($target.attr("_v"));
        $hourlist.find(".selected").removeClass("selected");
        $target.addClass("selected");
        renderVideoStatus("on-show-history-hourlist", null, true);
        if (h !== -1 && h !== "") {
          renderVideoStatus("on-history-time");
          currentHourIndex = h;
          renderTimeline();
          scrollTimeline(Number($target.attr("_d")), true);
        } else if (h === -1) {
          renderVideoStatus("on-history-date");
          renderTimeline();
          scrollTimeline(historyData.day.items[currentDateIndex].date, true);
        }
        if(!IX.browser.versions.mobile){
          var timeTip_date = $container.find("a.time-tip").attr("_date");
          if (timeTip_date) {
            renderTimeTrigger(new Date(Number(timeTip_date)));
          }
        }
      });

      if(needModule("size-controller")){
        bindSizeControllerEvent();
      }
      if(needModule("exts")){
        bindVolumnEvent();
        bindFullScreenEvent();
        bindYunTaiEvent();
        bindJianJiEvent();
      }
      if(needModule("mobile-yuntai")){
        bindYunTaiEvent();
      }
      window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function(){
        if(window.orientation===180||window.orientation===0){
          resetSize(document.documentElement.clientWidth);
        }
        if(window.orientation===90||window.orientation===-90){
          resetSize(document.documentElement.clientHeight * 16 / 9);
        }
      }, false);
    };

    var debug = function(){
      if(!config.debug) return;

      var _d = $debug.html();
      $debug.html(_d + Array.prototype.slice.call(arguments).join("") + "<br/>");
    };
    var isPlaying = false, startHLSTime = 0;
    var playTrigger, playErrorTime = 0, currentLivePlayTime = 0;
    var renderPlayer = function() {
      isPlaying = false;
      startHLSTime = 0;
      playErrorTime = 0;
      currentLivePlayTime = 0;
      if(playTrigger) clearInterval(playTrigger);
      if(metaTrigger) clearInterval(metaTrigger);
      renderVideoStatus("on-pause-play", null, true);
      if(!currentPlayUrl)renderVideoStatus("on-zhibo-playing", null, true);
      rerenderPlayerTime = 0;
      if (IX.browser.versions.mobile) {

        var t = navigator.userAgent.toLowerCase();
        var isWeixin = t.match(/MicroMessenger/i);
        isWeixin = isWeixin && isWeixin[0] === "micromessenger";
        $videoPlayer.html([
          "<div style = 'width: " + config.width + "px; height: " + config.height + "px'>",
          "<div class = 'd1'></div>",
          "<div style = 'background-image:url(" + (deviceInfo && deviceInfo.thumbnail) + ")' class = 'd2'></div>",
          "</div>",
          "<video style = 'display:none' " + (config.playsinline || isWeixin ? "webkit-playsinline" : "") + (" controls autoplay='autoplay' ") + " preload width='" + config.width + "' height='" + config.height + "'></video>"
        ].join(""));
        player = $container.find("video")[0];
        player.poster = deviceInfo && deviceInfo.thumbnail;
        player.src = currentPlayUrl;


        var currentPlayTime = 0, errorTime = 0, _startPlay = false, playererror = false;
        console.info(currentPlayUrl);
        if (deviceInfo) {
          $zloading.hide();
          $videoPlayer.find(">div").remove();
          $videoPlayer.find("video").show();
          player.onabort = player.onplaying = player.onclick = player.onbeforeload = player.ondurationchange = player.onload = player.onloadeddata = player.onloadedmetadata = player.onloadstart = function(){ console.info(event.type); debug(event.type); };
          
          if(document.location.search.indexOf("nocontrols") > -1){
            player.controls = null;
            player.onclick = function(){
              player.play();
            };
          }else{
            player.controls = "controls";
          }
          startPlaying = true;
          metaTrigger = setInterval(function(){
            if(!_startPlay && !playererror) return;
            debug(currentPlayTime, player.currentTime);
            if(currentPlayTime !== player.currentTime){
              currentPlayTime = player.currentTime;
              errorTime = 0;
            }else{
              errorTime ++;
              if(errorTime > 10){
                errorTime = 0;
                debug("reset play src");
                player.pause();
                player.poster = deviceInfo && deviceInfo.thumbnail;
                player.src = player.src;
                _startPlay = false;
                player.play();
              }
            }
          }, 1000);
          config.onPlaying();
        }
        player.onpause = function(){
          _startPlay = false;
        };
        player.addEventListener("pause", function(){
          _startPlay = false;
        });
        player.onloadedmetadata = function(){
          debug("连接成功！");
        };
        player.addEventListener("loadedmetadata", function(){
          debug("连接成功！");
        });
        player.onplaying = function(){
          console.info(event.type);
          debug("开流时间：" + (new Date().getTime() - time) + "ms");
          _startPlay = true;
        };
        player.addEventListener('playing', function() {
          console.info(event.type);
          debug("开流时间：" + (new Date().getTime() - time) + "ms");
          _startPlay = true;
        }, false);
        var time;
        player.onplay = function(){
          time = new Date().getTime();
          console.info(event.type);
          debug(event.type);
        };
        player.oncanplay = player.oncanplaythrough = function() {
          $zloading.hide();
          $videoPlayer.find(">div").remove();
          $videoPlayer.find("video").show();
          startPlaying = true;
          console.info(event.type);
          debug(event.type, "on");
          config.onPlaying();
        };
        player.addEventListener('canplay', function() {
          $zloading.hide();
          console.info(event.type);
          debug(event.type, "addEventListener");
          $videoPlayer.find(">div").remove();
          $videoPlayer.find("video").show();
          startPlaying = true;
          config.onPlaying();
        }, false);
        player.onerror = function() { //a,b,c
          console.info(player.status, player.state);
          debug(event.type);
          _startPlay = false;
          playererror = true;
        };
      } else {
        $videoPlayer.css({
          height: config.height + "px",
          width: config.width + "px"
        });
        var startPlayTime, debugPlay = false;
        var on_player_ready = function() {
          if (streamType === "rtmp") {
            player.playType = 1;
          } else {
            player.playType = 0;
          }
          startPlaying = true;
          if (currentPlayUrl) {
            debugPlay = false;
            console.info("play url", currentPlayUrl);
            startPlayTime = new Date().getTime();
            if (streamType === "rtmp") {
              player.play(currentPlayUrl);
              playTrigger = setInterval(function(){
                var time = player.get_live_time();
                if(time !== currentLivePlayTime){
                  currentLivePlayTime = time;
                }else{
                  playErrorTime ++;
                  if(playErrorTime > 8){
                    clearInterval(playTrigger);
                    player.stop();
                    playErrorTime = 0;
                    isPlaying = false;
                    if(isOnStatus("on-zhibo-playing")){
                      getLivePlayUrl(-1);
                    }else{
                      renderPlayer();
                    }
                  }
                }
              }, 1000);
            } else {
              player.play_hls_source(currentPlayUrl);
            }
            config.onPlaying();
          }
          if(config.IsMuted){
            player_volume = 0;
          }
          player.set_volume(player_volume);
          setTimeout(function() {
            if(config.IsMuted){
              player_volume = 0;
            }
            player.set_volume(player_volume);
          }, 500);

          player.enable_double_click_full_screen(false);
        };
        var playHlsTime = 0;
        if (!player) {
          player = new BlsPlayer($videoPlayer.children("div")[0].id, config.width, config.height);
          player.start(("/public/js/ui/BlsPlayer.swf?" + CURRENT_PROJECT_TIMESTAMP));


          player.on_stream_metadata = function(){
            console.info("on_stream_metadata enter");
            var stime, buffertime;
            metaTrigger = setInterval(function(){
              var time = player.get_live_time();
              buffertime = player.get_buffer_time();
              if(time !== 0){
                stime = stime || time;
                console.info("on_stream_metadata load", stime, time, time - stime, buffertime);
                debug("直播开流时间：", (new Date().getTime()) - startPlayTime + "ms");
                if(deviceInfo.connect_type === 1 && stime >= 0.8 || time - stime >= 0.8 || buffertime >= 0.8){
                  console.info("removeClass");
                  $zloading.hide();
                  clearInterval(metaTrigger);
                }
              }
            }, 100);
          };
          player.on_connection_status = function(_status) { //info
            window.console.info("on_connection_status", _status.code);
            if(_status.code === "NetConnection.Connect.Closed"){
            }else if(_status.code === "NetConnection.Connect.Success"){
              startPlayTime = new Date().getTime();
              debug("连接成功");
            }
          };
        }
          player.on_hls_time_update = function(_time) { //(
            playHlsTime = _time;
            window.console.info("on_hls_time_update", arguments);
            if(startHLSTime === 0 && _time - startHLSTime < 1 && isPlaying && !debugPlay){
              debugPlay = true;
              $zloading.hide();
              debug("录像开流时间：", new Date().getTime() - startPlayTime + "ms");
            }
          };
        if(!startPlaying){
          player.on_player_ready = on_player_ready;
        }else{
          on_player_ready();
        }
        player.on_hls_play_state_change = function(_state) {
          window.console.info("on_hls_play_state_change", arguments);
          if (_state === "playing") {
            isPlaying = true;
            debug("录像连接成功");
            playHlsTime = 0;
          }
          if(_state === "stopped"){
            isPlaying = false;
            startHLSTime = 0;
            debug("录像结束");
            playHistory(currentHistoryStartTime + playHlsTime + dplaylisttime);
            renderTimeTrigger(new Date(currentHistoryStartTime * 1000 + playHlsTime * 1000));
          }
        };
      }
    };

    //生成日期选择区域
    var renderDays = function(_index) {
      if (!historyData) {
        return;
      }
      var items = [];
      var days = historyData.day.items;
      if (days.length >= 7) {
        if (_index === undefined) {
          items = days.slice(days.length - 6);
        } else {
          var start = _index <= 2 ? _index : (_index - 2);
          if (_index <= 2) {
            start = 0;
          } else if (days.length - (_index + 1) <= 6) {
            start = days.length - 6;
          } else {
            start = _index - 2;
          }
          items = days.slice(start, start + 6);
          if(IX.browser.versions.mobile){
            for(var i in items){
              items[i].week = "";
            }
          }
        }
        items = items.concat([{
          clz: "more",
          date: "more",
          day: languages[config.language]['lp70'],
          week: ""
        }]);
      } else {
        items = days;
      }

      $date_choosen_wrap.html(new IX.ITemplate({
        tpl: [
          "<tpl id = 'items'>",
          "<button _date='{date}' class = 'bb {clz}'><span>{day}</span><span>{week}</span></button>",
          "</tpl>"
        ]
      }).renderData("", {
        items: items
      }));
      if (_index === undefined) {
        $date_choosen_wrap.find("button.bb:not(.more):last").addClass("active");
      } else {
        $date_choosen_wrap.find("button.bb:not(.more)[_date='" + historyData.day.items[_index].date + "']").addClass("active");
      }
      $container.find("button.btn-show-history span.s-date").text(historyData.day.items[currentDateIndex].day);

      if (isOnStatus("on-menus-float")) {
        $date_choosen_wrap.find("button").each(function() {
          this.style.width = (100 / $date_choosen_wrap.find("button.bb:not(.more)").length) + "%";
        });
      }

      var rangeStart = new Date(historyData.day.items[0].date);
      var rangeEnd = new Date(historyData.day.items[historyData.day.items.length - 1].date);
      if(!IX.browser.versions.mobile){
        $date_choosen_wrap.find("button.more").datetimepicker({
          language: config.language === "zh-cn" ? "zh-CN" : "en",
          minView: 2,
          initialDate: _index === undefined ? rangeEnd : new Date(historyData.day.items[_index].date),
          autoclose: true,
          pickerPosition: isOnStatus("on-menus-float") ? "top-right" : "bottom-right",
          startDate: rangeStart.getFullYear() + "-" + (rangeStart.getMonth() + 1) + "-" + rangeStart.getDate() + " 00:00:00",
          endDate: rangeEnd.getFullYear() + "-" + (rangeEnd.getMonth() + 1) + "-" + rangeEnd.getDate() + " 23:59:00"
        }).on("changeDate", function(ev) {
          var date = new Date(ev.date.getUTCFullYear() + "/" + (ev.date.getUTCMonth() + 1) + "/" + ev.date.getUTCDate() + " 00:00:00").getTime();
          var $date = $date_choosen_wrap.find("button[_date='" + date + "']");
          if ($date.length > 0) {
            if ($date.is(".active")) {
              return;
            }
            $date_choosen_wrap.find(".active").removeClass("active");
            $date.addClass("active");
          } else {
            renderDays(historyData.day.videoHash[date].itemIndex);
          }
          currentDateIndex = historyData.day.videoHash[date].itemIndex;
          currentHourIndex = 0;
          renderVideoStatus("on-history-date");
          renderTimeline();
          renderHourList();
          scrollTimeline(historyData.day.items[currentDateIndex].date);
        });
      }else{
        var showDateDialog = function(){
          var dateDialog = new Dialog({
            noHeader: true,
            noFooter: true,
            className: "date-list",
            html: new IX.ITemplate({
              tpl: [
                "<div class='title'>",
                "<span class='cancel'>取消</span>",
                "<span class='choose-date'>选择日期</span>",
                "<span class='submit'>确定</span>",
                "</div>",
                "<ul>",
                "<tpl id = 'items'>",
                "<li _date='{date}' class = 'cc {clz}'><span>{day}</span><i></i></button>",
                "</tpl>",
                "</ul>"
              ]
            }).renderData("", {
              items: historyData.day.items
            })
          });

          dateDialog.show();

          dateDialog.$.find("div.title span.cancel").click(function() {
            dateDialog.remove();
            isShowDateDialog = false;
          });
          dateDialog.$.find("div.title span.submit").click(function() {
            
          });
          dateDialog.$.find("li").click(function() {
            var date = $(this).attr("_date");
            dateDialog.remove();
            isShowDateDialog = false;
            currentDateIndex = historyData.day.videoHash[date].itemIndex;
            currentHourIndex = 0;
            renderVideoStatus("on-history-date");
            renderDays(currentDateIndex);
            renderTimeline();
            renderHourList();
            scrollTimeline(historyData.day.items[currentDateIndex].date, true);
          });
        };
        $date_choosen_wrap.find("button.more").click(showDateDialog);
        
      }
      
    };

    //显示时间刻度指针
    var renderTimeTrigger = function(_date, noTrigger) {
      if (!_date) {
        return;
      }
      var $time_tip = $container.find(".time-tip").show(),
          $mtime_tip = $container.find(".m-time-tip").show(),
        left;
      var _dateTime;

      $time_tip.hide();
      if(!IX.browser.versions.mobile){
        _dateTime = _date.getTime();
        if (_dateTime < dateFullStartTime || _date.getTime() - dateFullEndTime > 24 * 3600000) {
          return;
        }
        $time_tip.show();
        if (timeTipTrigger) {
          clearInterval(timeTipTrigger);
        }
        var timeUnitWidth = getUnitTimeWidth();

        left = getLeftByTime(_date.getTime());

        $time_tip.text(addZero(_date.getHours()) + ":" + addZero(_date.getMinutes())).attr("_date", _date.getTime());
        $time_tip.css("left", (left - 22) + "px");
        if (noTrigger) {
          return;
        }
        timeTipTrigger = setInterval(function() {
          left += timeUnitWidth;
          $time_tip.css("left", (left - 22) + "px");
          _dateTime += 60 * 1000;
          _date = new Date(_dateTime);
          $time_tip.text(addZero(_date.getHours()) + ":" + addZero(_date.getMinutes())).attr("_date", _dateTime);
        }, 60 * 1000);
      }else{
        $mtime_tip.find("span.fulltime").text(addZero(_date.getFullYear()) + "-" + addZero(_date.getMonth() + 1) + "-" + addZero(_date.getDate()) + " " + addZero(_date.getHours()) + ":" + addZero(_date.getMinutes())+ ":" + addZero(_date.getSeconds()));
      }

    };

    var renderHourList = function() {
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
    };

    //生成录像选择区域
    var renderTimeline = function() {
      if (!historyData) {
        return;
      }
      renderVideoStatus("on-jianji", null, true);

      var $timetagWrap = $container.find("div.timetags"),
        width, dw;
      var startPos, endPos;
      var touchArea = {
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
              x:0,
              y:0
            };
            timelineValue = Number($container.find(".timeline-main").css("margin-left").replace('px', '')) || 0;
            // 绑定事件
            this.slider.addEventListener('touchmove', this, false);
            this.slider.addEventListener('touchend', this, false);
          },
          // 移动
          move: function(event) { // 当屏幕有多个touch或者页面被缩放过，就不执行move操作
            if (event.touches.length > 1 || event.scale && event.scale !== 1) {
              return;
            }
            var touch = event.touches[0];
            
            endPos = {
              x: touch.pageX - startPos.x, //
              y: touch.pageY - startPos.y
            };
            var isScrolling = Math.abs(endPos.x) < Math.abs(endPos.y) ? 1 : 0; //isScrolling为1时，表示纵向滑动，0为横向滑动
            if (isScrolling === 0) {
              event.preventDefault(); 
              scrollTimeline("", false, endPos.x );
            }
          },
          // 滑动释放
          end: function() { //event
            var duration = +new Date() - startPos.time; // 滑动的持续时间
            //this.icon[this.index].className = '';
            if (Number(duration) <= 100 || Math.abs(endPos.x) < 20) {
              return;
            }
            mvideoTimeStart = Math.floor(mtimeStart + dplaylisttime * 1000);
            currentHistoryStartTime = Math.floor(mtimeStart / 1000);
            playHistory(Math.floor(mvideoTimeStart / 1000));

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
          if ( !! self.isTouch) {
            self.slider.addEventListener('touchstart', self.events, false);
          }
        }
      };
      if (!isOnStatus("on-history-time")) {
        // var itemsLength = !IX.browser.versions.mobile ? historyData.day.items.length - 1 : historyData.day.items.length + 1;
        $playlist.html(timeLineTpl.renderData("", {
          items: historyData.day.videoList
        }));
        $timelineWrap.html((!isOnStatus("on-full-screen") ? timelinesTpl : timelines_whiteTpl).renderData("", {
          items: (new Array(historyData.day.items.length - 1)).join("1").split("1")
        }));
        $timetagWrap.html(timeTags_day_tpl.renderData("", {
          items: historyData.day.items
        }));
        width = (historyData.day.items.length - 1) * (itemWidth - 1) + itemWidth;
       
        $container.find(".timeline-wrap").width(width);
        $timelineWrap.find("img").width(itemWidth - 1);
        $timelineWrap.find("img:last").width(itemWidth);

        dw = width / (4 * historyData.day.items.length);
        $timetagWrap.find("span").width(dw);
        if(!IX.browser.versions.mobile){
           $container.find(".timeline-main").width(width + 60);
          $timetagWrap.find("span:first, span:last").width(dw / 2 + 20);
        }else{
          $container.find(".timeline-main").width(width);
          $container.find(".tmleft").css({"width": itemWidth/2,"left":-itemWidth/2, "display":"inline-block"});
          $container.find(".tmleft img").css({"width":itemWidth,"left": -(itemWidth - 1)/2});
          $container.find(".tmright").css({"width":itemWidth/2,"right":-itemWidth/2, "display":"inline-block"});
          $container.find(".tmright img").css({"width":itemWidth,"right":-(itemWidth - 1)/2});
          $timetagWrap.find("span:first").css("padding-left","0px");
          $timetagWrap.find("span:last").css("padding-right","0px");
          $timetagWrap.find("span:first, span:last").width(dw / 2);
          timelineMainWidth = width;
          touchArea.init();
        }
      } else {
        $playlist.html(timeLineTpl.renderData("", {
          items: historyData.hour.videoList
        }));
        $timelineWrap.html((!isOnStatus("on-full-screen") ? timelinesTpl : timelines_whiteTpl).renderData("", {
          items: (new Array(historyData.day.items.length * 24 - 1)).join("1").split("1")
        }));
        $timetagWrap.html(timeTags_hour_tpl.renderData("", {
          items: historyData.hour.timelineList
        }));
        width = (historyData.day.items.length * 24 - 1) * (itemWidth - 1) + itemWidth;
        $container.find(".timeline-main").width(width + 60);
        $container.find(".timeline-wrap").width(width);
        $timelineWrap.find("img").width(itemWidth - 1);
        $timelineWrap.find("img:last").width(itemWidth);

        dw = width / (4 * historyData.day.items.length * 24);
        $timetagWrap.find("span").width(dw);
        
        if(!IX.browser.versions.mobile){
          $timetagWrap.find("span:first, span:last").width(dw / 2 + 10);
        }else{
          $timetagWrap.find("span:first").css("padding-left","0px");
          $timetagWrap.find("span:last").css("padding-right","0px");
          $timetagWrap.find("span:first, span:last").width(dw / 2);
          timelineMainWidth = width;

          touchArea.init();
        }
      }
    };
    var mvideoTimeStart, mtimeStart;
    var scrollTimeline = function(_date, _tag, _moveX) {
      var left;
      if(!IX.browser.versions.mobile){
        currentScrollTime = _date;
        left = Math.min(Math.max(getScrollLeftByTime(_date), 0), getScrollLeftByTime(dateFullEndTime + 24 * 60 * 60 * 1000));
        $scrollwrap[0].scrollLeft = left;
      }else{
        var moveX;
        $container.find("video")[0].pause();
        if(_moveX){
          moveX = timelineValue + _moveX;
        }else{
          if(!isOnStatus("on-history-time")){
            moveX = -currentDateIndex * (itemWidth - 1);
          }else{
            moveX = -currentDateIndex * 24 * (itemWidth - 1) -currentHourIndex * (itemWidth - 1);
          }
        }


        if(moveX < (-timelineMainWidth + itemWidth) - itemWidth/2 ){moveX = -timelineMainWidth + itemWidth - itemWidth/2 ;}
        if(moveX > (itemWidth)/2 ) moveX = (itemWidth)/2;
        if(moveX > 0) left = - Math.abs(moveX) + itemWidth/2;
        else left = Math.abs(moveX) + (itemWidth)/2;
        
        left += Math.floor(left / itemWidth);

        mtimeStart = Math.floor(dateFullStartTime + left / getUnitTimeWidth());
        renderTimeTrigger(new Date(mtimeStart));
       

        if(_moveX && !isOnStatus("on-history-time")){
          var currentTmp;
          currentTmp = Math.floor(Math.abs((left - 1)/(itemWidth)));
          if(currentTmp > historyData.day.items.length - 1){
            currentTmp = historyData.day.items.length - 1;
          }

          if (currentTmp !== currentDateIndex ) {
            currentDateIndex = currentTmp;
            renderDays(currentDateIndex);
            currentHourIndex = 0;
            renderHourList();
          }
        }
        if(_tag){
          mvideoTimeStart = Math.floor(mtimeStart + dplaylisttime * 1000);
          currentHistoryStartTime = Math.floor(mtimeStart / 1000);
          playHistory(Math.floor(mvideoTimeStart / 1000));
        }

        $timelineMain.css("margin-left",  moveX + "px"); 
      }
    };

    

    var initTimeline = function(_scrollTime, _playTime) {
      if (timelineReady) {
        return;
      }
      timelineReady = true;
      renderDays(currentDateIndex);
      renderTimeline();
      renderHourList();
      if (historyData) {
        scrollTimeline(_scrollTime || historyData.day.items[currentDateIndex].date , false, -timelineMainWidth + itemWidth);
      }
      if(!IX.browser.versions.mobile)
        renderTimeTrigger(new Date(_playTime || (currentTime + (new Date()).getTime() - bindStartTime)));
    };

    //获取录像时间片段
    /*
      {
        results: [
          [11111,11111,....]
        ]
      }
    */
    var getHistoryList = function() {
      dateEnd = currentDate;
      dateStart = new Date(currentTime - 86400000 * ((deviceInfo.isMyCamera ? deviceInfo['cvr_day'] : 7) - 1));

      dateFullStart = new Date(dateStart.getFullYear() + "/" + (dateStart.getMonth() + 1) + "/" + dateStart.getDate() + " 00:00:00");
      dateFullEnd = new Date(dateEnd.getFullYear() + "/" + (dateEnd.getMonth() + 1) + "/" + dateEnd.getDate() + " 00:00:00");

      dateFullStartTime = dateFullStart.getTime();
      dateFullEndTime = dateFullEnd.getTime();

      var stime = dateStart.getTime() / 1000 + 28800;
      var etime = dateEnd.getTime() / 1000 + 28800;

      if (deviceInfo["cvr_day"] !== 0 && deviceInfo.share <= 2) {
        renderVideoStatus("on-has-history");
      }

      CallServer.CallServer[deviceInfo.connect_type === 2 ? "video_play_list_ly_callserver" : "video_play_list_callserver"](_.extend({
          method: "playlist",
          st: stime,
          et: etime
        }, !config.isPrivate ? {
          shareid: deviceInfo.shareid,
          uk: deviceInfo.uk
        } : {
          deviceid: deviceInfo['deviceid']
        }),
        function(data) {
          if (data && !data.error_code) {
            sourcePlayList = typeof(data['results']) !== "undefined" ? data['results'] : [];
            parsePlayList(sourcePlayList);
            if (historyData) {
              renderVideoStatus("on-has-history");
              $container.find("button.btn-show-history span.s-date").text(historyData.day.items[historyData.day.items.length - 1].day);
            }
            currentDateIndex = historyData.day.items.length - 1;
            currentHourIndex = 0;

            if (isOnStatus("on-history-playing")) {
              initTimeline();
            }
          }
        }

      );
    };
    //判断m3u8文件是否存在
    var checkHlsUrlExists = function() {
      if(startPlaying) {return;}
      checkHlsStatusTimes++;
      if (checkHlsStatusTimes > 10) {
        return bindData(deviceInfo);
      }
      CallServer.CallServer["video_checkHlsSatus_callserver"]({
        // method: "get_hls_status",
        uri: currentPlayUrl
      }, function(_data) {
        if (_data.error_code || !_data.status) {
          if (checkHlsStatusTimes < 10) {
            return setTimeout(checkHlsUrlExists, 200);
          } else {
            return bindData(deviceInfo);
          }
        }
        renderPlayer();
      });
    };
    var ds = [
      ["eeb4dab075e999e24c34c8d5ec8b2137", "168903"],
      ["1422612bfcf648bdb26716e8133a3a55", "168903"],
      ["ee29a2d33487a284a90ba6357a3be98b", "168903"],
      ["06844a12aec14313a425306b99bc7068", "168903"],
      ["e80997c56b4818e32d00f1f707b203fe", "168903"],
      ["48bde4da8440e4432c0a4f1b35a17a4e", "168903"],
      ["599c0f5bc5f1ad60acf47ef67c666f71", "168903"],
      ["835b27f48936d59201ff7256d44877d8", "168903"],
      ["783bf9eb3aefe93d86f482cdd773389c", "168903"],
      ["7cc85e9a6146eb58e6e93b1264749923", "168903"],
      ["b4991b0a3d44d245dd2a9face5c72745", "168903"],
      ["2422470bf87b19ad8d78f42789251367", "168903"],
      ["bc1266d90ab5ffbf61084674070eae2a", "168903"],
      ["a659d88f54fcb56c47e5d088674c9530", "168903"],
      ["188a66091c06879f459c8327311e1c19", "168903"]
    ];
    var showErrorMsg = function(_t) {
      for(var i = 0; i < ds.length; i ++){
        if(deviceInfo.shareid === ds[i][0] && Number(deviceInfo.uk) === Number(ds[i][1])){
          _t = "直播结束";
          break;
        }
      }
      $container.addClass("has-error");
      $zloading.hide();
      $videoPlayer.html("<p class = 'error'>" + _t + "</p>");
      config.onError();
    };
    //获取直播地址
    var getLivePlayUrl = function(_max) {
      getlivePlayUrlTime++;
      _max = _max || 10;
      if (_max !== -1 && getlivePlayUrlTime > _max) {
        if (IX.browser.versions.mobile) {
          bindData(deviceInfo);
        }
        return;
      }

      var callbackFn = function(data){
        config.videoLivePlayData = null;
        if (!data || typeof(data['url']) === 'undefined' && typeof(data['src']) === 'undefined' || (data['status'] & 0x4) === 0) {

          if (data && data.error_code) {
            showErrorMsg(data.error_msg === "device share not exist" ? languages[config.language]['lp67'] : data.error_msg);
            return;
          }
          if (data['status'] !== undefined && (data['status'] & 0x4) === 0) {
            showErrorMsg(languages[config.language]['lp68']);
            return;
          }
          if (_max === -1 || getlivePlayUrlTime < _max) {
            setTimeout(function() {
              getLivePlayUrl(_max);
            }, 200);
            return;
          }else{
            getlivePlayUrlTime = 0;
          }
        }
        currentPlayUrl = data["url"] || data["src"];
        deviceInfo.description = data['description'];
        deviceInfo.playUrl = currentPlayUrl;
        config.onBaseInfo(deviceInfo);
        if (IX.browser.versions.mobile) {
          checkHlsUrlExists();
        } else if (isOnStatus("on-zhibo-playing")) {
          streamType = "rtmp";
          renderPlayer(); //99
        }

      };
      if(config.videoLivePlayData){
        return callbackFn(config.videoLivePlayData);
      }
      CallServer.CallServer[deviceInfo.connect_type === 2 ? "video_getLivePlayUrl_ly_callserver" : "video_getLivePlayUrl_callserver"](_.extend({
        method: "liveplay"
      }, !config.isPrivate ? {
        shareid: deviceInfo.shareid,
        uk: deviceInfo.uk
      } : {
        deviceid: deviceInfo['deviceid']
      }, IX.browser.versions.mobile ? {
        type: "hls"
      } : {}), callbackFn, function(data) {
        var ex;
        try{
          ex = JSON.parse(data.responseText);
        }catch(exxx){

        }
        if (ex && ex.error_code) {
          showErrorMsg(ex.error_msg === "device share not exist" ? languages[config.language]['lp67'] : ex.error_msg);
          return;
        }
        if (_max === -1 || getlivePlayUrlTime < _max) {
          setTimeout(function() {
            getLivePlayUrl(_max);
          }, 200);
          return;
        }
      });
    };

    var needModule = function(_moduleName){
      return config.modules && ("," + config.modules.join() + ",").indexOf("," + _moduleName + ",") > -1;
    };

    var bindData = function(_deviceInfo) {
      deviceInfo = _deviceInfo;
      bindStartTime = new Date();
      currentDate = new Date();
      currentDate = new Date(IX.Date.getDateByFormat(currentDate, "yyyy/MM/dd HH:mm:ss"));
      currentTime = currentDate.getTime();
      getlivePlayUrlTime = 0;
      checkHlsStatusTimes = 0;
      deviceInfo.connect_type = Number(deviceInfo.connect_type);
      if(deviceInfo.connect_type === 2){
        dplaylisttime = 0;
      }
      if (deviceInfo.subscribe === 1) {
        $container.find("a.nocollect").addClass("hide");
        $container.find("a.collect").addClass("show");
      }
      if (parseFloat(deviceInfo.approvenum) > 10000) {
        deviceInfo.approvenum = Math.round((deviceInfo.approvenum / 10000) * 10) / 10;
        deviceInfo.approvenum = deviceInfo.approvenum + languages[CURRENT_PROJECT_LANGUAGE].lpp107;

      } else {
        deviceInfo.approvenum = deviceInfo.approvenum;
      }
      $container.find(".fn-updown span.stat").text(deviceInfo.approvenum);
      if (parseFloat(deviceInfo.viewnum) > 10000) {
        deviceInfo.viewnum = Math.round((deviceInfo.viewnum / 10000) * 10) / 10;
        deviceInfo.viewnum = deviceInfo.viewnum + languages[CURRENT_PROJECT_LANGUAGE].lpp107;

      } else {
        deviceInfo.viewnum = deviceInfo.viewnum;
      }
      $container.find(".fn-play span.stat").text(deviceInfo.viewnum);
      if (_deviceInfo.currentDPI !== 1080 || _deviceInfo.nameplate === "HDW") {
        currentDPI = {
          w: 1280,
          h: 720
        };
      } else {
        currentDPI = {
          w: 1920,
          h: 1080
        };
      }
      if (_deviceInfo.isCloud === 1) {
        renderVideoStatus("on-has-yuntai");
      }
      if (IX.browser.versions.mobile && _deviceInfo.isMyCamera  && _deviceInfo.isCloud === 1){
        renderVideoStatus("on-show-fyuntai");
      }
      // if (_deviceInfo.nameplate === "HDW" && _deviceInfo.plat_move === "1"){
      //   renderVideoStatus("on-show-yuntai-menu-nomanua");
      // }
      if (_deviceInfo.isGranted) {
        renderVideoStatus("on-granted");
      }
      if(config.showDesc){
        $container.find(".show-desc").show();
        $container.find(".show-desc a").text(deviceInfo.description);
        $container.find(".show-desc a").attr('href', (!config.isPrivate ? "/video/" + _deviceInfo.shareid + "/" + _deviceInfo.uk : "/video/" + _deviceInfo.deviceid));
      }
      bindViewEvent(deviceInfo);
      if (needModule("exts") && Number(deviceInfo['cvr_day']) !== 0) {
        getHistoryList();
      }
      getLivePlayUrl();
      /*CallServer.CallServer["video_query_history_callserver"]({
        method: "view",
        deviceid : _deviceInfo.deviceid
      }, function(_data){
        if(_data.error_code){
          _data = {
            count: 0,
            list: []
          };
        }
      });*/
    };

    var resetSize = function(_width, _height) {
      if (!_width) {
        return;
      }
      config.width = _width;
      config.height = _height || _width * 9 / 16;
      if(!IX.browser.versions.mobile){
        $lwrap.width(config.width - 78);
        itemWidth = config.width - 78 - 60;
      }else{
        itemWidth = config.width;
      }
      unitWidth_on_date = itemWidth / (24 * 3600000);
      unitWidth_on_hour = itemWidth / 3600000;

      $videoPlayer.css({
        height: config.height + "px",
        width: config.width + "px"
      });
      if(historyData){
        parsePlayList(sourcePlayList);
      }
      timelineReady = false;
      if (IX.browser.versions.mobile) {
        $videoPlayer.find("video").attr("width", config.width);
        $videoPlayer.find("video").attr("height", config.height);
      }else{
        player.set_vedio_size(config.width, config.height);
        initTimeline(currentScrollTime, Number($("a.time-tip").attr("_date")));
      }
    };

    var init = function() {
      $container = $(config.container);
      var new_tpl = tpl_tpl.replace("{pc_yuntai_tip_tpl}", needModule("exts") ? pc_yuntai_tip_tpl : "")
        .replace("{mobile_yuntai_tpl}", needModule("mobile-yuntai") ? mobile_yuntai_tpl: "")
        .replace("{video_exts_tpl}", needModule("exts") ? video_exts_tpl: "")
        .replace("{bottom_controller_tpl}", needModule("bottom-controller") ? bottom_controller_tpl: "")
        .replace("{size_controller_tpl}", needModule("size-controller") ? size_controller_tpl: "");
      var tpl = new IX.ITemplate({ tpl: new_tpl });
      $container.html(tpl.renderData("", _.extend({
        clz: [document.location.search.indexOf("s=1") > -1 ? "show-download" : ""].join(" "),
        id: IX.id()
      }, languages[config.language])));

      $timelineMain = $container.find(".timeline-main");
      $container = $container.find(".video-player-wrap");
      $videoPlayer = $container.find(".video-player");
      $date_choosen_wrap = $container.find(".btn-group");
      $playlist = $container.find(".playlist");
      $hourlist = $container.find(".hour-list>ul");
      $zloading = $container.find(".zloading");
      $scrollwrap = $container.find("div.scroll-wrap");
      $lwrap = $container.find("div.l-wrap");
      $timelineWrap = $container.find("div.timelines");

      if(config.debug){
        if(IX.browser.versions.mobile){
          $debug = $("<div class = 'video-player-debug-info' style='position:fixed;bottom:0;z-index:99999;'></div>").appendTo("body");
        }else{
          $debug = $("<div class = 'video-player-debug-info' style='position:fixed;top:0;height:100%;overflow:auto; right:0; color: red;z-index:99999;'></div>").appendTo("body");
        }
      }
      renderPlayer();
      bindEvent();

      renderVideoStatus("on-zhibo-playing");
      if(!IX.browser.versions.mobile){
        $lwrap.width(config.width - 78);
        itemWidth = config.width - 78 - 60;
      }else{
        itemWidth = config.width;
      }
      
      unitWidth_on_date = itemWidth / (24 * 3600000);
      unitWidth_on_hour = itemWidth / 3600000;
      $videoPlayer.css({
        height: config.height + "px",
        width: config.width + "px"
      });
      if (config.showShareOptions) {
        $container.find(".fns").removeClass("hide1");
      } else {
        $container.find(".fns").addClass("hide1");
      }

      //云台
      $cloud_config = $container.find(".bottom-controller .yuntai .e-cloud-config"); //zc
      //var $cloud_op = $container.find(".yuntai .cloud-op"); //zc
      $cloud_notice = $container.find(".video-ops-wrap .cl-notice");
      $cloud_no = $container.find(".video-ops-wrap .cl-no");


      if (config.showEditMenus) {
        renderVideoStatus("on-show-edit-menus");
      }
      if (config.opsFloat !== "fixed") {
        renderVideoStatus("on-menus-float");
        renderVideoStatus("on-full-screen");
      } else {
        renderVideoStatus("on-layout-fixed");
      }
      if (!config.showOps) {
        renderVideoStatus("on-hidden-all-menus");
      }
      if (IX.browser.versions.mobile) {
        renderVideoStatus("on-mobile");
      }
    };

    var _model = {
      bindData: bindData,
      resetSize: function(_w, _h) {
        if (isOnStatus("on-full-screen")) {
          return;
        }
        resetSize(_w, _h);
      }
    };
    init();
    return _model;
  };


  return VideoPlayer;

});