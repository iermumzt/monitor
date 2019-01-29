require.config(APP_CONFIG);

require(["init", 
  "pages/login/controller/controller",
  "app"
], function(ZBase) {
  ZBase.init();
});