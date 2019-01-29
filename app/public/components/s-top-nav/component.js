define(["oauth", "IX", "bootstrap"], function(OAuth) {
  var $element, $body, $liapp;
  var currentNav, currentUser;
  var be;
  var bindEvent = function() {
    var productTrigger, appTrigger;
    var logout = function() {
      OAuth.logout(function() {
        document.location.href = '/';
      });
    };
    var login = function() {
      OAuth.init();
    };
    $element.find("li.product").on('mouseover click', function() {
      if (productTrigger) {
        clearTimeout(productTrigger);
      }
      $body.addClass("show-product-sub-menu");
    });
    $element.find("li.app-download").on('mouseover click', function() {
      if (appTrigger) {
        clearTimeout(appTrigger);
      }
      $liapp.addClass("app-download-hover");
    });
    $element.find(".xiala").mouseleave(function() {
      productTrigger = setTimeout(function() {
        $body.removeClass("show-product-sub-menu");
      }, 300);
    });
    $element.find(".qccode").mouseleave(function() {
      appTrigger = setTimeout(function() {
        $liapp.removeClass("app-download-hover");
      }, 300);
    });
    $(window).scroll(function() {
      if ($element.find("#navbar").is(".in") && !$element.find("#product").is(".in")) {
        $element.find("#navbar").removeClass("in");
        $(".navbar-header button.chan").addClass("collapsed");
      }
    });
    $element.find("#navbar1 .navbar-right li.uinfo a.login").on(be ,login);
    $element.find("#navbar1 .navbar-right li.uinfo a.logout").on(be ,logout);
    $(".navbar-header button.login").on(be ,function(){
      if(currentUser){
        logout();
      }else{
        login();
      }
    });
  };
  var initNav = function() {
    var pathName = document.location.pathname.replace("/", "");
    currentNav = pathName.split("/")[0];

    if (!currentNav) {
      currentNav = "index";
    } else if (currentNav === "platform") {
      currentNav = "platform";
    } else if (currentNav === "sCheme"){
      currentNav = "sCheme";
    }else if (currentNav === "about") {
      currentNav = "about";
    } else if (currentNav === "supportoper" || currentNav === "support") {
      currentNav = "support";
    } else if (currentNav === "ptz") {
      currentNav = "product";

      $element.find("div.xiala a.xiaozhuan p").addClass("l");
      $element.find("ul.top-menus li.product ul#product li a.pa").addClass("ch");
    }else if (currentNav === "q1h") {
      currentNav = "product";

      $element.find("div.xiala a.q1h p").addClass("l");
      $element.find("ul.top-menus li.product ul#product li a.q1h").addClass("ch");
    }else if (currentNav === "p1h") {
      currentNav = "product";

      $element.find("div.xiala a.p1h p").addClass("l");
      $element.find("ul.top-menus li.product ul#product li a.p1h").addClass("ch");
    }else if (currentNav === "ai") {
      currentNav = "product";

      $element.find("div.xiala a.ai p").addClass("l");
      $element.find("ul.top-menus li.product ul#product li a.ai").addClass("ch");
    }else if (currentNav === "k1") {
      currentNav = "product";

      $element.find("div.xiala a.k1 p").addClass("l");
      $element.find("ul.top-menus li.product ul#product li a.k1").addClass("ch");
    } else if (currentNav === "product") {
      currentNav = "product";
      $element.find("div.xiala a.hb p").addClass("l");
      $element.find("ul.top-menus li.product ul#product li a.hb").addClass("ch");
    } else if (currentNav === "ball") {
      currentNav = "product";
      $element.find("div.xiala a.xiaoqiu p").addClass("l");
      $element.find("ul.top-menus li.product ul#product li a.xiaoqiu").addClass("ch");
    } else if (currentNav === "shop") {
      currentNav = "product";
      $element.find("div.xiala a.xiaoshangpu p").addClass("l");
      $element.find("ul.top-menus li.product ul#product li a.xiaoshangpu").addClass("ch");
    } else if (currentNav === "peripherals") {
      currentNav = "product";
      $element.find("div.xiala a.peijian p").addClass("l");
      $element.find("ul.top-menus li.product ul#product li a.peijian").addClass("ch");
    } else if (currentNav === "profile") {
      currentNav = "profile";
    } else if (currentNav !== "product" && currentNav !== "ball" && currentNav !== "ptz" && currentNav !== "ai" && currentNav !== "q1h" && currentNav !== "k1" && currentNav !== "peijian" && currentNav !== "profile") {

      currentNav = "main";
    }
    $element.find("li[data-menu='" + currentNav + "']").addClass("active");

    if (currentUser) {
      $element.find("#navbar1 .navbar-right li.uinfo").addClass("show has-login");
      $element.find(".navbar-header button span.logout").addClass("show");
      $element.find(".navbar-header button").addClass("logout");
      $element.find("#navbar1 .navbar-right li.uinfo a.user-info").text(currentUser.uname);
      
    } else {
      $element.find("#navbar1 .navbar-right li.uinfo").addClass("show");
      $element.find(".navbar-header button span.login").addClass("show");
    }

    $element.find(".disp .navbar-right-disp li").click(function() {
      $(this).addClass("active").siblings().removeClass("active");
      if ($(this)[0].className.indexOf("lyy-pr") >= 0) {
        if (currentNav === "ptz") {
          $element.find(".navbar-right-disp .lyy-parts").addClass("active");
        } else if (currentNav === "product") {
          $element.find("li.lyy-product").addClass("active");
        }
        return;
      }
      initNav();
    });
  };
  var scParty = function() {
    if (CURRENT_PROJECT_LANGUAGE === "zh-cn") {
      $(".sc-party").show();
      $(".language-sel a.zh").addClass("hover").siblings().removeClass("hover");
    } else {
      $(".sc-party").hide();
      $(".language-sel a.en").addClass("hover").siblings().removeClass("hover");
    }
    if (IX.browser.versions.mobile) {
      $(".sc-party").hide();
    }
  };
  var cookieFresh = function(language) {
    IX.Cookie.remove("language");
    if (CURRENT_PROJECT_TOPDOMAIN === "localhost") {
      IX.Cookie.set("language", language, {
        path: "/"
      });

    } else {
      IX.Cookie.set("language", language, {
        path: "/",
        domain: "." + CURRENT_PROJECT_TOPDOMAIN
      });
    }
    if (window.location.search.indexOf("lang")>0) {
      window.location.href = window.location.href.replace(IX.getUrlParams().lang,language);
    } else {
      window.location.href = window.location.href;
    }
    //window.location.reload();
  };
  var languageShift = function() {
    $("nav.top-header .en").click(function() {
      cookieFresh("en");
    });
    $("nav.top-header .zh").click(function() {
      cookieFresh("zh-cn");
    });
    $(".navbar-header button.e").click(function() {
      cookieFresh(CURRENT_PROJECT_LANGUAGE === "zh-cn" ? "en" : "zh-cn");
    });
  };

  var init = function() {
    $element = $("nav.top-header");
    $body = $("body");
    $liapp = $body.find("nav .container-fluid .navbar-menus .top-menus .app-download");
    currentUser = OAuth.getUser();
    be = IX.browser.versions.mobile ? "touchend" : "click";
    initNav();
    bindEvent();
    scParty();
    languageShift();
  };
  init();
});
