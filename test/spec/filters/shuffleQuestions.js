'use strict';

describe('Filter: shuffleQuestions', function () {

    // load the filter's module
    beforeEach(module('lergoApp'));

    // initialize a new instance of the filter before each test
    var shuffleQuestions;
    beforeEach(inject(function ($filter, $log ) {
        shuffleQuestions = $filter('shuffleQuestions');
        spyOn($log, 'error');
    }));

    it('should do nothing if not array, array is shuffled or disabled is true', function () {

        var anArray = [];
        expect(shuffleQuestions({})).toBe(undefined);
        expect(shuffleQuestions({array:null})).toBe(null);

        expect(shuffleQuestions({array: anArray, disabled:true})).toBe(anArray);

        var shuffledArray = [1,2];
        shuffledArray.isShuffled = true;
        expect(shuffleQuestions({array: shuffledArray})).toBe(shuffledArray);
    });

    it('should shuffle questions', function(){
        var shuffled = false;
        for ( var i = 0; i < 10  ; i++ ){
            var myArray = [1,2,3];
            var myClone = _.map(myArray); //  we need a clone since shuffle shuffles the object itself.
            var result = shuffleQuestions({array:myArray});
            shuffled = shuffled || _.isShuffled(myClone, result);
        }

        expect(shuffled).toBe(true);
    });

    it('should call log.error if stepIndex exists but report does not', inject(function( $log ){
        shuffleQuestions({ array: [], stepIndex: 1});
        expect($log.error).toHaveBeenCalled();
    }));

    it('should call log.error if stepIndex does not exists but report does exist', inject(function( $log ){
        shuffleQuestions({ array: [], report: {}});
        expect($log.error).toHaveBeenCalled();
    }));

    it('should not call log.error if stepIndex is 0', inject(function( $log ){
        shuffleQuestions({ array: [], stepIndex: 0, report:{}});
        expect($log.error).not.toHaveBeenCalled();
    }));

    it('should sort shuffled array so that questions with answers are first', inject(function( ReportsService ){
        spyOn(ReportsService, 'getAnswersByQuizItemId').andCallFake(function(){
            return  { '3' :'3', '1' :'1' };
        });


        //for ( var i =0; i<10 ; i++) {
        var shuffleResult = shuffleQuestions({array: ['1',  '2',  '3'], stepIndex: 0, report: {}});
        expect(shuffleResult[0] === '3' || shuffleResult[1] === '3' ).toBe(true);
        //}
    }));



});
