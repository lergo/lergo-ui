'use strict';

/**
 * @ngdoc service
 * @name lergoApp.LergoResourceLinksConverter
 * @description
 * # LergoResourceLinksConverter
 * Service in the lergoApp.
 */
angular.module('lergoApp')
    .service('LergoResourceLinksConverter', function ( $log ) {

        /**
         * @example
         * https://drive.google.com/file/d/0B48m4oFFlf9IUVZueFA4VVg5Ym8/view?usp=sharing
         * http://drive.google.com/uc?export=view&id=0B48m4oFFlf9IUVZueFA4VVg5Ym8
         *
         * <pre>
         *
         *      var link = 'https://drive.google.com/file/d/0B48m4oFFlf9IUVZueFA4VVg5Ym8/view?usp=sharing'
         * </pre>
         *
         * @param link
         */
        this.convertGoogleDriveLink = function(link){
            return link.replace(new RegExp('(https://drive.google.com)/file/d/(.+)/.*'), '$1/uc?export=view&id=$2');
        };

        this.LINK_TYPE = {
            GOOGLE_DRIVE: { 'id' : 'google-drive', 'regex' : 'drive.google.com/file/d/'},
            OTHER:  { 'id' : 'other', 'regex' : '' }
        };

        this.getLinkType = function(link){
            return _.find(this.LINK_TYPE, function(t){
                return  new RegExp(t.regex).test(link);
            });
        };



        this.convert = function (link) {
            try {
                var type = this.getLinkType(link);

                if ( type === this.LINK_TYPE.GOOGLE_DRIVE ){
                    return this.convertGoogleDriveLink(link);
                }

            } catch (e) {
                $log.info('could not convert url [',link,']', e);
            }
            return link;
        };
    });
