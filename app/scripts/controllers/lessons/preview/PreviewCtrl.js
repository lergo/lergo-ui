/**
 * Created by rahul on 4/9/16.
 */

'use strict';
function lessonPreviewctrl($scope, lesson, questions,$modalInstance) {
    $scope.lesson = lesson;
    $scope.questions = {};
    _.forEach(questions,function (q){
        {
            $scope.questions[q._id]= q;

        }
    });

    $scope.cancel = function () {
        $modalInstance.dismiss();
    };
}


angular.module('lergoApp').controller('LessonPreviewCtrl', lessonPreviewctrl);
