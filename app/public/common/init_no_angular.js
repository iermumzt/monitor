define(["zbase", "ui_log"], function() {

  var config = {
    pageLoaderCfg: {
      sources: [],
      onLoadComplete: function() { return true; }
    }
  };

  var renderPageLoader = function() {
    if (!config.pageLoaderCfg) {
      return;
    }

    new ZBase.PageLoader(_.extend({}, config.pageLoaderCfg, {
      onLoadComplete: function() {
        if (config.pageLoaderCfg.onLoadComplete) {
          config.pageLoaderCfg.onLoadComplete();
        }
      }
    }));
  };

  var init = function(cfg) {
    config = _.extend(config, cfg);

    renderPageLoader();
  };

  ZBase.init = init;

  return ZBase;
});
