let express = require('express');
var url = require("url");
let app = express();
let partials = require("express-partials");
let cookieParser = require("cookie-parser");
let bodyParser = require("body-parser");
let path = require("path");

let config = require("./config");
global.app_config = config;
global.static_path = process.cwd() + "/public";

let routers = require("./routes/core");

app.set('views', './views');
app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(partials());
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb'
}));
app.use(cookieParser());
app.use((req, res, next) => {
  let urlObj = url.parse(req.url);
  req.commonpath = urlObj.pathname === "/" ? urlObj.pathname : urlObj.pathname.replace(/\/*$/g, "");
  next();
});

app.use(routers);

// app.listen(config.port);

var server = app.listen(config.port);
server.setTimeout(120*1000);
