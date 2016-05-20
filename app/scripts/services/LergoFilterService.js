'use strict';

/**
 * @ngdoc servicer
 * @name lergoApp.LergoFilterService
 * @description
 * # LergoFilterService
 * Service in the lergoApp.
 */
angular.module('lergoApp')
    .service('LergoFilterService', function ( $log, $sessionStorage, $location, $routeParams, $timeout, LergoTranslate ) {

        var me = this;

        /**
         *
         * @type {Date}
         * @description keeps track of when the cache was reset last. allows others to watch this value and act accordingly.
         */
        me.lastReset = new Date();

        var resetFilter = function( ignoreKeys ){

            if ( !ignoreKeys ){
                ignoreKeys = [];
            }else if ( ignoreKeys.ignore ){
                ignoreKeys = ignoreKeys.ignore;
            }



            _.each(me.FILTERS, function(filter) {
                if (ignoreKeys.indexOf(filter) < 0) {
                    filter.reset();
                }
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
                saved = angular.fromJson($routeParams[filterName] || $sessionStorage[filterName]);
            }catch(e){}
            if ( typeof(saved) !== 'boolean' && _.isEmpty(saved) ) {
                saved = null;
            }

            if ( typeof(saved) === 'boolean' && !saved){
                saved = null;
            }
            return saved;
        };


        // active if there's one relevant filter with value
        me.isActive = function( resetType, relevancyOpts, userPermissions  ){
            var result = _.find(me.FILTERS, function( f ){
                return resetType.ignore.indexOf(f) < 0 && f.isActive( relevancyOpts, userPermissions  );

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

            this.isActive = function( relevancyOpts ){
                return !!this.isRelevant(relevancyOpts) && me.getSavedValue(this) !== null;
            };

            this.reset = function( ){
                doSave(this, true, null);
            };

            this.toString = function(){
                return this.key;
            };
        }


        // limited filters are active iff saved value is not the 'default limited value'
        var LimitedFilter = function(){
            Filter.apply(this,arguments);

            this.isActive = function( relevancyOpts, userPermissions ){
                var limitedDefaultValue = this.getLimitedDefaultValue( userPermissions );
                return !!this.isRelevant(relevancyOpts) && !_.isEqual(limitedDefaultValue,me.getSavedValue(this));
            };

            this.reset = function(){
                doSave(this, true, this.getLimitedDefaultValue() );
            };
        };




        var LimitedAgeFilter = function(){
            LimitedFilter.apply(this,arguments);

            this.getLimitedDefaultValue = function( permissions ){
                var result = {};
                if ( permissions && permissions.limitations &&  permissions.limitations.manageAge ){

                    if ( permissions.limitations.manageAge.min ){
                        result.min = permissions.limitations.manageAge.min;
                    }
                    if ( permissions.limitations.manageAge.max){
                        result.max = permissions.limitations.manageAge.max;
                    }
                }
                return _.isEmpty(result) ? null : result;
            };

        };

        var LimitedLessonStatusFilter = function(){
            LimitedFilter.apply(this,arguments);
            this.getLimitedDefaultValue = function( permissions ){
                if ( permissions && permissions.limitations && permissions.limitations.editOnlyUnpublishedContent ){
                    return me.LESSON_STATUS.PRIVATE;
                }else{
                    return null;
                }

            };
        };

        var LimitedLanguageFilter = function(){
            LimitedFilter.apply(this,arguments);
            this.getLimitedDefaultValue = function(permissions){
                if ( LergoTranslate.getLanguageObject()) {
                    var siteLanguage = LergoTranslate.getLanguageObject().name;
                    if (permissions && permissions.limitations && permissions.limitations.manageLanguages) {
                        if (_.includes(permissions.limitations.manageLanguages, siteLanguage)) {
                            return siteLanguage;
                        } else {
                            return _.first(permissions.limitations.manageLanguages);
                        }
                    } else {
                        return siteLanguage;
                    }
                }
            };
        };

        var LimitedSubjectFilter = function(){
            LimitedFilter.apply(this,arguments);
            this.getLimitedDefaultValue = function(permissions){
                if ( permissions && permissions.limitations && permissions.limitations.manageSubject && !_.isEmpty(permissions.limitations.manageSubject)){
                    return _.first(permissions.limitations.manageSubject);
                }else{
                    return null;
                }

            };
        };



        var LanguageFilter = function(/*key, relevancy*/){ // the arguments are passed to the Filter constructor
            Filter.apply(this, arguments);

            this.isActive = function( relevancyOpts ){
                return !!this.isRelevant(relevancyOpts) && me.getSavedValue(this) !== LergoTranslate.getLanguageObject().name;
            };

            this.reset = function(){
                doSave( this, true, LergoTranslate.getLanguageObject().name );
            };
        };

        Filter.FILTER_PREFIX = 'lergoFilter';

        Filter.getFullKeyName = function(keyName){
            return Filter.FILTER_PREFIX + '.' + keyName;
        };


        me.FILTERS = {
            'MODEL_SUBJECT':                   new Filter(                    'model.subject',                    'showSubject'              ),
            'HAS_QUESTIONS':                   new Filter(                    'hasQuestions',                     'showHasQuestions'         ),
            'REPORT_STUDENT':                  new Filter(                    'reportStudent',                    'showStudents'             ),
            'AGE_FILTER':                      new Filter(                    'ageFilter',                        'showAge'                  ),
            'VIEWS_FILTER':                    new Filter(                    'viewsFilter',                      'showViews'                ),
            'CORRECT_PERCENTAGE':              new Filter(                    'correctPercentage',                'showCorrectPercentage'    ),
            'FILTER_LANGUAGE':                 new LanguageFilter(            'filterLanguage',                   'showLanguage'             ),
            'FILTER_TAGS':                     new Filter(                    'filterTags',                       'showTags'                 ),
            'REPORT_STATUS_VALUE':             new Filter(                    'reportStatusValue',                'showReportStatus'         ),
            'INVITE_STATUS_VALUE':             new Filter(                    'inviteStatusValue',                'showInviteStatus'         ),
            'MODEL_STATUS':                    new Filter(                    'model.status',                     'showAbuseReportStatus'    ),

            'MODEL_SEARCH_TEXT':               new Filter(                    'model.searchText',                 'showSearchText'           ),
            'CREATED_BY':                      new Filter(                    'createdBy',                        'showCreatedBy'            ),
            'REPORTED_BY':                     new Filter(                    'reportedBy',                       'showReportedBy'           ),
            'ROLE':                            new Filter(                    'role',                             'showRoles'                ),
            'REPORT_LESSON':                   new Filter(                    'reportLesson',                     'showReportLesson'         ),

            'LIMITED_SUBJECT':                 new LimitedSubjectFilter(      'model.subject',                    'showLimitedSubject'       ),
            'LIMITED_LANGUAGE':                new LimitedLanguageFilter(     'filterLanguage',                   'showLimitedLanguage'      ),
            'LIMITED_AGE':                     new LimitedAgeFilter(          'ageFilter',                        'showLimitedAge'           ),
            'LIMITED_LESSON_STATUS_VALUE':     new LimitedLessonStatusFilter( 'limitedLessonStatusValue',         'showLimitedLessonStatus'  )
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
                        $location.search(filterName, saved === null ? null : angular.toJson(saved));
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

        function doSave( filter , changeUrl, newValue ){
            if ( typeof(newValue) !== 'boolean' && _.isEmpty(newValue)) {
                newValue = null;
            }

            if ( typeof(newValue) === 'boolean' && !newValue  ){
                newValue = null;
            }

            $log.info(filter + ' has changed. persisting [' + newValue + ']');
            var filterName = filter.getFullKeyName();
            if ( $sessionStorage[filterName] !== newValue ) {
                $sessionStorage[filterName] = angular.toJson(newValue);
            }
            if ( changeUrl && $routeParams[filterName] !== newValue ) {
                $location.search(filterName, newValue === null ? null : angular.toJson(newValue));
            }
        }

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
                    doSave( filter, changeUrl, newValue );
                }
            };

        };

        me.RESET_TYPES = {
            'LOGO' : {
                'id': 'logo',
                'ignore': [  ]
            }
        };

        /******************************************* limited permissions feature ***************************/

        me.getLimitedLessonStatus = function(permissions){
            var onlyPrivate =  _.get(permissions,'limitations.editOnlyUnpublishedContent', false );
            if ( onlyPrivate ){
                return [me.LESSON_STATUS.PRIVATE];
            } else{
                return me.status;
            }
        };

        me.getLimitedSubjects = function(permissions){
            return _.get(permissions,'limitations.manageSubject', me.subjects);
        };

        me.getLimitedLanguages = function(permissions){
            var limitations = _.get(permissions,'limitations.manageLanguages');
            if ( limitations ) {
                return _.clone(limitations);

            }else{
                return ['all'].concat(me.languages,'other');
            }
        };

        me.getLimitedAge = function(permissions){
            return _.get(permissions,'limitations.manageAge', null);
        };


        /********************************************* constants we keep *********************************/
        me.languages = _.map(LergoTranslate.getSupportedLanguages(), function( l ){
            return l.name;
        });

        me.subjects = [
            'english',
            'math',
            'geometry',
            'science',
            'language',
            'grammar',
            'spelling',
            'literature',
            'biology',
            'chemistry',
            'physics',
            'computers',
            'sustainability',
            'history',
            'geography',
            'art',
            'music',
            'arabic',
            'signlanguage',
            'financialEducation',
            'roadSafety',
            'bible',
            'lergo',
            'other'
        ];

        me.LESSON_STATUS = {
            PRIVATE : 'private',
            PUBLIC : 'public'
        };

        me.status = [ me.LESSON_STATUS.PRIVATE, me.LESSON_STATUS.PUBLIC ];
        me.reportStatus = [ 'complete', 'incomplete' ];
        me.abuseReportStatus=['pending', 'resolved','dismissed'];

    });
