define(["app", "underscore", "f_servicecallback"], function(Services) {

  Services.service("UserUpdateService", ["ServiceCallBack", "user_login_callserver", "user_updateName_callserver", "user_updatePas_callserver", "user_sentverify_user_callserver", "user_checkauth_user_callserver",
    "user_updateMobile_callserver", "user_updateEmail_callserver", "profile_check_userinfo_newemail_callserver", "profile_check_userinfo_newmobile_callserver", "profile_check_userinfo_newpassword_callserver", 
    "profile_check_userinfo_newusername_callserver","user_save_seccodeinit_callserver","user_save_checkseccode_callserver",
    function(ServiceCallBack, userLoginCallServer, userUsernameCallServer, userUpdatePasCallServer, userSentverifyUserCallServer, userCheckauthCallServer, userUpdateMobileCallServer, UserUpdateEmailCallServer,
      checkUserinfoNewemailCallServer, checkUserinfoNewmobileCallServer, checkUserinfoNewpasswordCallServer, checkUserinfoNewusernamCallServer,
      saveSeccodeInitCallServer, saveCheckSeccodeCallServer) {
      //获取验证图片
      this.getSeccodeInit = function(_params) {
        return saveSeccodeInitCallServer.query(_.extend({
          method: 'seccodeinit'
        }, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, true);
          return _data;
        });
      };
      //返回验证信息
      this.getCheckSeccode = function(_params) {
        return saveCheckSeccodeCallServer.query(_.extend({
          method: 'checkseccode'
        }, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, true);
          return _data;
        });
      };

      //专业版登录
      this.checkLogin = function(_params) {
        return userLoginCallServer.save(_.extend({
          method: 'login'
        }, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, true);
          return _data;
        });
      };

      //修改用户名
      this.getUpdateName  = function(_params) {
        return userUsernameCallServer.save(_.extend({
          method: 'update'
        }, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, true);
          return _data;
        });
      };

      //修改密码
      this.updatePas = function(_params) {
        return userUpdatePasCallServer.save(_.extend({
          method: 'updatepassword'
        }, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, true);
          return _data;
        });
      };

      //修改手机号
      this.getUpdateMobile = function(_params) {
        return userUpdateMobileCallServer.save(_.extend({
          method: 'updatemobile'
        }, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, true);
          return _data;
        });
      };

      //修改邮箱
      this.getUpdateEmail = function(_params) {
        return UserUpdateEmailCallServer.save(_.extend({
          method: 'updateemail'
        }, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, true);
          return _data;
        });
      };

      //发送验证码
      this.getSentverify = function(_params) {
        return userSentverifyUserCallServer.query(_.extend({
          method: 'sendverify'
        }, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, true);
          return _data;
        });
      };

      //获取用户授权码
      this.getReciveSenterify = function(_params) {
        return userCheckauthCallServer.save(_.extend({
          method: 'checkauth'
        }, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, true);
          return _data;
        });
      };

      //检查新邮箱是否存在
      this.checkNewEmail = function(_params) {
        return checkUserinfoNewemailCallServer.query(_.extend({
          method: 'checkemail'
        }, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, true);
          return _data;
        });
      };

      //检查新手机号是否存在
      this.checkNewMobile = function(_params) {
        return checkUserinfoNewmobileCallServer.query(_.extend({
          method: 'checkmobile'
        }, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, true);
          return _data;
        });
      };

      //检查新密码是否安全
      this.checkNewPass = function(_params) {
        return checkUserinfoNewpasswordCallServer.query(_.extend({
          method: 'checkpwd'
        }, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, true);
          return _data;
        });
      };

      //检查新昵称是否存在或合法
      this.checkNewUsername = function(_params) {
        return checkUserinfoNewusernamCallServer.query(_.extend({
          method: 'checkusername'
        }, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, true);
          return _data;
        });
      };
    }
  ]);
});
