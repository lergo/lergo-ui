'use strict';

angular.module('lergoApp')
    .controller('CreateLessonCtrl', function ($scope) {

        var QUIZ_TYPE = "quiz";

        $scope.lesson = { 'title':'confusing words: they\'re,their,there','steps': [{ 'name':'quiz', 'type':QUIZ_TYPE, 'questions':[]}], 'language':'English', 'subject':'Math','languages':['Espanol','English']};
        $scope.selected = { step: $scope.lesson.steps[0], question: null};


        function _addQuestionToStep( step, newQuestion ){
            step.questions.push( newQuestion );
        }


        function _newQuestion(){
            return {'useMedia':'no','difficulty':'1', 'addHint':'no','type':1,'addExplanation':'no', options:[]};
        }

        function _getStepsByType( type ){
            return $.grep($scope.lesson.steps, function( item, index ){ return item.type == type; });
        }

        function _init() {
            var quizzes = _getStepsByType(QUIZ_TYPE);
            $.each(quizzes, function (index, item) {
                _addQuestionToStep(item, _newQuestion());
                $.each(item.questions, function (qIndex,qItem) {
                    $scope.addAnswerOption(qItem);
                    $scope.addAnswerOption(qItem);
                })
            });
            $scope.selected.step = quizzes[0];
            $scope.selected.question = quizzes[0].questions[0];

        }

        $scope.characters = [
            {'img': '/images/characters/character1.png'},
            {'img': '/images/characters/character2.png'},
            {'img': '/images/characters/character3.png'},
            {'img': '/images/characters/character4.png'},
            {'img': '/images/characters/character5.png'},
            {'img': '/images/characters/character6.png'}
        ];
        $scope.availableSubjects = ['Math','Computers'];

        $scope.addStep = function (lesson) {
            $scope.selected.step = {'name': 'new step', 'showAnimated':'yes', 'character':$scope.characters[0]};
            lesson.steps.push($scope.selected.step);

        };

        $scope.apply = function (lesson) {
            console.log(['applying', lesson]);
        };

        $scope.delete = function (lesson, step) {
            lesson.steps.splice(lesson.steps.indexOf(step));
        };

        $scope.addAnswerOption = function( question ){
            question.options.push({});
        };

        $scope.getTemplateName = function( step ){
            var template = '_lessonStep';
            if ( step.type == 'quiz'){
                template= '_quizStep';
            }

            return 'views/lesson/' + template + '.html'
        };

        $scope.addQuestion = function( step ){
            var newQuestion = _newQuestion();
            _addQuestionToStep( step, newQuestion );
            $scope.selected.question = newQuestion;
        };

        $scope.removeQuestion = function( step, question ){
            step.questions.splice( step.questions.indexOf(question),1);
            if ( $scope.selected.question == question ){
                $scope.selected.question = null;
            }
        };

        $scope.selectQuestion = function( question ){
            $scope.select.question = question;
        };

        $scope.markOptionAsCorrect = function( question,option ){
            console.log("marking option as correct");
            for ( var i = 0; i < question.options.length; i ++){
                question.options[i].correct = false;
            }
            option.correct = true;
        };
        $("body").bind("drop", function(){
            console.log("I am dropping");
        });

        function _switchElements( index1, index2 ){
            if ( !$scope.selected.question){
                return;
            }
            var options = $scope.selected.question.options;
            if ( !options){
                return;
            }else{
                if ( !object1 || !object2){
                    return;
                }
                var object1 = options[index1];
                var object2 = options[index2];
                options[index1] = object2;
                options[index2] = object1;
            }
        }

        function _moveToTail( index1 ){
            if ( !$scope.selected.question){
                return;
            }
            var options = $scope.selected.question.options;
            if ( !options){
                return;
            }else{
                var object1 = options[index1];
                if ( !object1 ){
                    return;
                }
                options.splice(index1,1);
                options.push(object1);
            }
        }

        function _isNumber( n ){
            return !isNaN(parseInt(n));
        }

        var isDragging = false;
        $('body').on('dragstart','[draggable]', function(e){
            e.originalEvent.dataTransfer.dropEffect = 'move';  // See the section on the
            e.originalEvent.dataTransfer.setData("Text",$(this).attr("data-index"));
            console.log("I am dragging!");
          isDragging = true;
        }).on('dragenter', '[dropzone]',function(){
                $("[dropzone]").removeClass("drag-over");
                    $(this).addClass("drag-over");
        }).on('dragover', function(e){
                console.log("preventing default");
                e.originalEvent.stopPropagation();
                e.originalEvent.preventDefault();
            }).on('dragenter','.label',function(){
                console.log("scroll leave");
                $("[dropzone]").removeClass("drag-over");
        }).on('drop','[dropzone]',function(e){
                e.originalEvent.stopPropagation();
                e.originalEvent.preventDefault();

                var index1 = e.originalEvent.dataTransfer.getData("Text");
                var index2 = $(this).attr("data-index");
                console.log(["dropping", index1, index2]);

                $scope.$apply(function(){
                    if ( _isNumber(index1) && _isNumber(index2)){
                        _switchElements(index1,index2);
                    }

                    if ( index2 == "tail"){
                        _moveToTail(index1);
                    }
                });


                return false;
            }).on('dragend', function(){

                $("[dropzone]").removeClass("drag-over");
            });

        $scope.questionTypeOptions = [{'id':1, 'label':'multiple choice'},{'id':2, 'label':'fill in the blank'}];

        _init();
    });
