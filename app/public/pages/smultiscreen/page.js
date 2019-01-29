require.config(APP_CONFIG);

require(["init", "components/s-top-nav/component",
  "components/s-public-left-nav/component",
  //"js/modules/navbar/sidetoolsController",
  "pages/smultiscreen/controller/controller",
  "app"
], function(ZBase) {
  ZBase.init();
});