define(["app", "fi_htmlnum", "d_video_summary"], function(Directives) {
  Directives.directive("videoSummaryList", [function() {
    return {
      template: [
        "<div class = 'video-summary-list'>",
          "<div video-summary item = 'item' class = 'item thumbnail pull-left' ng-repeat = 'item in videoList'>",
          "</div>",
        "</div>"
      ].join(""),
      restrict: "A",
      replace: false,
      transclude: false
    };
  }]);
});