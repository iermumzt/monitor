var util = require('util');
var fs = require('fs');
var path = require('path');

var nf = require('./lib/node-file.js');

global.appCfg = require('./config.js');

global._writeFile = function(filename, data){
	nf.mkdirsSync(path.dirname(filename));
	nf.writeFileSync(filename, data, true);
};

console.log("Usage : node index [--preview/--disable-preview] [source-path [output-path]]");

var ifPreview = appCfg.ifPreview;
var _args = [];
process.argv.forEach(function(arg){
	if (arg.charAt(0) == '-'){
		if (arg == "--preview")
			ifPreview = true;
		else if (arg == "--disable-preview")
			ifPreview = false;
	} else
		_args.push(arg);
});

var srcPath = _args.length>2?_args[2]: appCfg.srcRoot;
var destPath = _args.length>3?_args[3]: appCfg.deployTo;

var allTasks = ["picmap", "homepicmap", "mpicmap"];//"guidepic,picmap,ixicon,font,background".split(",");

var previewInfos  = {};
var previewHTML = [
'<!DOCTYPE html>',
'<html>',
'<head>',
	'\t<meta charset="UTF-8" />',
	'\t<title>spirite preview</title>',
	'\t<link href="./less/demo.less" rel="stylesheet/less">',
	'\t<script src="../tools/less-1.4.2.min.js"></script>',
'</head>',
'<body>',
'BODY',
'<iframe src="./less/demo.less" style="height:800px;width:600px;"></iframe>',
'</body>',
'</html>'
].join("\n");
function checkPreview(){
	var bodys = [], lesses = [], iconspritlesses = [];
	for (var i=0;i<allTasks.length; i++ ){
		if (!(allTasks[i] in previewInfos))
			return;
		var _config = configs[allTasks[i]];
		iconspritlesses = iconspritlesses.concat(
			'@' + allTasks[i] + "-path:'" + previewInfos[allTasks[i]].imageName + ".png';",
			'@' + allTasks[i] + "-width:'" + previewInfos[allTasks[i]].width + "px';",
			'@' + allTasks[i] + "-height:'" + previewInfos[allTasks[i]].height + "px';",
			'[class^="' + _config.classPrefix + '"], [class*=" ' + _config.classPrefix + '"], .pic{.x-' + _config.classPrefix.replace("-", "") + ';}',
			'.x-' + _config.classPrefix.replace("-", "") + '(){ .x-bg-ts("' + previewInfos[allTasks[i]].imageName + '");display:inline-block;}',
			'@import "iconsprit/' + allTasks[i] + '";'
		);
		if(!ifPreview)
			continue;
		var task = previewInfos[allTasks[i]];
		bodys.push('<div class="' + allTasks[i] + '_area">');
		bodys.push(task.body);
		bodys.push('</div>');
		lesses.push(task.demoCss || "");
	}
	fs.writeFileSync(destPath + "/less/iconsprit.less", iconspritlesses.join("\n"));
	if (ifPreview){
		var demoless = path.resolve(process.cwd() , 'distrib/less/demo.less');
		//fs.writeFileSync(destPath + "/less/demo.less", fs.readFileSync(demoless));
		_writeFile(destPath + "/less/demo0.less", lesses.join("\n"));		
		var prefile = destPath + "/preview.htm";
		_writeFile(prefile, previewHTML.replace(/BODY/g, bodys.join("\n")));
		console.info("Output preview file:" + prefile);
	}
	//process.exit();
}
/**
 *  next: 
 *  	params :
 *  		name : 'ssdasd' 
 *  		fn: function(function(err, result))  		
 *  	return self;
 *  exec
 *  	param 
 *  		doneFn : function(err, result)
 *  
 *  Example:
 *  	condition.sequential("step1", function(fn){
 *  		fn(err1, result1);
 *  	}).next("step2", function(fn){
 *  		fn(err2, result2);
 *  	}).exec(function(err, result){
 *  		// err : {stepN : errN}
 *  		// result : {step1: result1, ...stepN-1: resultN-1}
 *  	});
 */
var sequential = function(_name, _fn){
	//var serial = IX.id();
	var keys = [], fns = {}, errs = {}, results = {};
	
	var self = {		 
		next : _next,
		exec : _exec
	};
	function _next(name, fn){
		if (typeof fn == "function") {
			keys.push(name);
			fns[name] = fn;
		}
		return self;
	}
	function workDone(name, err, result, doneFn){
		if (err){
			errs[name] = new Error(name + ":" + err);
			return doneFn(errs, results);
		}
		results[name] = result;
		if (0 == keys.length) {
			//IX.log("Condition.sequential[" + serial + "] done: ---------------");
			doneFn(null, results);
		} else
			doNext(doneFn);
	}
	function doNext(doneFn){
		var name = keys.shift(); 
		//IX.log("Condition.sequential[" + serial + "] : ==============" + name);
		fns[name](function(err, result){
			//IX.log("Condition.sequential[" + serial + "] done: ==============" + name);
			workDone(name, err, result, doneFn);
		});
	}
	function _exec(doneFn){
		if (keys.length==0)
			return doneFn({}, {});
		doNext(doneFn);
	}
	return _next(_name, _fn);
};

var mergeFn = function (task, cbFn) {
	var _cfg = configs[task];
	var convertor = require('./' + (_cfg.classPath || task) + '/convertor.js');
	convertor.merge({
		src : srcPath + "/" +  (_cfg.path || task),
		dest : destPath,
		filename : _cfg.name || task,
		format : _cfg.format || "png",
		margin : _cfg.margin || 16,
		classPrefix : _cfg.classPrefix || "",
		ifPreview : ifPreview
	}, function(previewInfo){
		previewInfos[task] = previewInfo;
		checkPreview();
		cbFn(null, true);
	});
};
var configs = {
	/*background : {},
	ixicon : {		
		margin:8,
		classPrefix : "icon-",
		classPath : "picmap"
	},*/
	picmap : {		
		classPrefix : "pic-"
	},
	homepicmap : {		
		classPrefix : "homepic-",
		classPath : "picmap"
	},
	mpicmap : {		
		classPrefix : "mpic-",
		classPath : "picmap"
	}/*,
	guidepic : {
		margin:8,
		classPrefix : "guide-",
		classPath : "picmap"
	},
	font : {
		path : "iconfont",
		format : "svg"
	}*/
};
if(fs.existsSync(destPath + '/less/iconsprit.ess')){
	fs.unlink(destPath + '/less/iconsprit.ess');
}
sequential("picmap", function (fn) {
	mergeFn('picmap', fn);
}).next("homepicmap", function(fn){
	mergeFn('homepicmap', fn);
}).next("mpicmap", function(fn){
	mergeFn('mpicmap', fn);
}).exec(function (err, result) {

});



