'use strict';

describe('Controller: FaqIndexCtrl', function() {

	// load the controller's module
	beforeEach(module('lergoApp'));

	var FaqIndexCtrl,
        $controller,
        $rootScope,
        LergoClient,
        ContinuousSave,
        saveContent,
        scope;

    function initController(){
        scope = $rootScope.$new();
        FaqIndexCtrl = $controller('FaqIndexCtrl', {
            $scope : scope,
            ContinuousSave: ContinuousSave

        });
    }

	// Initialize the controller and a mock scope
	beforeEach(inject(function(_$controller_, _$rootScope_, _LergoClient_) {
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        LergoClient = _LergoClient_;
        saveContent = {
            onValueChange:jasmine.createSpy('onValueChange'),
            getStatus: jasmine.createSpy('getStatus').andReturn({ saving: true})
        };
        ContinuousSave = jasmine.createSpy('ContinuousSave').andReturn(saveContent);

        spyOn(LergoClient.faqs,'list').andReturn(window.mockPromise(null,null,window.mockPromise()));
        spyOn(LergoClient.faqs,'create').andReturn(window.mockPromise());
        spyOn(LergoClient.faqs,'update').andReturn(window.mockPromise());

        initController();

	}));

    describe('init', function(){



        it('should call faqs.list', function(){
            expect(LergoClient.faqs.list).toHaveBeenCalled();
        });

        it('should call faqs.create if list returns nothing', function(){
            LergoClient.faqs.list.andReturn(window.mockPromise({}, null, window.mockPromise()));
            initController();
            expect(LergoClient.faqs.create).toHaveBeenCalled();
        });

        it('should pass faq found in db if such exists', function(){
            LergoClient.faqs.list.andReturn(window.mockPromise({data:'foo'}, null, window.mockPromise({data:'foo'}) ));
            initController();
            expect(LergoClient.faqs.create).not.toHaveBeenCalled();
            expect(scope.faq).toBe('foo');
        });

        it('should notify user if failed loading', function(){
            LergoClient.faqs.list.andReturn(window.mockPromise(null , null, window.mockPromise(null, {}) ));
            initController();
            expect(toastr.error).toHaveBeenCalled();
        });

        it('should call ContinuousSave', function(){
            expect(ContinuousSave).toHaveBeenCalled();
            expect(LergoClient.faqs.update).not.toHaveBeenCalled();
            var opts =ContinuousSave.mostRecentCall.args[0];
            opts.saveFn();
            expect(LergoClient.faqs.update).toHaveBeenCalled();
        });


    });

    describe('$$watchers', function(){
        /**
         *
         * @type {function} {Window.mapWatchers}
         * @property {function} handleLanguageChanged
         * @property {function} onValueChange
         */
        var watchers = window.mapWatchers;

        it('should watch faq with ', function(){
            LergoClient.faqs.list.andReturn(window.mockPromise({data:'foo'}, null, window.mockPromise({data:'foo'}) ));
            initController();
            expect(watchers(scope).handleLanguageChanged).toBeDefined();
            expect(watchers(scope).onValueChange).toBeDefined();
        });
    });

    describe('#addFAQ', function(){
        it('should add an item', function(){
            scope.faq = { contents: [] };
            scope.addFAQ();
            expect(scope.faq.contents.length).toBe(1);
        });

        it('should create contents if does not exist', function(){
            scope.faq = {};
            scope.addFAQ();
            expect(scope.faq.contents).toBeDefined();
        });
    });

    describe('#removeFAQ', function(){

        beforeEach(function(){
            scope.faq = { contents: [1,2,3,4,5,6,7]};
            spyOn(window,'confirm').andReturn(true);
        });

        it('should prompt', function(){
            scope.removeFAQ(3);
            expect(window.confirm).toHaveBeenCalled();
        });

        it('should remove item from faq.content', function(){
            scope.removeFAQ(3);
            expect(scope.faq.contents.length).toBe(6);
        });
    });

    describe('#moveUp', function(){
        it('should move items up', function(){
            scope.faq = {contents: [1,2,3,4]};
            scope.moveUp(1);
            expect(scope.faq.contents[0]).toBe(2);
            expect(scope.faq.contents[1]).toBe(1);
        });
    });

    describe('#moveDown', function(){
        it('should move items down', function(){
            scope.faq = {contents: [1,2,3,4]};
            scope.moveDown(0);
            expect(scope.faq.contents[0]).toBe(2);
            expect(scope.faq.contents[1]).toBe(1);
        });
    });

    describe('#isSaving', function(){
        it('should look at ContinuousSave result if model is saving', function(){
            scope.isSaving();
            expect(saveContent.getStatus).toHaveBeenCalled();
        });
    });

});
