define(["app", "ui_pagination", "s_layoutmanager", "zbase"], function(Directives, Pagination) { //
  Directives.directive("pageShow", ["LayoutManager", function(LayoutManager) {
    return {
      template: CURRENT_PROJECT_DIRECTIVES["d-pagination-list"],
      restrict: "A",
      replace: true,
      transclude: false,
      scope: {
        size: "=size", //每页显示个数
        count: "=count", //items总数
        type: "=type", // pc分页显示类型
        hidePage: "@", //1. 移动端不显示; 2.pc端不显示
        onPageChanged: "=", 
        isLoading: "=", //列表加载数据
        mLoading: "=",  //移动端查看更多加载
        currentPageIndex: "=",
        pullLoad: "@",
        pageTag: "="
      },
      link: function($scope, $element) {
        // console.info("$scope.mLoading",$scope.mLoading,"$scope.count",$scope.count,"$scope.currentPageIndex",$scope.currentPageIndex);
        var myPagination;
        var pageParams;
        var mPageIndex = 1;
        var width = $(window).width();
        var isMobile = LayoutManager.widthType === 300;

        $scope.showMorePages = function() {
          if ($scope.currentPageIndex >= $scope.pageCount || $scope.isLoading || $scope.hidePage === "0") return;
          $scope.currentPageIndex++;
          $scope.onPageChanged($scope.currentPageIndex);
        };

        myPagination = new Pagination({
          container: $element.find(".pagination-wrap"),
          language: CURRENT_PROJECT_LANGUAGE,
          pageSize: $scope.size,
          type: $scope.type,
          onPageChanged: function() {
            $scope.currentPageIndex = myPagination.get().pageIndex;
            $scope.onPageChanged(myPagination.get().pageIndex);
          }
        });
        $scope.$watch('count', function(newVal, oldVal) {
          if (newVal === oldVal) return;
          $scope.pageCount = Math.ceil($scope.count / $scope.size);
          if ($scope.pageCount <= 1) {
            $scope.pageType = 0;
          } else if ($scope.hidePage === "0" && isMobile) { //移动端隐藏 
            //todo
          } else if ($scope.hidePage === "1" && !isMobile) { //pc、pad端隐藏
            //todo
          } else if (!isMobile) {
            if(!$scope.pageTag) $scope.currentPageIndex = 1;
            $scope.pageType = 1;
          } else {
            if(!$scope.pageTag)  $scope.currentPageIndex = 1;
            document.body.scrollTop = 0;
            $scope.noMoreComments = false;
            $scope.pageType = 2;
          }
          myPagination.set({
            count: $scope.count,
            pageIndex: $scope.currentPageIndex,
            pageSize: $scope.size
          });
        });
        $scope.$watch('currentPageIndex', function(newVal, oldVal) {
          if (newVal === oldVal) return;
          myPagination.set({
            pageIndex: $scope.currentPageIndex
          });
        });
        LayoutManager.on(function() { //括号中删除了_width;
          if (LayoutManager.widthType !== 300) {
            $scope.pageType = 1;
          }
          if (!$scope.hidePage && $scope.pageCount > 1) {
            if (LayoutManager.widthType !== 300) {
              $scope.pageType = 1;
            } else {
              $scope.onPageChanged(1);
              $scope.pageType = 2;
            }
            $scope.$apply();
          }
        });

        $(window).scroll(function() {
          if (isMobile && $scope.pullLoad) {
            if ($(window).scrollTop() >= $(document).height() - $(window).height()) {
              $scope.showMorePages();
            }
          }
        });
      }
    };
  }]);
});
