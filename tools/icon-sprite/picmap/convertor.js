var fs = require('fs'),
	path = require('path'),
	util = require('util'),
	PNG = require('pngjs').PNG,
	md5 = require("md5");

var GrowingPacker = require('../lib/GrowingPacker'),	
	nf = require('../lib/node-file.js'),
	ztool = require('../lib/ztool');

function createPng(width, height) {
	var png = new PNG({
		width : width,
		height : height
	});
	//先把所有元素置空，防止污染
	for (var y = 0; y < png.height; y++) {
		for (var x = 0; x < png.width; x++) {
			var idx = (png.width * y + x) << 2;
			png.data[idx] = 0;
			png.data[idx + 1] = 0;
			png.data[idx + 2] = 0;
			png.data[idx + 3] = 0;
		}
	}
	return png;
}
function compareString(a, b){
	var len = Math.min(a.length, b.length);
	for (var i=0; i <len; i++){
		var v = a.charCodeAt(i) - b.charCodeAt(i);		
		if (v>0)
			return 1;
		else if (v<0)
			return -1;
	}
	if (a.length>len)
		return 1;
	else if (b.length>len)
		return -1;
	return 0;
}
//*************************************************************
//  输出预览内容
//*************************************************************
var previewItemHtml = [
'\t<div>',
'\t\t<h3>.x-CLZ</h3>',
'\t\t<span class="CLZ" style="INFO"></span><span class="label">INFO</span>',
'\t</div>'
].join("\n");
function getPreviewContent(arr, _newName) {
	var htm = [], demoCss = [];
	arr.forEach(function(item){
		var clz = item.className;
		htm.push(previewItemHtml.replace(/INFO/g, item.whStyle).replace(/CLZ/g, clz));
		demoCss.push('.'+clz + '{' +  item.whStyle + ';.x-' + clz +';}');
	});
	return {
		demoCss : demoCss.join("\n"),
		body : htm.join("\n"),
		imageName: _newName
	};
}
//*************************************************************
//写入样式文件
//*************************************************************
function writeStyleSheetFile(filename, imgInfoArr, ifPreview, _newName) {
	var arr = [];
	var content = [];
	var rWidth = imgInfoArr.root.w;
	var rHeight = imgInfoArr.root.h;
	imgInfoArr.forEach(function(obj){
		var clzName = obj.className.trim();
		var whStyle = 'width: '+ obj.width + 'px; height:' + obj.height + 'px;';
		arr.push({className : clzName, whStyle :  whStyle});
		if(clzName.lastIndexOf("-2x") === clzName.length - 3){
			content = content.concat(['.x-' + clzName + '(@w:' + obj.width + 'px, @h:' + obj.height + 'px){',
				'\twidth: @w;',
				'\theight: @h;',
				'\tbackground-size:  round(' + rWidth + 'px*@w/'+ obj.width + 'px) round(' + rHeight + 'px*@h/'+ obj.height + 'px);',
				//'\tbackground-size:  ' + rWidth + 'px*@w/'+ obj.width + 'px ' + rHeight + 'px*@h/'+ obj.height + 'px;',
				'\tbackground-position : round(' + Number(0 - obj.fit.x) + 'px*@w/'+ obj.width + 'px) round(' + Number(0 - obj.fit.y) + 'px*@h/'+ obj.height + 'px);', 
			'}']);
		}else
			content = content.concat(['.x-' + clzName + '(){',
				'\t' + whStyle + '',
				'\tbackground-position : ' + Number(0 - obj.fit.x) + 'px ' + Number(0 - obj.fit.y) + 'px;', 
			'}']);
	});	
	_writeFile(filename, content.join("\n"));
	console.log("Output icon css to " + filename);
	var info = ifPreview?getPreviewContent(arr, _newName):{ imageName: _newName };
	info.width = imgInfoArr.root.w;
	info.height = imgInfoArr.root.h;
	return info;
}

function collectImage(imageFileName, cbFn){
	var result = {};	
	var pngParser = new PNG();
	fs.createReadStream(imageFileName).pipe(pngParser);
	pngParser.on('parsed', function () {
		result.image = this;
		result.width = this.width;
		result.height = this.height;	
		
		var size = 0;
		this.pack().on('data', function(chunk) {
			size += chunk.length;
		}).on('end', function() {
			result['size'] = size;
			cbFn(result);
		});
	});
}
function packImages(imgInfos) {
	var imgInfoArr = new Array();
	
	imgInfos.forEach(function(oImg){
		imgInfoArr.push(oImg);
	});
	imgInfoArr.sort(function(a, b) {
		return b.h - a.h;//b.h - a.h;
	});
	
	//对图片进行坐标定位
	var packer = new GrowingPacker();
	
	packer.fit(imgInfoArr);
	imgInfoArr.root = packer.root;
	 //console.info("packer after fit :" + util.inspect(imgInfoArr));
	return imgInfoArr;
}

//*************************************************************
//	输出合并的图片
//*************************************************************
function drawImages(imageFile, imgInfoArr, callback){
	var imageResult = createPng(imgInfoArr.root.w, imgInfoArr.root.h);
	ztool.forEach(imgInfoArr, function (j, obj, goon) {
		//对图片进行定位和填充
		var image = obj.image;
		// console.info("icon image is :");
		// console.info(image);
		image.bitblt(imageResult, 0, 0, image.width, image.height,
			obj.fit.x, obj.fit.y);
		goon();
	}, function (count) {
		nf.mkdirsSync(path.dirname(imageFile));
		//图片填充
		var writeStream = fs.createWriteStream(imageFile);
		imageResult.pack().pipe(writeStream);
		writeStream.on("finish", function(){
			fs.readFile(imageFile, function(err, buf) {
			  //console.log(buf);
			  var _newName = md5(buf);
			  var _newFilePath = path.dirname(imageFile) + "/" + _newName + ".png";
			 	fs.rename(imageFile, _newFilePath, function(){
					console.log("output icon image to ", _newFilePath, count);
					callback(_newName);

			 	});
			});
		});
		//console.log("fs.existsSync: ", fs.existsSync(imageFile), imageFile, imgInfoArr.length);
		
	});
} 

//*************************************************************
//	主逻辑
//*************************************************************
exports.merge = function (cfg, cb) {
	var imageInfoCache = [];
	
	var srcPath = cfg.src,
		destDir = cfg.dest,
		filename = cfg.filename,
		classPrefix = cfg.classPrefix,
		margin = cfg.margin|| 16;
	//读取图片信息
	function readImgInfo(_fname, callback) {
		var fname = _fname.split(".");
		if (fname.length!=2 || fname[1].toLowerCase() !="png")
			return callback();
		
		collectImage(srcPath + "/" + _fname, function(result){
			result.className = classPrefix + fname[0];
			result.w = result.width + margin;
			result.h = result.height + margin;
			imageInfoCache.push(result);
			callback();
		});
	}
	function output(){
		//空白图片不需要输出
		if (imageInfoCache.length==0)
			return cb(null);
		//console.info(imageInfoCache.length);
		//合并图片并定位
		var imgInfoArr = packImages(imageInfoCache);
		drawImages(destDir + "/images/" + filename + ".png", imgInfoArr, function(_newName){
			cb(writeStyleSheetFile(destDir + "/less/iconsprit/" + filename + ".less",  imgInfoArr, cfg.ifPreview, _newName));
		});
	} 
	console.info(srcPath);
	fs.readdir(srcPath, function (err, files) {
		//console.info("icons file list: " + files);
		ztool.forEach(files, function (j, fname, goon) {
			readImgInfo(fname, goon);
		}, output);
	});
};
