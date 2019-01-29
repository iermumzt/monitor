let fs = require("fs");

let requires = (_path, ...excludes) => {
  let files = fs.readdirSync(_path);
  if (files.length === 0) return [];
  let modules = [];
  _path = _path.endsWith("/") ? _path : (_path + "/");
  files.forEach((_file) => {
    if (excludes.indexOf(_file) > -1) return;
    try {
      modules.push({
        m: require(_path + _file),
        f: _file
      });
    } catch (ex) {
      console.info("load ", _file, " error:", ex);
    }
  });
  return modules;
};


module.exports = requires;
