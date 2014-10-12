'use strict';

describe('Filter: i18n', function () {

    // load the filter's module
    beforeEach(module('lergoApp'));

    // initialize a new instance of the filter before each test
    var i18n;
    var httpMock;
    beforeEach(inject(function ($filter, $httpBackend) {
        try {
            httpMock = $httpBackend;
            httpMock.expectGET('/backend/system/translations/en.json').respond({'angularjs': 'cool'});
            httpMock.expectGET('/backend/system/translations/he.json').respond({'angularjs': 'cool'});
            httpMock.expectGET('/backend/system/translations/ru.json').respond({'angularjs': 'cool'});
            httpMock.expectGET('/backend/system/translations/ar.json').respond({'angularjs': 'cool'});
            httpMock.expectGET('/translations/general.json').respond({'angularjs': 'cool'});
            i18n = $filter('i18n');
            httpMock.flush();
        } catch (e) {
            console.log('got error while injecting ' + e.message);
        }


    }));

    it('should return ???angularjs??? because we do not have a translation for that key', function () {
        var text = 'angularjs';
        expect(i18n(text)).toBe('???angularjs???');
    });

});
