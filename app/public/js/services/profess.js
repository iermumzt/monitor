define(["app", "underscore", "f_servicecallback"], function (Services) {
	Services.service("ProfessService", ["$q", "ServiceCallBack", "camera_graph_data_callserver", 

		function ($q, ServiceCallBack, getGraphDataCallServer) {
			
      var _this = this;
      
			//获取图表
			this.getGraphData = function(_params) {
				return getGraphDataCallServer.query(_.extend({//save
					method: 'mzt',
				}, _params)).$promise.then(function (_data) {
					_data = ServiceCallBack.renderData(_data, true);
					return _data;
				})
			};
		}
	]);
});