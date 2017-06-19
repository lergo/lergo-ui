'use strict';

angular.module('lergoApp')
    .service('StepService', function StepService() {

        // quiz steps might be test mode or practice mode
        // if quiz step in test mode it will have 'testMode' field set on 'True'.
        this.isTestMode = function (step) {
            return step && step.testMode === 'True';
        };
        this.isQuizStep = function(step){
            return step && step.type === 'quiz';
        };


    });
