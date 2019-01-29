define(["app", "oauth", "zbase", "s_profile", "s_user"], function(Directives, OAuth) {
  Directives.directive("commentEditor", ["ProfileService", "UserService", "LayoutManager",
    function(ProfileService, LayoutManager) {
      var languages = {
        "zh-cn": {
          "lp1": "不得超过40个字。",
          "lp2": "请登陆！",
          "lp3": "评论内容不能为空！",
          "lp4": "提交失败，请稍后重试！",
          "lp5": "立即登录",
          "lp6": "还没有评论",
          "lp7": "，说说你的感想吧",
          "lp8": "已有",
          "lp9": "条评论"
        },
        "en": {
          "lp1": "Not more than 300 words..",
          "lp2": "Please login!",
          "lp3": "Comment content can not be empty",
          "lp4": "To submit a failure, please try again later."
        }
      };
      return {
        template: CURRENT_PROJECT_DIRECTIVES["d-comment-editor"],
        restrict: "A",
        replace: true,
        transclude: false,
        scope: {
          placeHolder: "@placeHolder",
          // value: "@value",
          className: "@className",
          showCancelBtn: "@showCancelBtn",
          reloadCommentList: "=",
          saveCommentFn: "&saveCommentFn",
          cancelEditFn: "&cancelEditFn",
          getExtraParams: "&getExtraParams",
          submitBtnText: "@submitBtnText",
          replayType: "@replayType",
          textOnFocus: "&textOnFocus",
          commentCount: "@commentCount",
          type: "@",
          currentComment:"=currentComment",
          comment: "=",
        },
        link: function($scope, $elem) { // $attrs
          var $target;
          var user = OAuth.getUser();
          var width = $(window).width();
          if(!IX.browser.versions.mobile || width > 1000){
            $scope.ispc = true;
          }
          var getValue = function() {
            return ($scope.value || "").trim();
          };
          var initValue = $scope.value || "";
          $scope.inputLength = getValue().length;

          $scope.hasLogin = OAuth.getUser();
          $scope.ainit = function() {
            OAuth.init();
          };
          $scope.textOnFocusFn = function($event) {
             // $elem.find("textarea")[0].focus();
           
            if(!$scope.hasLogin) $scope.ainit();
            else if ($scope.hasLogin && $scope.type!=="list") $elem.addClass("comment-wrap");
            else {}
            // $scope.textOnFocus($(this));
          };
          $scope.focus = function() {
           
          };
          $scope.checkInput = function() {
            $scope.inputLength = getValue().length;
            if ($scope.inputLength > 40) {
              $scope.errorInfo = languages[CURRENT_PROJECT_LANGUAGE].lp1;
              $scope.value = $scope.value.substr(0, 40);
              return false;
            } else {
              $scope.errorInfo = "";
              return $scope.inputLength !== 0;
            }
          };

          $scope.saveComment = function() {
            var restr;
            if (!user) {
              AppLog.error(languages[CURRENT_PROJECT_LANGUAGE].lp2);
              return;
            }
            restr = getValue().replace(initValue, '');
            if (restr.length === 0) {
              AppLog.error(languages[CURRENT_PROJECT_LANGUAGE].lp3);
              return;
            }
            if (!$scope.checkInput()) {
              return;
            }
            if ($scope.replayType === "user") {
              UserService.userComments(_.extend({
                comment: getValue(),
              }, $scope.getExtraParams())).then(function(_data) {
                if (_data.error_code) {
                  AppLog.error(languages[CURRENT_PROJECT_LANGUAGE].lp4);
                  return;
                }
                $scope.value = initValue;
                $scope.saveCommentFn();
                $scope.reloadCommentList();
              });
            } else {
              ProfileService.saveComment(_.extend({
                comment: getValue(),
              }, $scope.getExtraParams())).then(function(_data) {
                if (_data.error_code) {
                  AppLog.error(languages[CURRENT_PROJECT_LANGUAGE].lp4);
                  return;
                }
                $scope.value = initValue;
                $scope.saveCommentFn();
                $scope.reloadCommentList();
              });
            }
            $scope.inputLength = 0;

          };
          $scope.cancelEditComment = function() {
            // $scope.currentComment = -1;
            $scope.value = initValue;
            $scope.parentCid = "";
            if ($scope.type!== "list") $elem.removeClass("comment-wrap");
            if ($scope.cancelEditFn) {
              $scope.cancelEditFn();
            }
          };
        }

      };
    }
  ]);
});
