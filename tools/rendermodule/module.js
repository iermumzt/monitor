var fs = require("fs");
var readline = require("readline");
var args = process.argv;
var colors = require("colors");

var op = args[2];
if(op !== "add" && op != "remove") return console.error("need op param:".red, " add or remove", "!".red);

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var ask = function(_q, cbFn, _checkFn){
  _checkFn = _checkFn || function(){ return true; };
  rl.question(_q, function(a){
    if(_checkFn(a)){
      cbFn(a);
    }else{
      ask(_q, cbFn, _checkFn);
    }
  });
};
var new_module_name, new_controll_name = "", new_module_parent_module_name;

var start = function(){
  var base_path = process.cwd() + "/../..";

  var js_path = base_path + "/app/public/js/modules";
  var less_path = base_path + "/app/public/less/modules";
  var ejs_path = base_path + "/app/nodeServer/views";

  var js_module_dir_path = base_path + "/app/public/js/modules/" + new_module_name;
  var less_module_dir_path = base_path + "/app/public/less/modules/" + new_module_name;
  var ejs_module_dir_path;
  if(new_module_parent_module_name){
    ejs_module_dir_path = ejs_path + "/" + new_module_parent_module_name;
  }else{
    ejs_module_dir_path = ejs_path;
  }
  var js_main_path = js_module_dir_path + "/main.js";
  var js_controller_path = js_module_dir_path + "/" + new_module_name + "Controller.js";
  var less_core_path = less_module_dir_path + "/" + new_module_name + "core.less";
  var less_main_path = less_module_dir_path + "/" + new_module_name + ".less";
  var ejs_file_path = ejs_module_dir_path + "/" + new_module_name + ".ejs";

  console.info("start ", op, " module: ", new_module_name, " in ", new_module_parent_module_name || "GLOBAL");

  var check = function(){
    console.info("start check!");
    if(!fs.existsSync(js_path)){
      console.info(js_path, " not exists!".red);
      return false;
    }
    if(!fs.existsSync(less_path)){
      console.info(less_path, " not exists!".red);
      return false;
    }
    if(!fs.existsSync(ejs_path)){
      console.info(ejs_path, " not exists!".red);
      return false;
    }
    if(fs.existsSync(js_main_path)){
      console.info(js_main_path, " has exists!".red);
      return false;
    }
    if(fs.existsSync(js_controller_path)){
      console.info(js_main_path, " has exists!".red);
      return false;
    }
    if(fs.existsSync(less_core_path)){
      console.info(less_core_path, " has exists!".red);
      return false;
    }
    if(fs.existsSync(less_main_path)){
      console.info(less_main_path, " has exists!".red);
      return false;
    }
    if(fs.existsSync(ejs_file_path)){
      console.info(ejs_file_path, " has exists!".red);
      return false;
    }
    return true;
  };
  var rmdirSync = (function(){
      function iterator(url,dirs){
          var stat = fs.statSync(url);
          if(stat.isDirectory()){
              dirs.unshift(url);//收集目录
              inner(url,dirs);
          }else if(stat.isFile()){
              fs.unlinkSync(url);//直接删除文件
          }
      }
      function inner(path,dirs){
          var arr = fs.readdirSync(path);
          for(var i = 0, el ; el = arr[i++];){
              iterator(path+"/"+el,dirs);
          }
      }
      return function(dir,cb){
          cb = cb || function(){};
          var dirs = [];
   
          try{
              iterator(dir,dirs);
              for(var i = 0, el ; el = dirs[i++];){
                  fs.rmdirSync(el);//一次性删除所有收集到的目录
              }
              cb()
          }catch(e){//如果文件或目录本来就不存在，fs.statSync会报错，不过我们还是当成没有异常发生
              e.code === "ENOENT" ? cb() : cb(e);
          }
      }
  })();

  var is_exists_ejs_dir = fs.existsSync(ejs_module_dir_path);


  var remove = function(){
    rmdirSync(js_module_dir_path);
    rmdirSync(less_module_dir_path);
    if(!is_exists_ejs_dir){
      rmdirSync(ejs_module_dir_path);
    }else
      rmdirSync(ejs_file_path);
  };

  if(op === "remove"){
    ask(("确定要移除模块： " + new_module_name.underline + "？y or n：").green, function(answer){
      answer = answer + "";
      if(answer.toLowerCase() === "y"){
        remove();
        console.info("移除成功！".green);
      }else{
        console.info("取消移除！".green);
      }
      rl.close();
    });
    return;
  }
  if(!check()) return rl.close();

  var add = function(){
    fs.mkdirSync(js_module_dir_path, 0755);
    fs.mkdirSync(less_module_dir_path, 0755);
    if(!is_exists_ejs_dir)
      fs.mkdirSync(ejs_module_dir_path, 0755);

    var fd = fs.openSync(js_main_path, "w+");
    fs.writeSync(fd, ['if(window.APP_CONFIG){\r',
    '  require.config(APP_CONFIG); \r',
    '}\r',
    'require(["init",\r',
    js_codes.join(""),
    '  "modules/' + new_module_name + '/' + new_module_name + 'Controller",\r',
    '  "app"], function(ZBase){\r',
    '    ZBase.init();\r',
    '});'].join(""));
    fs.closeSync(fd);

    var fd = fs.openSync(js_controller_path, "w+");
    fs.writeSync(fd, ['define(["app"], function(Controllers){\r',
    '  Controllers.controller("' + new_controll_name + '", ["\$scope", "\$element", function(\$scope, \$element){\r',
    '  }]);\r',
    '})'].join(""));
    fs.closeSync(fd);

    var fd = fs.openSync(less_core_path, "w+");
    fs.writeSync(fd, '@import "../../init"; \r' + less_codes.join("") + '@import "' + new_module_name + '";');
    fs.closeSync(fd);
    
    var fd = fs.openSync(less_main_path, "w+");
    fs.writeSync(fd, "body." + new_module_name + "{\r}");
    fs.closeSync(fd);
    
    var fd = fs.openSync(ejs_file_path, "w+");
    fs.writeSync(fd, "<div ng-controller = '" + new_controll_name + "'>\r</div>");
    fs.closeSync(fd);
  };
  var less_codes = [], js_codes = [];

  ask("是否需要顶部导航？y or n：".green, function(a){
    if(a === "y" || a === "Y"){
      js_codes.push('  "modules/navbar/navbarController",\r');
      less_codes.push('@import "@{x-module-base-path}common";\r');
      less_codes.push('@import "@{x-module-base-path}header";\r');
    }

    ask("是否需要底部导航？y or n：".green, function(a){
      if(a === "y" || a === "Y"){
        js_codes.push('  "modules/navbar/mfooterController",\r');
        less_codes.push('@import "@{x-module-base-path}footer";\r');
      }
    
      ask("是否需要左侧导航？y or n：".green, function(a){
        if(a === "y" || a === "Y"){
          js_codes.push('  "modules/navbar/slidebarController",\r');
          less_codes.push('@import "@{x-module-base-path}slidebar";\r');
        }
    
        ask("是否需要右侧“快速回到顶部”按钮？y or n：".green, function(a){
          if(a === "y" || a === "Y"){
            js_codes.push('  "modules/navbar/sidetoolsController",\r');
            less_codes.push('@import "@{x-module-base-path}sidetools";\r');
          }
          try{
            add();
            console.info("添加成功！".green);
          }catch(ex){
            console.info("添加失败：".red, ex);
            remove();
            throw ex;
          }finally{
            rl.close();
          }
        });

      });
    });
  });
};
ask("请输入模块名称：".green, function(_name){
  new_module_name = _name;
  new_module_name.split("-").forEach(function(s){
    new_controll_name += s[0].toUpperCase() + s.substr(1);
  });
  new_controll_name += "Controller";
  new_module_name = new_module_name.replace(/\-/g, "");

  ask("如果有父级模块，请输入名称：（全小写）".green, function(_parent_name){
    new_module_parent_module_name = _parent_name.trim();

    start();
  });
}, function(_name){ return _name.trim(); });

