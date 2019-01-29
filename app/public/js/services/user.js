define(["app", "underscore", "f_servicecallback"], function(Services) {
  Services.service("UserService", ["ServiceCallBack", "search_search_users_callserver", "user_comments_callserver",
    "user_host_visitors_callserver", "user_host_user_callserver", "user_host_share_videos_callserver", "camera_yunlist_callserver", "camera_creat_order_callserver", "camera_my_cards_callserver",
    "camera_my_tickets_callserver", "camera_my_cardhistory_callserver", "camera_my_tickethistory_callserver", "profile_myorder_callserver", "profile_orders_callserver",
    "profile_deleteordernumber_callserver", "profile_map_callserver", "profile_street_callserver", "profile_street2_callserver", "profile_addKa_callserver", "profile_addTicket_callserver", "profile_kapay_callserver", "profile_payTicket_callserver", "profile_recordpay_callserver",
    "profile_paymoney_callserver", "camera_paystatus_callserver",
    function(ServiceCallBack, SearchUsersCallServer, userCommentsCallServer, HostVisitorsCallServer, hostUserInfoCallServer, UserShareVideosCallServer,
      YunListCallServer, CreatOrderCallServer, CardsCallServer, TicketsCallServer, CardhistoryCallServer, TickethistoryCallServer, PersonalMyOrderCallServer, PersonalOrderCallServer, PersonalDeleteOrderNumberCallServer,
      PersonalMapCallServer, PersonalStreetCallServer, PersonalStreet2CallServer, addKaCallServer, addTicketCallServer, kapayCallServer, payTicketCallServer, recordpayCallServer, paymoneyCallServer, PaystatusCallServer) {
    //通过关键字搜索用户
      this.searchUsers = function(_params) {
        return SearchUsersCallServer.query(_.extend({
          type: "user",
          sharenum: 2
        }, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, true);
          return _data;
        });
      };
      //我的主页-用户评论列表
      this.userComments = function(_params) {
        return userCommentsCallServer.query(_.extend({
          method: "listcomment"
        }, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, true);
          return _data;
        });
      };
      //我的主页-访客记录
      this.userHistory = function(_params) {
        return HostVisitorsCallServer.query(_.extend({
          method: "listview"
        }, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, true);
          return _data;
        });
      };
      //我的主页-登录后个人信息
      this.userInfo = function(_params) {
        return hostUserInfoCallServer.query(_.extend({
          method: "info"
        }, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, true);
          return _data;
        });

      };
      //我的主页-我的直播
      this.userVideo = function(_params) {
        return UserShareVideosCallServer.query(_.extend({}, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, true);
          return _data;
        });
      };

      //购买云录制-云服务类型列表
      this.yunlist = function(_params) {
        return YunListCallServer.query(_.extend({}, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, true);
          return _data;
        });
      };
      //购买云录制-获取支付状态
      this.getPaystatus = function(_params) {
        return PaystatusCallServer.query(_.extend({}, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, true);
          return _data;
        });
      };
      //购买云录制-创建订单列表    query改 save
      this.creatOrder = function(_params) {
        return CreatOrderCallServer.save(_.extend({}, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, true);
          return _data;
        });
      };
      //购买云录制-我的充值卡列表
      this.userCards = function(_params) {
        return CardsCallServer.query(_.extend({}, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, true);
          return _data;
        });

      };
      //购买云录制-我的优惠券
      this.userTickets = function(_params) {
        return TicketsCallServer.query(_.extend({}, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, true);
          return _data;
        });
      };
      //优惠卡券-我的充值卡历史记录
      this.userCardHistory = function(_params) {
        return CardhistoryCallServer.query(_.extend({}, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, true);
          return _data;
        });
      };
      //优惠卡券-我的优惠券历史记录
      this.userTicketHistory = function(_params) {
        return TickethistoryCallServer.query(_.extend({}, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, true);
          return _data;
        });
      };

      //订单-我的订单详情
      this.userMyOrder = function(_params) {
        return PersonalMyOrderCallServer.query(_.extend({}, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, true);
          return _data;
        });
      };

      //订单-我的订单列表
      this.userOrder = function(_params) {
        return PersonalOrderCallServer.query(_.extend({}, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, true);
          return _data;
        });
      };

      //删除订单
      this.delOrder = function(_params) {
        return PersonalDeleteOrderNumberCallServer.save(_.extend({}, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, false);
          return _data;
        });
      };
      //订单-我的订单地区
      this.getPersonalMap = function(_params) {
        return PersonalMapCallServer.query(_.extend({
          method: "info"
        }, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, true);
          return _data;
        });

      };

      //订单-我的订单地区2
      this.getPersonalStreet = function(_params) {
        return PersonalStreetCallServer.query(_.extend({
          method: "info"
        }, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, true);
          return _data;
        });
      };

      //订单-开发票-我的订单地址提交
      this.getPersonalStreet2 = function(_params) {
        return PersonalStreet2CallServer.save(_.extend({}, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, true);
          return _data;
        });

      };


      //绑定充值卡
      this.addKa = function(_params) {
        return addKaCallServer.save(_.extend({}, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, false);
          return _data;
        });
      };
      //添加绑定优惠券
      this.addTicket = function(_params) {
        return addTicketCallServer.save(_.extend({}, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, false);
          return _data;
        });
      };
      //充值卡支付订单
      this.userKaPay = function(_params) {
        return kapayCallServer.save(_.extend({}, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, false);
          return _data;
        });
      };
      //使用优惠券
      this.payTicket = function(_params) {
        return payTicketCallServer.save(_.extend({}, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, false);
          return _data;
        });
      };


      //确认订单
      this.userRecordPay = function(_params) {
        return recordpayCallServer.save(_.extend({}, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, false);
          return _data;
        });
      };



      //支付订单
      this.paymoney = function(_params) {
        return paymoneyCallServer.query(_.extend({}, _params)).$promise.then(function(_data) {
          _data = ServiceCallBack.renderData(_data, false);
          return _data;
        });
      };
    }
  ]);
});