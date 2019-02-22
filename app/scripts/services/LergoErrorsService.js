(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name lergoApp.LergoErrorsService
     * @description
     * # LergoErrorsService
     * Service in the lergoApp.
     */
    angular.module('lergoApp')
    .service('LergoErrorsService', function LergoErrorsService( $http ) {

            var me = this;
            function LergoError( item ){

                this.typeof = function( e ){
                    return e.code === item.code;
                };

            }

            $http.get('/backend/system/errors').then(function (result) {

                _.each(result.data, function (item) {
                    me[item.key] = new LergoError(item);
                });
            });


    });
})();
