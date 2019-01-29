let config = require("../config");

let getTpl = (count = 0, _type = "", _language = config.languages[0]) => {
  if (count === 0) return "";

  let tpl1 = `<div class = "dib ${_type}">
    <a href='/' class = 'img-a' target='_blank'>
      <img src='${config.webSiteDomains[0]}public/images/mbackground.png'>
      <div class = 'mouse-over'></div>
      <p class='bg'></p>
      <p class='ellipsis'>${_language === "zh-cn" ? "加载中" : "Loading"}...</p>
    </a>
  </div>`;

  return (new Array(count + 1)).join(tpl1);
};


exports.getTpl = getTpl;
