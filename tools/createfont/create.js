#! /usr/bin/env node
var fs = require("fs"), args = process.argv;
var str = [];
var process1 = require('child_process');

function parse_paras(){
    root_path = args[2];
    console.info(root_path);
}

function getFileInfo(_fileName, _filePath){
    var file = fs.statSync(_filePath);
    if(file.isFile()){
        if(!/.html$/g.test(_fileName) 
            && !/.htm$/g.test(_fileName)
            && !/.php$/g.test(_fileName)
            && !/.less$/g.test(_fileName)
            && !/.css$/g.test(_fileName)
            && !/.js$/g.test(_fileName)
            && !/.ejs$/g.test(_fileName)) return;
        parse_file(_filePath);
    }else if(file.isDirectory()){
        search_folder(_filePath);
    }
}

function search_folder(_folderPath){
    var files = fs.readdirSync(_folderPath);
    for(var i = 0, j = files.length; i < j; i ++){
        getFileInfo(files[i], _folderPath+"/"+files[i]);
    }
}

function parse_file(_filePath){
    try{
        var context = fs.readFileSync(_filePath, "utf8");
        str.push(context.replace(/\r*\n*/g, ""));
    }catch(ex){
        console.log("file: " + _filePath + " read fail. [" + ex.valueOf() + "]");
    }
}

console.log("----------------parse_paras-----------------");
parse_paras();
search_folder(root_path);

var newStr = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", str_hash = {};
str = str.join("");

for(var i = 0; i < str.length; i ++){
    if(str_hash[str[i]]) continue;
    str_hash[str[i]] = 1;
    newStr += str[i];
}
newStr = newStr.replace("\"", "\\\"").replace("`", "\\`").replace(/\s*/g, "");

console.info("bash create.sh \"" + newStr + "\"");

process1.exec("bash create.sh \"" + newStr + "\"", function(){
    console.info(arguments);
});
console.info(1111);