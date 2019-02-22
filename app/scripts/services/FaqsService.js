(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name lergoApp.FaqService.js
     * @description
     * # FaqService.js
     * Service in the lergoApp.
     */
    angular.module('lergoApp')
        .service('FaqsService', function ($http) {
            // AngularJS will instantiate a singleton by calling "new" on this function
            this.list = function( locale ) {
                return $http({
                    'method' : 'GET',
                    'url' : '/backend/faqs',
                    'params' : {
                        'query' : {
                            'locale' : locale
                        }
                    }
                });
            };


            /**
             *
             * @param {object} content
             * @param {string} content.locale
             * @returns {promise}
             */
            this.create = function(content) {
                return $http.post('/backend/faqs/create', content);
            };
            this.update = function(content) {
                return $http.post('/backend/faqs/' + content._id + '/update', content);
            };

            this.delete = function( faqId ){
                return $http({
                    method:'DELETE',
                    'url' : '/backend/faqs/' + faqId
                });
            };


    });
})();
