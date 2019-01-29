define(["app"], function(Directives) {
  Directives.directive("modal", [
    function() {
      return {
        template: '<div class="modal fade" data-vertical-align="middle" data-backdrop="static" >' +
          '<div class="modal-dialog">' +
            '<div class="modal-content">' +
              '<div class="modal-header">' +
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click = "closeFn()"><i class="pic-close"></i></button>' +
                '<h4 class="modal-title">{{ title }}</h4>' +
              '</div>' +
              '<div class="modal-body" ng-transclude></div>' +
            '</div>' +
          '</div>' +
        '</div>',
        restrict: 'AE',
        transclude: true,
        replace: true,

        scope: {
          data: "=data",
          visible: "=visible",
          title: "@title",
          //back: "@back",
          className: "@",
          closeModal: "=closeModal"
        },
        link: function postLink(scope, element, attrs) {
          scope.title = attrs.title;
        
          element.find(".modal-header").click(function() {
          });
          scope.closeFn = function() {
            scope.closeModal();
          };
          scope.$watch(function() {
            return scope.visible;
          
          }, function(value) {
            if (value === true) {
              $(element).modal("show");
            } else {
              $(element).modal('hide');
            }
          });

          $(element).on('hidden.bs.modal', function() {
            scope.$parent[attrs.visible] = false;
            scope.$apply();
          });
        }
      };
    }
  ]);
});