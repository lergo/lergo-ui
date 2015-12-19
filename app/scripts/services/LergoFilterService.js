'use strict';

/**
 * @ngdoc service
 * @name lergoApp.LergoFilterService
 * @description
 * # LergoFilterService
 * Service in the lergoApp.
 */
angular.module('lergoApp')
    .service('LergoFilterService', function ( $log, localStorageService, $location, $routeParams, $timeout ) {

        var me = this;

        /**
         *
         * @type {Date}
         * @description keeps track of when the cache was reset last. allows others to watch this value and act accordingly.
         */
        me.lastReset = new Date();

        var resetFilter = function( keepKeys ){

            if ( !keepKeys ){
                keepKeys = [];
            }else if ( keepKeys.ignore ){
                keepKeys = keepKeys.ignore;
            }



            _.each(_.compact(_.map(me.FILTERS, function(filter){
                return keepKeys.indexOf(filter) < 0 ? filter.getFullKeyName() : null ;
            })), function( filterKey ){
                localStorageService.remove(filterKey);
                $location.search(filterKey, null);
            });

            $timeout(me.updateLastReset,1); // timeout required because $location.search will only apply on next tick or something..
        };


        me.getLastReset = function(){
            return me.lastReset;
        };

        me.updateLastReset = function(){
            me.lastReset = new Date();
        };

        me.getSavedValue = function( filter ){
            var filterName = filter.getFullKeyName();
            var saved = $routeParams[filterName];
            try{
                saved = ($routeParams[filterName] && JSON.parse($routeParams[filterName])) || localStorageService.get(filterName);
            }catch(e){}
            if (_.isEmpty(saved)) {
                saved = null;
            }
            return saved;
        };


        // active if there's one relevant filter with value
        me.isActive = function( resetType, relevancyOpts ){
            var result = _.find(me.FILTERS, function( f ){
                return resetType.ignore.indexOf(f) < 0 &&
                    !!f.isRelevant(relevancyOpts) &&
                    me.getSavedValue(f) !== null;
            });

            return !!result;
        };




        /**
         * @typedef {object} LergoFilter
         * @property {string} key
         * @property {string} relevancy
         */
        /**

         * @param {string} key
         * @param {string} relevancy
         * @constructor
         */
        function Filter( key, relevancy ){

            this.key = key;
            this.relevancy = relevancy;

            this.isRelevant = function(opts) {
                return !!opts && !!opts[this.relevancy];
            };

            this.getFullKeyName = function(){
                return Filter.getFullKeyName(this.key);
            };

            this.toString = function(){
                return this.key;
            };
        }

        Filter.FILTER_PREFIX = 'lergoFilter';

        Filter.getFullKeyName = function(keyName){
            return Filter.FILTER_PREFIX + '.' + keyName;
        };


        me.FILTERS = {
            'REPORT_STUDENT':            new Filter('reportStudent',      'showStudents'             ),
            'AGE_FILTER':                new Filter('ageFilter',          'showAge'                  ),
            'VIEWS_FILTER':              new Filter('viewsFilter',        'showViews'                ),
            'CORRECT_PERCENTAGE':        new Filter('correctPercentage',  'showCorrectPercentage'    ),
            'FILTER_LANGUAGE':           new Filter('filterLanguage',     'showLanguage'             ),
            'MODEL_SUBJECT':             new Filter('model.subject',      'showSubject'              ),
            'FILTER_TAGS':               new Filter('filterTags',         'showTags'                 ),
            'REPORT_STATUS_VALUE':       new Filter('reportStatusValue',  'showReportStatus'         ),
            'INVITE_STATUS_VALUE':       new Filter('inviteStatusValue',  'showInviteStatus'         ),
            'MODEL_STATUS':              new Filter('model.status',       'showAbuseReportStatus'    ),
            'STATUS_VALUE':              new Filter('statusValue',        'showLessonStatus'         ),
            'MODEL_SEARCH_TEXT':         new Filter('model.searchText',   'showSearchText'           ),
            'CREATED_BY':                new Filter('createdBy',          'showCreatedBy'            ),
            'REPORTED_BY':               new Filter('reportedBy',         'showReportedBy'           ),
            'ROLE':                      new Filter('role',               'showRoles'                ),
            'REPORT_LESSON':             new Filter('reportLesson',       'showReportLesson'         )
        };




        me.resetFilter = resetFilter;



        /**
         *
         * @param {LergoFilter} filter
         * @param {object} scope model that keeps filter values
         * @param {boolean} changeUrl should url change according to filters
         * @param {object} relevancyOpts object holding relevancies by key
         * @param {function} updateFn function to call on update
         * @param {boolean} override
         */
        me.syncValue = function( filter, scope, changeUrl, relevancyOpts , updateFn, override){


            if (!updateFn) {
                updateFn = function() {
                }; // noop
            }



            if ( filter.isRelevant(relevancyOpts) ){

                var filterName = filter.getFullKeyName( );
                $log.info('loading : ' + filterName);

                var saved = me.getSavedValue(filter);

                if (!!saved) {
                    if (changeUrl) {

                        $location.search(filterName, saved === null ? null : JSON.stringify(saved));
                    }
                }

                // do not override value on scope with something saved. It is probably older..
                if ( !override && !!_.get(scope,filter.key)){
                    return;
                }

                _.set(scope,filter.key,saved === null ? undefined : saved);

                updateFn(saved);
            }

        };

        /**
         *
         * @param {LergoFilter} filter
         * @param {boolean} changeUrl whether to change url or not
         * @param {object} relevancyOpts whether a filter key is relevant or not
         * @returns {Function} the save function
         */
        me.save = function(filter, changeUrl, relevancyOpts ) {
            return function (newValue) {
                if (filter.isRelevant(relevancyOpts)) {
                    if (_.isEmpty(newValue)) {
                        newValue = null;
                    }
                    $log.info(filter + ' has changed. persisting [' + newValue + ']');
                    var filterName = filter.getFullKeyName();
                    if ( localStorageService.get(filterName) !== newValue ) {
                        localStorageService.set(filterName, newValue);
                    }
                    if ( changeUrl && $routeParams[filterName] !== newValue ) {
                        $location.search(filterName, newValue === null ? null : angular.toJson(newValue));
                    }
                }
            };

        };

        me.RESET_TYPES = {
            'LOGO' : {
                'id': 'logo',
                'ignore': [ me.FILTERS.FILTER_LANGUAGE ]
            }
        };


    });
