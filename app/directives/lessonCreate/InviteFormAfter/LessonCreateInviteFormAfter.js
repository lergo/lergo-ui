(function(){
    'use strict';


    /*
    *
    jeff: added this directive to separate between the invite before the
    lesson and after lesson. This was the only way I could get the format
    of the invite form after the lesson not to change the way (good way)
    the invite before the lesson looked
    *
    */
   function lessonCreateInviteFormAfter() {
    return {
        restrict: 'A',
        templateUrl: 'directives/lessonCreate/inviteForm/_inviteFormAfter.html',
        scope: {
            'onCloseAfter' : '&'
        },
        link: function($scope/*,element,attrs*/){

            var Modes = {
                CLASS: 'class',
                STUDENT: 'student'
            };

            $scope.mode = Modes.STUDENT;

            $scope.setMode = function( mode ){
                $scope.mode = mode;
            };

            $scope.setClassMode = function(){
                $scope.setMode(Modes.CLASS);
            };

            $scope.setStudentMode = function(){
                $scope.setMode(Modes.STUDENT);
            };

            $scope.isClassMode = function(){
                return $scope.mode === Modes.CLASS;
            };

            $scope.isStudentMode = function(){
                return $scope.mode === Modes.STUDENT;
            };
        }
    };
}
    angular.module('lergoApp')
        .directive('lessonCreateInviteFormAfter', lessonCreateInviteFormAfter);
})();