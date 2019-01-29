define(["oauth", "bootstrap"], function(OAuth) {

  var $element;
  var currentUser;
  var bindEvent = function() {
    var logout = function() {
      OAuth.logout(function() {
        document.location.href = '/';
      });
    };
    var login = function() {
      OAuth.init();
    };
    $element.find("#navbar1 .navbar-right li.uinfo a.login").on("click", login);
    $element.find("#navbar1 .navbar-right li.uinfo a.logout").on("click", logout);
  }
  var init = function() {
    
    $element = $("body>nav.pro-top-header");
    currentUser = OAuth.getUser();

    if (CURRENT_USERINFO.domain === 'zyy') {
      // $scope.isZhy = true;
      $element.find(".navbar-brand").hide();
    }

    var pathname = document.location.pathname;
    $element.find(".top-menus a[href='" + pathname + "']").parent().addClass("active");
    if (pathname.indexOf('face-library-id') > -1) {
      $element.find(".top-menus li.library").addClass("active");
    }
    if (pathname.indexOf('data-statistics') > -1) {
      $element.find(".top-menus li.data").addClass("active");
    }
    bindEvent();
    if (currentUser) {
      $element.find("#navbar1 .navbar-right li.uinfo").addClass("show has-login");
      $element.find(".navbar-header button span.logout").addClass("show");
      $element.find(".navbar-header button").addClass("logout");
      $element.find("#navbar1 .navbar-right li.uinfo a.user-info").text(currentUser.uname);
      $element.find("#navbar1 .navbar-right li.uinfo img.uphoto").attr('src', currentUser.avatar);
    } else {
      $element.find("#navbar1 .navbar-right li.uinfo").addClass("show");
      $element.find(".navbar-header button span.login").addClass("show");
    }
  };

  init();
});