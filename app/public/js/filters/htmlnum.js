define(["app"], function(Filters) {
  Filters.filter("htmlNum",
    function() {
      return function(_text) {
        if (parseFloat(_text) > 10000) {
          _text = Math.round((_text / 10000) * 10) / 10;
          _text = _text + "万";
        }
        return _text;
      };
    });
});
