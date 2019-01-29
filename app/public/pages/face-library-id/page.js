require.config(APP_CONFIG);

require(["init", "components/s-pro-top-nav/component",
  "pages/face-library-id/controller/controller",
  "app"
], function(ZBase) {
  ZBase.init();
});