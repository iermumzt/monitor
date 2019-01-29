define(["app", "ui_pagination", "zbase"], function(Directives, Pagination) {//
  Directives.directive("pageShow", [function() {
    return {
      templateUrl: ("/directives/pagination?" + CURRENT_PROJECT_TIMESTAMP),
      restrict: "A",
      replace: true,
      transclude: false,
      scope: {
        size: "=size",  //每页显示个数
        count: "=count", //items总数
        type: "=type", // 分页显示类型
        pageType: "@pageType", 
        bindData: "=bindData", //加载更多
        mLoading: "=mLoading",
        currentPageIndex: "=",
        pullLoad: "@"
      },
      link: function($scope,$element) {
        var myPagination;
        var pageParams;
        var mCurrentPageIndex = 1;
        var width = $(window).width();
        var maxPages;
   
        $scope.showMorePages = function(){
          if(mCurrentPageIndex >= maxPages || $scope.mpLoading || $scope.pageType === "0") return;
        	$scope.mpLoading = true;
          mCurrentPageIndex++;
          $scope.bindData(mCurrentPageIndex);
        };

        //个人摄像机添加分页
        myPagination = new Pagination({
          container: $element.find(".pagination-wrap"),
          language: CURRENT_PROJECT_LANGUAGE,
          pageSize: $scope.size,
          type: $scope.type,
          onPageChanged: function() {
            $scope.currentPageIndex = myPagination.get().pageIndex;
            $scope.bindData(myPagination);
          }
        });
        $scope.$watch('mLoading', function(newVal) {
          if((newVal && newVal != "reload") || newVal === undefined) return;
          pageParams = myPagination.get();
          maxPages = Math.ceil($scope.count / $scope.size);
          if(newVal === "reload"){
            if(IX.browser.versions.mobile && width < 1000){
              document.body.scrollTop = 0;
            }
            mCurrentPageIndex = 1;
            $scope.currentPageIndex = 1;
            $scope.noMoreComments = false;
          }
          if(maxPages <= 1){
            $scope.pageType = 0;
          }else if($scope.pageType === "0" && IX.browser.versions.mobile && width < 1000){ //移动端隐藏 
        		//todo
        	}else if($scope.pageType === "5" && width > 1000){//pc端隐藏
        		//todo
        	}else if(!IX.browser.versions.mobile || width > 1000){ 
            $scope.pageType = 1;
          }else{
            $scope.pageType = 2;
          }
          if(mCurrentPageIndex === maxPages) {
            $scope.noMoreComments = true;
          }
          $scope.mpLoading = false;
          myPagination.set({
            count: $scope.count,
            pageIndex: pageParams.pageIndex
          });
        });

        $scope.$watch("currentPageIndex", function(){
          console.info($scope.currentPageIndex);
          myPagination.set({
            pageIndex: $scope.currentPageIndex
          });
        });

        $(window).scroll(function () {
        	if(IX.browser.versions.mobile && width < 1000 && $scope.pullLoad) //&& $scope.mLoading !== "reload"
					if ($(window).scrollTop() >= $(document).height() - $(window).height()) {
						$scope.showMorePages();
					}
				});
      }
    };
  }]);
});
