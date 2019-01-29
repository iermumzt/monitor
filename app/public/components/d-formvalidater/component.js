define(["angular", "IX"], function() {
  var _maxNum, regs, i;
  var FormValidater = angular.module("FormValidater", []);
  /**
   * 表单校验指令集zbase-[指令名称]
   */
  FormValidater.directive("zbaseMincharlength", [function() {
    return {
      require: 'ngModel',
      link: function($scope, $element, attrs, controller) {
        controller.$parsers.push(function(viewValue) {
          if (viewValue === undefined) {
            controller.$setValidity('zbaseMincharlength', true);
          } else if (viewValue.charLength() < attrs.zbaseMincharlength) {
            controller.$setValidity('zbaseMincharlength', false);
          } else {
            controller.$setValidity('zbaseMincharlength', true);
          }
          return viewValue;
        });
      }
    };
  }]);
  FormValidater.directive("zbaseMaxcharlength", [function() {
    return {
      require: 'ngModel',
      link: function($scope, $element, attrs, controller) {
        controller.$parsers.push(function(viewValue) {
          if (viewValue === undefined) {
            controller.$setValidity('zbaseMaxcharlength', true);
          } else if (viewValue.charLength() > attrs.zbaseMaxcharlength) {
            controller.$setValidity('zbaseMaxcharlength', true);
          } else {
            controller.$setValidity('zbaseMaxcharlength', true);
          }
          return viewValue;
        });
      }
    };
  }]);
  FormValidater.directive("zbaseInputTruncate", [function() {
    return {
      require: 'ngModel',
      link: function($scope, $element, attrs, controller) {
        if (attrs.zbaseMaxcharlength) {
          _maxNum = attrs.zbaseMaxcharlength;
          $element.keyup(function() {
            $scope.$apply(function() {
              controller.$setViewValue($element.val().subBycharLength(_maxNum));
              controller.$render();
            });
          });
        }
      }
    };
  }]);
  FormValidater.directive("zbaseIsfocus", [function() {
    return {
      require: 'ngModel',
      link: function($scope, $element, attrs, controller) {
        $element.focus(function() {
          controller.$setValidity('zbaseIsfocus', true);
          $scope.$apply();
        });
        $element.blur(function() {
          controller.$setValidity('zbaseIsfocus', false);
          $scope.$apply();
        });
      }
    };
  }]);
  FormValidater.directive("zbaseIsblur", [function() {
    return {
      require: 'ngModel',
      link: function($scope, $element, attrs, controller) {
        $element.focus(function() {
          controller.$setValidity('zbaseIsblur', false);
          $scope.$apply();
        });
        $element.blur(function() {
          controller.$setValidity('zbaseIsblur', true);
          $scope.$apply();
        });
      }
    };
  }]);
  FormValidater.directive("zbaseMuiltPattern", [function() {
    return {
      require: 'ngModel',
      link: function($scope, $element, attrs, controller) {
        controller.$parsers.push(function(viewValue) {
          /*jshint -W054 */
          /*eslint no-eval: "off"*/
          regs = eval(attrs.zbaseMuiltPattern);
          for (i = 0; i < regs.length; i++) {
            controller.$setValidity('zbaseMuiltPattern' + i, viewValue === undefined || !!regs[i].test(viewValue));
          }
          return viewValue;
        });
      }
    };
  }]);
});
