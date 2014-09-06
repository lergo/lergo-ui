'use strict';

describe('Directive: questionReadLink', function () {
    beforeEach(module('lergoApp'));

    var element;

    function setup() {
        element = angular.element('<div question-read-link question="question"></div>');

        inject(function ($compile, $rootScope) {

            $rootScope.question = {
                '_id': '123',
                'question': 'this is my question'
            };

            element = $compile(element)($rootScope);
            $rootScope.$digest();
        });
    }

    it('should show the question as link title', function () {
        setup();
        expect(element.text()).toBe('this is my question');
    });

    it('should have href attribute pointing to /read of the question', function () {
        setup();
        expect(element.find('a').attr('href')).toBe('#!/public/questions/123/read');
    });




});
