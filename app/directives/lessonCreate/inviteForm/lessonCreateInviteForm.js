(function () {
    'use strict';
    /**
     * this code might require more work.
     * I decided to have 2 directives in same file because the parent directive
     * seems redundant and I would like to find a way to remove it altogether.
     * conceptually I couldn't bring myself to create a file for it..
     *
     * Not sure if I like angular-bootstrap tabs implementation, even though it might be suitable here.
     *
     * I want to check :
     * https://thinkster.io/angular-tabs-directive
     * before I decide
     *
     */
    function lessonCreateInviteForm() {
        return {
            restrict: 'A',
            templateUrl: 'directives/lessonCreate/inviteForm/_inviteForm.html',
            scope: {
                'onClose' : '&'
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
        .directive('lessonCreateInviteForm', lessonCreateInviteForm);
})();

