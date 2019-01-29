//let videoTpl = require(process.cwd() + "/lib/video_loading_tpl");
module.exports = {
  layout: "_layout4",
  fn(req, res, next) {
   //  res.template.page_config.zhibotpl = videoTpl.getTpl(7, null, req.cookies.language);
	  // res.template.page_config.zhibotpl2 = videoTpl.getTpl(20, null, req.cookies.language);
	  // video.getPublicCategories({
	  //   lang: res.template.page_config.language
	  // }).then(function(_data){
	  //   res.template.page_config.pageData.categories = _data;
	  //   next();
	  // });
    next();
  }
};