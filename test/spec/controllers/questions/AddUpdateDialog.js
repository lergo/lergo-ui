'use strict';

describe('Controller: QuestionsAddUpdateDialogCtrl', function() {

	// load the controller's module
	beforeEach(module('lergoApp'));

	var QuestionsAddupdatedialogCtrl, scope;

	// Initialize the controller and a mock scope
	beforeEach(inject(function($controller, $rootScope) {
		scope = $rootScope.$new();
		QuestionsAddupdatedialogCtrl = $controller('QuestionsAddUpdateDialogCtrl', {
			$scope : scope,
            quizItem:'',
            lessonOverrideQuestion: '',
            isUpdate:'',
            step:'',
            addItemToQuiz:''
		});
	}));

    describe('#cancel', function(){
        it('should prompt user if to delete only if current section is createNewQuestion', function(){
            spyOn(window,'confirm').andReturn(false);
            spyOn(scope,'isValid').andReturn(false);
            scope.quizItem = 'hello world';


            scope.currentSection = { id : 'foo'};
            scope.cancel();
            expect(window.confirm).not.toHaveBeenCalled();

            scope.currentSection = { id : 'createNewQuestion'};
            scope.cancel();
            expect(window.confirm).toHaveBeenCalled();
        });

        it('should prompt user if to delete only if mode is invalid', function(  ){
            spyOn(window,'confirm').andReturn(false);

            spyOn(scope,'isValid').andReturn(true);
            scope.quizItem = 'hello world';


            scope.currentSection = { id : 'foo'};
            scope.cancel();
            expect(window.confirm).not.toHaveBeenCalled();

            scope.isValid.andReturn(false);
            scope.cancel();
            expect(window.confirm).not.toHaveBeenCalled();
        });




    });

});
