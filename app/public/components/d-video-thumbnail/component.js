define(["app"], function(Directives) {
  Directives.directive("videoThumbnail", [function() {
    return {
      template: [
        "<div class='p-thumb'>",
          "<div class='p-pic-default'>",
            "<img src='/public/images/mbackground.png'>",
          "</div>",
          "<a ng-href='{{playUrl}}' class = 'video-thumbnail' target = '_blank'>",
            "<img ng-src='{{thumbnail}}' onerror = 'this.style.visibility=\"hidden\";' />",
            "<span class = 's_play'></span>",
            "<div ng-transclude></div>",
          "</a>",
        "</div>",
        "<div class='video-caption caption info'>",
          "<a ng-href='{{playUrl}}' class='video-name' ng-bind-html = 'name' target = '_blank'></a>",
        "</div>"
      ].join(""),
      restrict: "A",
      replace: false,
      transclude: true,
      scope: {
        playUrl: "=",
        thumbnail: "=",
        name: "="
      }
    };
  }]);
});