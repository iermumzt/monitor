define(["app"], function(Filters) {
  Filters.filter("htmlParse", ["$sce",
    function($sce) {
      var _hash = {};
      return function(_text) {
        if (!_hash[_text]) {
          _hash[_text] = $sce.trustAsHtml(_text + "");
        }
        return _hash[_text];
      };
    }
  ]);
});
