(function () {
    'use strict';

    /**
     * @ngdoc directive
     * @name lergoApp.directive:lergoResetFilter
     * @description
     * # lergoResetFilter
     */
    angular.module('lergoApp')
        .directive('lergoResetFilter', function ( LergoFilterService, $log, $timeout ) {
            return {
                restrict: 'A',
                /**
                 *
                 * @param scope
                 * @param element
                 * @param {object} attrs
                 * @param {string} attrs.lergoResetFilter on of LergoFilterService.RESET_TYPE
                 */
                link: function postLink(scope, element, attrs) {


                    $log.info('reset filter');

                    function resetFilter(){
                        $timeout(function(){
                            var resetType = LergoFilterService.RESET_TYPES.LOGO;
                            if ( attrs.lergoResetFilter ){
                                resetType = attrs.lergoResetFilter;
                            }
                            LergoFilterService.resetFilter( resetType );
                        },0);

                    }

                    $(element).click(resetFilter);
                }
            };
    });
})();
