(function(){
    'use strict';

    /**
     * @description
     *
     * unlike other models, faqs model is actually a collection.
     *
     * this means
     *  - the faq always exists
     *  - when you create, you actually update the model with another item in the collection.
     *  - when you delete, you actually update the model by splicing one item out
     *  - when you modify the order, you actually update a single model with items index changed.
     *
     */
    angular.module('lergoApp').controller('FaqIndexCtrl', function($scope, $log, LergoTranslate, ContinuousSave, LergoClient ) {

        function init() {
            stopWatch();
            LergoClient.faqs.list(LergoTranslate.getLanguage()).then(function (result) {
                if (!result.data) { // need to create
                    return LergoClient.faqs.create({locale: LergoTranslate.getLanguage()});
                }else{
                    return result;
                }
            }).then( function(result){
                $scope.faq = result.data;
                startWatch();
            }, function(){
                toastr.error('failed getting faq','failed');
            });
        }

        var watcher = null;
        function startWatch(){
            if ( watcher !== null){
                $log.error('watcher exists!!!');
            }
            $log.info('start watching');
            if ( saveContent ) { // test friendly
                watcher = $scope.$watch('faq', saveContent.onValueChange, true);
            }else{ // test friendly

                watcher = $scope.$watch('faq', function onValueChange(){}, true);
            }
        }

        function stopWatch(){
            if ( watcher !== null ){
                watcher(); // stops watching: http://stackoverflow.com/questions/13651578/how-to-unwatch-an-expression
            }
        }


        init();

        var saveContent = new ContinuousSave({
            'saveFn' : function(value) {
                return LergoClient.faqs.update(value);
            }
        });



        $scope.isSaving = function() {
            return !!saveContent.getStatus().saving;
        };

        $scope.addFAQ = function() {
            if (!$scope.faq.contents) {
                $scope.faq.contents = [];
            }
            $scope.faq.contents.push({});
        };

        $scope.removeFAQ = function(index) {
            if ( window.confirm('are you sure you want to remove this helper content?') ) {
                $scope.faq.contents.splice(index, 1);
            }
        };

        $scope.$watch(function() {
            return LergoTranslate.getLanguage();
        }, function handleLanguageChanged(newValue, oldValue) {
            if (!!newValue && !!oldValue && newValue !== oldValue) {
                init();
            }
        });

        $scope.moveUp = function(index) {
            var temp = $scope.faq.contents[index - 1];
            if (temp) {
                $scope.faq.contents[index - 1] = $scope.faq.contents[index];
                $scope.faq.contents[index] = temp;
            }
        };
        $scope.moveDown = function(index) {
            $scope.moveUp(index+1);
        };
    });
})();
