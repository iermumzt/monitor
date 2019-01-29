define(["app", "ui_videoplayer", "ui_multiscreen","s_video"], 
  function(Controllers, VideoPlayer, MultiScreen){
  Controllers.controller("SMultiScreenController", ["$scope", "$window", "$element","VideoService",
    function($scope, $window, $element, VideoService){

    var videosnum= IX.getUrlParam("t") || 4;
    var rows,cols;

    var items = [];

    if(Math.sqrt(videosnum).toString().indexOf('.') < 0) {rows = cols = Math.sqrt(videosnum);}
    else if(videosnum === 2) {rows = 1 ; cols = 2;}
    else {rows = cols = Math.floor(Math.sqrt(videosnum));}

    var bindVideoList = function(){

    VideoService.getRecommendVideos({
        sign: CURRENT_PROJECT_SIGN,
        expire: CURRENT_PROJECT_EXPIRE,
        page: 1,
        count: 100,
        orderby: "all"
    }).then(function(_data){
        if(!_data || _data.error_code || typeof(_data.count) === "undefined"){
            _data = {
              count: 0,
              list: []
            };
        }
        items = _data.device_list;
        new MultiScreen({
          container:   $element,
          items: items,
          rows: rows,
          cols: cols,
          isPrivate: false
        });
      }); 
    };

    var init = function(){
      bindVideoList();
    };
    init();
  }]);
});