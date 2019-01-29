define(["./plugins/fullscreen", "./plugins/sizecontrol",
  "./plugins/volume", "./plugins/cloudconfig","./plugins/snapshot", "./plugins/video",
  "./plugins/ops", "./plugins/share"
], function() {
  var plugins = {};
  var i;
  for (i = 0; i < arguments.length; i++) {
    plugins[arguments[i].key] = arguments[i];
  }

  return plugins;
});
