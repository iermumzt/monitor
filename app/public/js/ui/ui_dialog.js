define(["IX"], function() {
  //	var adbtnsTpl = "<input type = 'button' class = '{clz}' value = '{name}' />" data-backdrop="static";

  var Dialog = function(cfg) {
    var dialogTpl = new IX.ITemplate({
      tpl: [
        "<div class = 'modal fade zbase-ui autodialog {clz} nofade' id = '{id}'  data-backdrop='static'>",
        '<!--[if lte IE 7]><div class = "ie7-clearfix" style = "height:0;"></div><![endif]-->',
        '<div class="modal-dialog">',
        '<div class="modal-content">',
        '<div class="modal-header">',
        '<button class="close" data-dismiss="modal" aria-label="Close"><img class="close" src="/public/images/dialog-close.png"></button>',
        '<h4 class="modal-title">{title}</h4>',
        '</div>',
        '<div class="modal-body">',
        '</div>',
        '<div class="modal-footer">',
        '<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>',
        //'<button type="button" class="btn btn-primary">Save changes</button>',
        '</div>',
        '</div>',
        '</div>',
        "</div>"
      ]
    });
    var config = $.extend(true, {
      html: "",
      title: "",
      className: "",
      noHeader: false,
      noFooter: false,
      isFadeIn: true,
      animate: false,
      verticalAlign: "middle",
      width: 460,
      showDialog: false,
      afterHide: function() {/**/}
    }, cfg);

    var $self;
    var id, _model;

    var bindEvent = function() {
      $self.on('hidden.bs.modal', function() { //括号中删除了e;
        $self.remove();
        // if ($(".modal-dialog").length === 0) {
        //   //  document.body.style[IX.getClass(document.body.style) != "object" ? "removeProperty" : "removeAttribute"]("overflow");
        //   //  document.body.parentNode.style[IX.getClass(document.body.style) != "object" ? "removeProperty" : "removeAttribute"]("overflow");
        // } else {
          
        // }
        $(document.body).removeClass("modal-open");
        config.afterHide();
      });
      $self.on('show.bs.modal', function() { //括号中删除了e(语法检测);
        // document.body.style.overflow = "hidden";
        if (IX.IE.isIE7 || IX.IE.isIE6) {
          //    document.body.parentNode.style.overflow = "hidden";
        }
      });
      $self.on('shown.bs.modal', function() { //括号中删除了e(语法检测);
        // document.body.style.overflow = "hidden";
        if(config.showDialog){
          config.showDialog();
        }
      });
    };

    var init = function() {
      id = IX.id();
      $self = $(dialogTpl.renderData("", {
        title: config.title,
        id: id,
        clz: config.className + (config.noHeader || !config.title ? " noheader" : "") + (config.noFooter ? " nofooter" : "")
      })).appendTo("body");
      $self.find(".modal-body").append(config.html).attr("id", "ad_" + IX.id());
      if(IX.browser.versions.mobile){
        $self.find(".modal-header button img.close").attr("src","/public/images/dialog-close-m.png");
      }else{
        $self.find(".modal-header button img.close").attr("src","/public/images/dialog-close.png");
      }
      if (config.height) {
        $self.find(".modal-dialog").height(config.height);
      }
      if (config.width) {
        $self.find(".modal-dialog").width(config.width);
      }
      $self.find(".modal-dialog").css("padding-top", 0);

      _model.$ = $self.find(".modal-body");
      _model._.con = $self;

      if ($self.find(".ie7-clearfix").length === 0 && document.documentMode === 7) {
        $self.prepend('<div class = "ie7-clearfix" style = "height:0;"></div>');
      }

      bindEvent();
    };

    var _show = function() {
      $self.modal({
        keyboard: false,
        animate: config.animate,
        verticalAlign: config.verticalAlign
      });
      //document.body.style[IX.getClass(document.body.style) != "object" ? "removeProperty" : "removeAttribute"]("padding-right");

    };

    var _remove = function() {
      $self.modal("hide");
    };

    _model = {
      show: _show,
      remove: _remove,
      resizeModal: function() {
        $self.resize();
      },
      $: null,
      _: {}
    };

    init();

    return _model;
  };

  return Dialog;
});
