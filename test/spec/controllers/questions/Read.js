'use strict';

describe('Controller: QuestionsReadCtrl', function () {

    // load the controller's module
    beforeEach(module('lergoApp'));

    var QuestionsReadCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $q) {
        scope = $rootScope.$new();
        QuestionsReadCtrl = $controller('QuestionsReadCtrl', {
            $scope: scope,
            QuestionsService: {
                getQuestionById: function () {
                    console.log('getting question by id');
                    var deferred = $q.defer();
                    deferred.resolve({});
                    return deferred.promise;
                }
            }
        });
    }));

    it('should attach getQuestionViewTemplate function scope', function () {
        expect(typeof(scope.getQuestionViewTemplate)).toBe('function');
    });
});
