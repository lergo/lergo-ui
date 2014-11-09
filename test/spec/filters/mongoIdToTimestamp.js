'use strict';

describe('Filter: mongoIdToTimestamp', function () {

    // load the filter's module
    beforeEach(module('lergoApp'));
    var exampleText = '5414654cf832cd7a6d15593b';
    var exampleTextTimestamp = 1410622796000;

    // initialize a new instance of the filter before each test
    var mongoIdToTimestamp;
    beforeEach(inject(function ($filter) {
        mongoIdToTimestamp = $filter('mongoIdToTimestamp');
    }));

    it('should return the input prefixed with "mongoIdToTimestamp filter:"', function () {
        expect(mongoIdToTimestamp(exampleText)).toBe(exampleTextTimestamp);
    });

    it('should return empty string if no input', function () {
        expect(mongoIdToTimestamp()).toBe('');
    });

    it('should return _idTimestamp field if exists on input', function () {
        expect(mongoIdToTimestamp({ '_idTimestamp': 'this is the timestamp'})).toBe('this is the timestamp');
    });

    it('should detect it got an input and take _id property from it', function () {
        expect(mongoIdToTimestamp({ '_id': exampleText })).toBe(exampleTextTimestamp);
    });

    // guy - not sure we need this anymore since angular 1.3 watches only the input ==> which basically means it caches
    it('should cache the result on the object on property _idTimestamp', function () {
        var obj = { '_id': exampleText };
        mongoIdToTimestamp(obj);
        expect(obj._idTimestamp).toBe(exampleTextTimestamp);
    });

});
