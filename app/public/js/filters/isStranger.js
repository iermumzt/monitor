define(["app"], function(Filters) {
  Filters.filter("isStranger",
    function() {
      return function(_items,_type) {
        var strangers = [];
        var visitor = [];
        var allItems = [];
        
        _.each(_items,function(_item){
          if(_item.face){
            for (var i=0; i<visitor.length; i++) {
              if (_item.face.face_id === visitor[i].face.face_id) {
                visitor.splice(i,1);
              }
            }
            visitor.push(_item);
          }else{
            strangers.push(_item);
          }
        })
        allItems = visitor.concat(strangers);
        allItems = _.sortBy(allItems, function(item) {
          return -item.time;
        });
        return _type === 0 ? visitor : ( _type === 1 ? strangers : allItems);
      };
    });
});
