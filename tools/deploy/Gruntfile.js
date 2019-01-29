module.exports = function(grunt) {

  var root_path = "../../";
  var source_path = root_path + "app/public/";
  var target_path = root_path + "dist/public/";

  var static_path = root_path + "dist/";

  var source_nodeServer_path = root_path + "app/";
  var target_nodeServer_path = root_path + "dist/";

  var currentMode = grunt.option('deploy') || "test";
  var currentModule = grunt.option("m") || "home";
  var currentServer = grunt.option("server") || "80";

  var fs = require("fs");
  var path = require("path");

  console.info(currentServer, currentMode);

  var requireConfig = {},
    module_md5_hash = {
      js: {},
      css: {}
    };

  var domains = currentMode == "test" ? ["'/'"] : [
      "'/'"
    ];
  var httpsDomains = currentMode == "test" ? ["'/'"] : [
    "'/'"];

  if (currentMode != "test" && currentMode != "production") {
    currentMode = "production";
  }
  var module_configs, sourceFilesHash = {};

  var render_require_config = function() {
    module_configs = [{
      name: "commonA",
      create: true,
      include: ["almond", "jquery", "bootstrap", "underscore", "IX", "zbase",
        "angular", "angularRoute", "angularResource", "angularTouch", "angularSanitize", "f_callserver",
        "ui_log", "builtAConfig", "app", "init", "oauth", "uibootstrap"
      ],
      exclude: ["builtConfig", "builtAConfig"]
    }, {
      name: "common",
      create: true,
      include: ["almond", "jquery", "bootstrap", "underscore", "IX", "zbase"],
      exclude: ["builtConfig", "builtAConfig"]
    }];
    var getPagesConfigs = function() {
      var page_dirs = fs.readdirSync(source_path + "pages");

      page_dirs.forEach((_dir) => {
        var stat = fs.statSync(source_path + "pages/" + _dir);
        if (stat.isDirectory()) {
          var _config = JSON.parse(fs.readFileSync(source_path + "pages/" + _dir + "/" + "config.json").toString());
          var _depend_angular = _config.depends && _config.depends.js && _config.depends.js.indexOf("angular") > -1;
          var flag = fs.existsSync(source_path + "pages/" + _dir + "/page.js");
          if (_config.js !== "") {
            module_configs.push({
              name: _dir,
              create: true,
              include: [_depend_angular ? "common/require_a_config" : "common/require_config", flag ? "pages/" + _dir + "/page" : ""],
              exclude: ["commonA", "builtConfig", "builtAConfig"]
            });
          }

          if (_config.css !== "") {
            let f = fs.existsSync(source_path + "pages/" + _dir + "/page.less");
            if (f) sourceFilesHash[target_path + "css/" + _dir + ".css"] = source_path + "pages/" + _dir + "/page.less";
          }
        }
      });
    };
    getPagesConfigs();
  };
  render_require_config();

  // var modules = ;
  // var sourceFilesHash = {};

  // for (var i = 0; i < modulesConfig.lesses.length; i++) {
  //   if (modulesConfig.lesses[i] !== "mhome")
  //     sourceFilesHash[target_path + "css/" + modulesConfig.lesses[i] + "core.css"] = source_path + "less/modules/" + modulesConfig.lesses[i] + "/" + modulesConfig.lesses[i] + "core.less";
  // }
  // sourceFilesHash[target_path + "css/mindexcore.css"] = source_path + "less/modules/mhome/mindexcore.less";
  // sourceFilesHash[target_path + "css/mproductcore.css"] = source_path + "less/modules/mhome/mproductcore.less";

  var mainConfigStr = "";

  var ignore_lint_files = [
    source_nodeServer_path + "node_modules/**/*.js",
    source_nodeServer_path + "lib/md5.js",

    source_path + "js/angular/**/*.js",
    source_path + "common/builtAConfig.js",
    source_path + "common/builtConfig.js",
    source_path + "js/bootstraps/**/*.js",
    source_path + "js/lib/almond.js",
    source_path + "js/lib/ixutils.js",
    source_path + "js/lib/jquery.js",
    source_path + "js/lib/xmlHttpReg.js",
    source_path + "js/lib/jquery.min.js",
    source_path + "js/lib/less.min.js",
    source_path + "js/lib/less.js",
    source_path + "js/lib/md5.js",
    source_path + "js/lib/ronate.js",
    source_path + "js/lib/underscore.js",
    source_path + "js/requirejs/**/*.js",
    source_path + "js/ui/ui_nicescroll.js"
  ];
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    "jsbeautifier": {
      files: [
        root_path + "app/**/*.js",
        "!" + root_path + "app/embaft/**/*.js",
        source_path + "less/**/*.less",
        "!" + source_path + "less/bootstrap/**/*.less"
      ].concat(ignore_lint_files.map(f => "!" + f)),
      options: {
        html: {
          indentSize: 2
        },
        css: {
          fileTypes: [".less"],
          indentChar: " ",
          indentSize: 2
        },
        js: {
          indentSize: 2
        }
      }
    },
    eslint: {
      options: {
        configFile: './eslint.json',
        //format: require('stylish'),
        quiet: true,

        ignorePattern: ignore_lint_files
      },
      all: [source_nodeServer_path + "**/*.js", source_path + "**/*.js"]
    },
    copy: {
      configFile: {
        src: source_path + 'common/builtConfig.sample.js',
        dest: source_path + "common/builtConfig.js"
      },
      configFileA: {
        src: source_path + 'common/builtConfig.sample.js',
        dest: source_path + "common/builtAConfig.js"
      },
      requireconfigFileA: {
        src: source_path + 'common/require_config.js',
        dest: source_path + "common/require_a_config.js",
        options: {
          process: function(_content) {
            return _content.replace('/*deps: ["uibootstrap", "f_callserver", "d_formvalidater"],*/', 'deps: ["uibootstrap", "f_callserver", "d_formvalidater"],');
          }
        }
      },
      mainConfig: {
        files: [{
          expand: true,
          cwd: source_path,
          src: ['common/require_config.js', 'common/builtConfig.js', 'common/builtAConfig.js'],
          dest: source_path
        }],
        options: {
          process: function(_content, _path) {
            if (_path.indexOf("common/require_config.js") > -1) {
              mainConfigStr = _content;
            } else if (_path.indexOf("builtConfig") > -1) {
              _content = "require.config(" + mainConfigStr.replace(" /*APP_CONFIG = APP_CONFIG*/ ;", "").replace("var APP_CONFIG = ", "") + ");";
            } else {
              _content = "require.config(" + mainConfigStr.replace(" /*APP_CONFIG = APP_CONFIG*/ ;", "")
                .replace("var APP_CONFIG = ", "")
                .replace('/*deps: ["uibootstrap", "f_callserver", "d_formvalidater"],*/', 'deps: ["uibootstrap", "f_callserver", "d_formvalidater"],') + ");";
            }
            return _content;
          }
        }
      },
      nodeServer: {
        files: [{
          expand: true,
          cwd: source_nodeServer_path,
          src: ['config.js', 'app.js'],
          dest: target_nodeServer_path
        }],
        options: {
          process: function(_content, _path) {
            if (_path.indexOf("config.js") > -1) {
              _content = _content.replace("develop", currentMode);
          
              if (currentServer == "80") {
                _content = _content.replace("11000", "11010");
                _content = _content.replace('callserverBaseUrl: "/",', 'callserverBaseUrl: "/",');
                _content = _content.replace('topDomain: "localhost",', 'topDomain: "localhost",');
                _content = _content.replace('serverDomain: "/",', 'serverDomain: "/",');
                _content = _content.replace('appid: 1,', 'appid: 1,');
                _content = _content.replace('ak: "",', 'ak: "JNy32RDHvz6rSpx1Mp4E",');
                _content = _content.replace('sk: "",', 'sk: "PkFJcjmkNUotlXOoDLOO",');
              }
              
              if (currentMode == "production")
                _content = _content.replace('webSiteDomains: ["/"]', 'webSiteDomains: [' + domains.join() + ']');
            } else {

            }
            return _content;
          }
        }
      },
      resourceFiles: {
        files: [{
          expand: true,
          cwd: source_nodeServer_path,
          src: ['**/*', '!node_modules/**/*'],
          dest: target_nodeServer_path
        }]
      },
      assets: {
        files: [{
          expand: true,
          cwd: target_path + "assets/",
          src: ['*.js'],
          dest: target_path + "js/"
        }]
      }
    },
    less: {
      production: {
        options: {
          compress: true,
          modifyVars: {
            //fontpath: '"http://www.iermu.com"'
            "x-domains": domains,
            "x-base-path": "'" + source_path + "/less/'",
            "x-ui-path": "'" + source_path + "/less/ui/'",
            "x-component-path": "'" + source_path + "/components/'"
          }
        },
        files: sourceFilesHash
      }
    },
    requirejs: {
      compile: {
        options: {
          baseUrl: source_path,
          optimize: currentMode == "production" ? "uglify" : "none",
          skipDirOptimize: true,
          preserveLicenseComments: false,
          mainConfigFile: source_path + "common/builtConfig.js",
          dir: target_path + "/assets/",
          removeCombined: false,
          modules: module_configs
        }
      }
    },
    rev: {
      options: {
        encoding: 'utf8',
        algorithm: 'md5',
        length: 8,
        basename: true,
        onStep(...args) {},
        onComplete(...args) {
          args[0].forEach((_file) => {
            var ext = path.extname(_file[0]).replace(".", "");
            var m_name = _file[0].replace(target_path + ext + "/", "").replace("." + ext, "");
            var d_name = _file[1].replace(target_path + ext + "/", "").replace("." + ext, "");
            module_md5_hash[ext][m_name] = d_name;
          });
          if (Object.keys(module_md5_hash.js).length > 0 && Object.keys(module_md5_hash.css).length > 0) {
            fs.writeFileSync(static_path + "module_md5.json", JSON.stringify(module_md5_hash));
          }

        }
      },
      js: {
        files: [{
          src: [
            static_path + 'public/js/*.js',
            "!" + static_path + 'public/js/active_index.js',
            "!" + static_path + 'public/js/cyberplayer*',
            "!" + static_path + 'public/js/dropdown-menu.js',
            "!" + static_path + 'public/js/speed.js',
            "!" + static_path + 'public/js/ViewPage.class.js',
            "!" + static_path + 'public/js/ViewSharePage.class.js',
            "!" + static_path + 'public/js/wxshare.js',
            "!" + static_path + 'public/js/jquery.min.js',
            "!" + static_path + 'public/js/jquery.slide.js'
          ]
        }]
      },
      css: {
        files: [{
          src: [
            static_path + 'public/css/*.css'
          ]
        }]
      }
    },
    clean: {
      options: {
        force: true
      },
      init: [
        static_path,
        source_path + "common/builtConfig.js",
        source_path + "common/builtAConfig.js",
        source_path + "common/require_a_config.js",
        "!.git/**",
        "!.gitignore"
      ],
      js: [
        target_nodeServer_path + "node_modules",
        source_path + "common/builtConfig.js",
        source_path + "common/builtAConfig.js",
        source_path + "common/require_a_config.js",
        target_path + "assets"
      ]
    }
  });


  // 加载包含 "uglify" 任务的插件。
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks("grunt-jsbeautifier");
  grunt.loadNpmTasks('grunt-rev');

  // 默认被执行的任务列表。

  var _config = [
    //'jsbeautifier',
    //'eslint',
    'clean:init',
    'copy:configFile',
    'copy:configFileA',
    'copy:requireconfigFileA',
    'copy:resourceFiles',
    'copy:mainConfig',
    'copy:nodeServer',
    'less',
    'requirejs',
    'copy:assets',
    'rev:js',
    'rev:css',
    'clean:js'
  ];

  grunt.registerTask('default', _config);
};