define(["app","s_update"], function(Controllers) {
  Controllers.controller("ProLoginController", ["$scope", "$element", "UserUpdateService", "$timeout",
    function($scope, $element, UserUpdateService, $timeout) {
      var $container, $p;
      var languages = {
        "zh-cn": {
          "lp1": "请您填写用户名",
          "lp2": "请您填写密码",
          "lp3": "用户不存在",
          "lp4": "密码错误", 
          "lp7": "错误次数过多，15分钟后再试",
          "lp8": "登录失败，请刷新后重试"
        },
        "en": {
          "lp1": "Please fill in the username",
          "lp2": "Please fill in the password",
          "lp3": "",
          "lp4": "Password error",
          "lp7": "Too many mistakes, and then try again in 15 minutes",
          "lp8": "Logon failure"
        }
      };

      var renserStatus = function(_status) {
        $container.addClass(_status);
      };
      var unRenserStatus = function(_status) {
        $container.removeClass(_status);
      };

      var lickButton = function(){
        if ($scope.domain.length === 0 || $scope.username.length === 0) {
          renserStatus("input-empty");
          $p.html(languages[CURRENT_PROJECT_LANGUAGE].lp1);
        }  else {
          if ($scope.password.length === 0) {
            renserStatus("input-empty");
            $p.html(languages[CURRENT_PROJECT_LANGUAGE].lp2);
          } else {
            UserUpdateService.checkLogin({
              domain: $scope.domain,
              username: $scope.username,
              password: $scope.password,
              cid: $scope.cid,
            }).then(function(_data) {
              if (_data.error_code) {
                if (_data.error_code === 40040) {
                  renserStatus("input-empty");
                  $p.html(languages[CURRENT_PROJECT_LANGUAGE].lp3);
                  return;
                } else if (_data.error_code === 40041) {
                  renserStatus("input-empty");
                  $p.html(languages[CURRENT_PROJECT_LANGUAGE].lp4);
                  return;
                } else if (_data.error_code === 40044) {
                  renserStatus("input-empty");
                  $p.html(languages[CURRENT_PROJECT_LANGUAGE].lp7);
                  return;
                } else {
                  renserStatus("input-empty");
                  $p.html(languages[CURRENT_PROJECT_LANGUAGE].lp8);
                } 
              } else {
                document.location.href = '/';
              }
            });
          }
        }
      };

      var bindEvent = function() {
        $scope.resetStatus = function(_render_class, _unrender_class, _changType, $event){
          if(_render_class) {renserStatus(_render_class);}
          if(_unrender_class) {unRenserStatus(_unrender_class);}
          if(_changType){
            var $target = $element.find($($event.target).attr("for"));
            if($target.length === 0) {return;}
            $target.attr("type", _changType);
          }
        };
        $scope.LoginSuccess = function(){
          lickButton();
        };
        $scope.todelete = function(){
          $scope.domain = "";
          $scope.username = "";
        };
        $scope.focususer = function(){
          renserStatus("input-text");
          unRenserStatus("input-empty");
        };
        $scope.focuspwd = function(){
          renserStatus("input-text2");
          unRenserStatus("input-empty");
        }
        $scope.bluruser = function(){
          unRenserStatus("input-text");
        };
        $scope.blurpwd = function(){
          unRenserStatus("input-text2");
        };
      };

      var init = function() {
        $container = $element.find(".content div.form form fieldset");
        $p = $container.find(".error");
        $scope.domain = "";
        $scope.username = "";
        $scope.password = "";

        $("body").keyup(function() {
          if (event.which === 13) {
            lickButton();
          }
        });

        bindEvent();
      };
      init();
    }
  ])
})
