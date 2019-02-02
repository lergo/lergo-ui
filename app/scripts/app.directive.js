// guy - this is a temporary fix for angular-bootstrap
// https://github.com/angular-ui/bootstrap/issues/2828
angular.module('lergoApp').directive('tooltip', function () {
    return {
        restrict: 'EA',
        link: function (scope, element, attrs) {
            attrs.tooltipTrigger = attrs.tooltipTrigger;
            attrs.tooltipPlacement = attrs.tooltipPlacement || 'top';
        }
    };
});