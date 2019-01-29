define(["app", "d_pagination_list", "d_comment_editor", "zbase"], function(Directives) { //"d_page",
  Directives.directive("commentList", ["VideoService", "ProfileService", function(VideoService, ProfileService) {
    var $textarea, range;
    return {
      template: CURRENT_PROJECT_DIRECTIVES["d-comments-list"],
      restrict: "A",
      replace: true,
      transclude: false,
      scope: {
        comments: "=commentList",
        saveComment: "=saveCommentFn",
        reloadCommentListFn: '=',
        bindMoreReplys: "=",
        getExtraParams: "&",
        replayType: "@",
        size: "=", //每页显示个数
        count: "=", //items总数
        type: "@",
        pageType: "@", //显示类型
        isLoading: "=isLoading",
        onPageChanged: "=",
        pullLoad: "@",
        placeHolder: "@"
      },
      link: function($scope, $element) {
        $scope.currentPageIndex = 1;
        $scope.currentComment = -1;
        // if(IX.browser.versions.mobile && $(window).width() < 1000){
        //   $scope.pageType = 0;
        // }
        $element.find(".more-btn").on("touchstart", function() {
          $element.find(".more-btn").attr("background-color", "#e7e7e7");
        }).on("touchend", function() {
          $element.find(".more-btn").attr("background-color", "#fff");
        });
        $scope.showCommentEditor = function($event, item, replay) {
          item.showReply = true;
          $scope.currentComment = item.cid;
          $scope.placeHolder = "回复" + (replay ? replay.username : item.username);
          $scope.parentCid = replay ? replay.cid : item.cid;


          setTimeout(function() {　　
            $scope.$apply(function() {　　
              $textarea = $("div.comment-editor-wrap.list-comment.comment-wrap.hide.show textarea");
              $textarea[0].focus();
            });
          }, 400);
          // $textarea = $("div.comment-editor-wrap.list-comment.comment-wrap.hide.show textarea");
          // // $textarea = $($event.target || $event.srcElement).closest("li").find("textarea");

          // // $target = $($event.target || $event.srcElement);
          // // $textarea[0].focus();
          // setTimeout(function() {
          //   $textarea[0].focus();
          // }, 300);

          // $scope.$$postDigest(function() {
          //   // if (!IX.browser.versions.mobile) {
          //   //   setTimeout(function() {
          //   //     if ($textarea[0].setSelectionRange) {
          //   //       $textarea[0].setSelectionRange(0, 0);
          //   //       // $textarea.focus();
          //   //     } else if ($textarea[0].createTextRange) {
          //   //       range = $textarea[0].createTextRange();
          //   //       range.collapse(true);
          //   //       range.moveEnd('character', 0);
          //   //       range.moveStart('character', 0);
          //   //       range.select();
          //   //     }
          //   //   }, 300);
          //   // } else {
          //   //   if (item.showReply) {
          //   //     // $(window).scrollTop($(window).scrollTop() + 136);
          //   //   } else {
          //   //     // $(window).scrollTop($(window).scrollTop() - 136);
          //   //   }
          //   // }

          // });

        };

        $scope.cancelReply = function($event, item) {
          item.showReply = false;
          $scope.currentComment = -1;
        };

        $scope.saveCommentFn1 = function($event, item) {
          item.showReply = false;
          $scope.currentComment = -1;
          if ($scope.saveCommentFn) {
            $scope.saveCommentFn();
          }
        };

        $scope.getExtraParams1 = function(item) {
          return _.extend($scope.getExtraParams(), {
            parent_cid: $scope.parentCid
          });
        };
        $scope.showMoreReplys = function(_item) {
          if (!_item.loaded) {
            $scope.bindMoreReplys(_item.cid, function(_replyList) {
              _item.reply_list = _replyList;
              _item.loaded = true;
            });
          }else{
              _item.reply_list = _item.reply_list.splice(0,5);
              _item.loaded = false;
          }

        }
      }
    };
  }]);
});