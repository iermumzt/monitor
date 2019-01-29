define(["app"], function(Directives) {
  Directives.directive("noData", function() {
    return {
      template: [
        "<div class = 'zbase-ui zbase-ui-nodata  hide {{className}}' style = 'max-width:{{maxWidth}}px'>", 
          "<div>",
            "<img ng-src = '{{img}}' src = '/public/images/bfjlwjl.png'/>",
            "<span ng-bind='note'></span>",
          "</div>",
        "</div>",
      ].join(""),
      replace: true,
      transclude: true,
      scope: {
        img: "@img",
        className: "@className",
        note: "@note",
        maxWidth: "@maxWidth"
      },
      link: function($scope) {
      }
    };
  });
});
