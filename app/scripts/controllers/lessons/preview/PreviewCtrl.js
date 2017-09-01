/**
 * Created by rahul on 4/9/16.
 */

'use strict';
function lessonPreviewctrl($scope, lesson, questions,$uibModalInstance) {
    $scope.lesson = lesson;
    $scope.questions = {};
    _.forEach(questions,function (q){
        {
            $scope.questions[q._id]= q;
        }
    });

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };
}


angular.module('lergoApp').controller('LessonPreviewCtrl', ['$scope', 'lesson', 'questions','$uibModalInstance',lessonPreviewctrl]);
