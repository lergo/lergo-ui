'use strict';

describe('Service: missingTranslationFactory', function () {

    // load the service's module
    beforeEach(module('lergoApp'));

    // instantiate service
    var mmissingTranslationFactory;
    beforeEach(inject(function (missingTranslationFactory) {
        mmissingTranslationFactory = missingTranslationFactory;
    }));

    it('should do something', function () {
        expect(!!mmissingTranslationFactory).toBe(true);
    });

});
