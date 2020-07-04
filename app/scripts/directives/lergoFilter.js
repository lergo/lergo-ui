'use strict';
/* jshint camelcase: false */

/**
 * This is a directive for all aside panel filters.
 *
 * The parent page should pass a filter object. this directive takes care of
 * displaying the right filters and their behavior (typeahead, select box etc..)
 * this directive will also take care of constructing a valid mongo query as
 * much as possible. in some cases the query should be specific to collection
 * and then the backend will have to take care of it. for example 'subject' and
 * 'language' are a valid mongo query, but searchText is not - it is later
 * translated in the backend as '$or' on 'name' and 'description' with regex for
 * case insensitivity (for lessons) and something similar but for property
 * 'question' for collection question.
 *
 *
 * load algorithm
 * ================
 *
 * to read this directive, start from the code at the bottom.
 * we first define 'persistancy' which also loads previously saved content
 *
 *
 *
 * Key Concepts
 * =============
 *
 *  - persistency
 *    see LergoFilterService
 *    we keep the filter to session storage and url
 *    when page loads we read session storage and url and sync the scope
 *  - load function
 *    each filter is loaded with a generic load function
 *  - update filter
 *    some filters require some custom handling to reach the query model (see below)
 *    the update functions mainly serialize and deserialize object to/from query suitable form.
 *    for example user is an object, but the 'update function' translates it to _id which is what we query.
 *  - query model
 *    the output for this filter is a query to mongo.
 *    some flags require special handling in the backend.
 *  - relevancy
 *    not all filter are relevant everywhere.
 *    those that are not relevant will be hidden and ignored in algorithms.
 *
 * Language handling
 * =================
 *
 * Language gets a special treatment. By default it will be the website's language.
 *
 * Special admin feature
 * =====================
 * 
 *  - removeSubjects and removeCreatedBy work differently than the other filters
 *    the same interface is used as for Subjects and CreatedBy, but afater clicking the box(s) 
 *    each chosen subject (createdBy) is added to a list in the backend to be removed from the results
 *    as this list is not made in the front end, and additonal list needs to be made to display to the user
 *    the chosen items to be removed
 *    for createdBy, this was a bit more difficult to insure that the current createdBy would be added to the 
 *    local list after the box is clicked 
 */

angular.module('lergoApp').directive('lergoFilter', function($rootScope, LergoTranslate, LergoClient, TagsService, $timeout, $q, $log, LergoFilterService, localStorageService) {

	return {
		templateUrl : 'views/directives/_lergoFilter.html',
		restrict : 'A',
		scope : {
			'model' : '=',
			'opts' : '=',
            'reportType' : '=?', // for filter report by lesson name
			'change' : '&onChange',
			'load' : '&onLoad',
			'noUrlChanges' : '@noUrlChanges',
            'hideMe': '=hide'
		},
		link : function postLink(scope /*, element, attrs */) {


            var loaded = false;// keep internal track for 'change' events

			scope.$watch('model', function(newValue, oldValue) {
				if (newValue === oldValue || !loaded ) {
					return;
				}
				scope.change();
				scope.isFilterCollapsed = false;
                /*$timeout(function () {
                    scope.isFilterCollapsed = false;
                }, 3000);*/
			}, true);

			var $scope = scope;

			$scope.ageFilter = null; //should be null to properly load from localStorage
            $scope.limitAge = null;

            $scope.subjects = LergoFilterService.subjects;
            
            $scope.adminRatings = ['all'].concat(LergoFilterService.adminRatings);  // need to understand and deal with limited...

            // support for limit subjects
			$scope.limitedSubjects = null;

			$scope.languages = ['all'].concat(LergoFilterService.languages);
            $scope.limitedLanguages = _.clone($scope.languages);



			$scope.reportStatus = LergoFilterService.reportStatus;
			$scope.abuseReportStatus = LergoFilterService.abuseReportStatus;

			$scope.limitedLessonStatusValue = null;

			function _isChangeUrl() {
				return scope.noUrlChanges !== true && scope.noUrlChanges !== 'true';
			}

            LergoClient.isLoggedIn(true).then(function (result) {
                if (result && result.data && result.data.user) {

                    $q.all([
                        LergoClient.reports.getStudents(),
                        LergoClient.lessonsInvitations.getStudents(),
                        LergoClient.reports.getClasses(),
                        LergoClient.lessonsInvitations.getClasses()
                    ])
                        .then(function (results) {
                            scope.students = _.union(results[0].data, results[1].data);
                            scope.classes = _.union(results[2].data, results[3].data);
                        });
                }
                return result;
            });

            // get all users for admin lesson filter
			LergoClient.users.getUsernames().then(function(result) {
				scope.allUsers = result.data;
            });
            
            // getting users out of public lessons
            
            var queryObjUnlimited = { filter: {'public': {$exists: 1}}, projection: { 'userId': 1, _id: 0 } , limit: 0 };
            
            LergoClient.lessons.getPublicLessons(queryObjUnlimited).then(function(result) {
                var b = {};
                var keyMap  = { _id: '_id', username: 'username'};
                var finalArray = [];
                function flattenObject(item) {
                    finalArray.push(item.user);
                }

                var allPublicUsers = _.map(result.data.data, function (o) {
                    return _.pick(o, ['user._id', 'user.username']);
                });
                var uniquePublicUsers = _.uniqBy(allPublicUsers, 'user._id');
                uniquePublicUsers.forEach(flattenObject);
                 
                b = finalArray.map(function(obj) {
                        return _.mapKeys(obj, function(value, key) {
                            return keyMap[key];
                        });
                    });
                $scope.users = b;
                $log.info('finding number of users with public lessons');
            });

            var userPermissions = null;

            $q.all([LergoClient.isLoggedIn(true), LergoClient.users.getUserPermissions()]).then(function( result ){


                var userResult = result[0].data;
                var permissionsResult = result[1];
                userPermissions = permissionsResult;

                $scope.limitedSubjects = LergoFilterService.getLimitedSubjects( permissionsResult );

                enforceSubjectLimits();

                // lesson status is always limited..
                $scope.limitedLessonStatus = LergoFilterService.getLimitedLessonStatus( permissionsResult );

                enforceLessonStatusLimits(); // empty value is invalid in case of limited editor.


                $scope.limitedLanguages = LergoFilterService.getLimitedLanguages( permissionsResult );

                enforceLanguageLimits();



                $scope.limitAge = LergoFilterService.getLimitedAge( permissionsResult );
                _updateAgeFilter($scope.ageFilter, $scope.ageFilter );


                if ( ( userResult && userResult.user && userResult.user.isAdmin ) || ( permissionsResult && permissionsResult.roles ) ) {
                    LergoClient.roles.list({projection: {'_id': 1, 'name': 1}}).then(function (result) {
                        scope.roles = result.data.data;
                    });
                }


                /// this is the only async operation we are doing when filter is loading.. so for now putting the 'load' trigger here would suffice.
                $timeout(scope.load,1); // notify you were loaded
                $timeout(function setLoaded(){ // function name needed for tests
                    loaded = true;
                },1);

            });
            $scope.ninCreatedBy = [];
			function _updateCreatedBy(newValue, oldValue) {
                $scope.updateCreatedByNewValue = newValue; // save the last value in storage when removeCreatedBy is clicked
                $scope.updateCreatedByOldValue = oldValue;
				if (newValue !== oldValue) {
					if (!!newValue && newValue.hasOwnProperty('_id')) {
                        $scope.model.userId = $scope.createdBy._id;
                        if ($scope.removeCreatedBy) {
                            $scope.ninCreatedBy = _.union([$scope.createdBy.username], $scope.ninCreatedBy);
                            localStorageService.set('storeNinCreatedBy', _.union($scope.ninCreatedBy,localStorageService.get('storeNinCreatedBy')));
                            $scope.trigger.storedCreatedByNin = localStorageService.get('storeNinCreatedBy');
                        }
					} else {
                        delete $scope.model.userId;
					}
				}
			}
            $scope.$watch('createdBy', _updateCreatedBy, true);

            // removeCreatedBy: for Admin use
            function _updateRemoveCreatedBy(newValue, oldValue){
                var modelKey = 'removeCreatedBy';
                if ( newValue !== oldValue ){
                    if ( newValue ){
                        $scope.model[modelKey] = { dollar_exists : true };
                        _updateCreatedBy($scope.updateCreatedByNewValue,  $scope.updateCreatedByOldValue);
                    }else{
                        delete $scope.model[modelKey];
                        $scope.ninCreatedBy = [];
                        $scope.trigger.storedCreatedByNin = [];
                        localStorageService.set('storeNinCreatedBy', null);
                    }
                }
            }
            $scope.$watch('removeCreatedBy', _updateRemoveCreatedBy);

            // persist the removeCreatedBy list after returning to page
            $scope.$watch('trigger.storedCreatedByNin', function(newValue) {
                if (!newValue ) {
                    $scope.trigger.storedCreatedByNin = localStorageService.get('storeNinCreatedBy');
                }
            });

            // createdByAll access to all users for admin filter
            function _updateCreatedByAll(newValue, oldValue) {
				if (newValue !== oldValue) {
					if (!!newValue && newValue.hasOwnProperty('_id')) {
						$scope.model.userId = $scope.createdByAll._id;
					} else {
						delete $scope.model.userId;
					}
				}
			}
            $scope.$watch('createdByAll', _updateCreatedByAll, true);

            function _updateLanguage(newValue, oldValue){
                if ( newValue !== oldValue  || !$scope.model  || scope.model.language !== newValue  ){
                    if ( !!newValue){
                        $log.debug('updating language to', newValue);
                        if ( newValue === 'all' ){
                            delete $scope.model.language;
                      /*   }else if ( newValue === 'other'){
                            $scope.model.language = { 'dollar_nin' : _.clone( LergoFilterService.languages )}; */
                        }else{
                            $scope.model.language = newValue;
                        }
                    }
                }

                enforceLanguageLimits();

            }
            $scope.$watch('filterLanguage', _updateLanguage);

			function _updateReportedBy(newValue, oldValue) {
				if (newValue !== oldValue) {
					if (!!newValue && newValue.hasOwnProperty('_id')) {
						$scope.model.reporterId = $scope.reportedBy._id;
					} else {
						delete $scope.model.reporterId;
					}
				}
			}
            $scope.$watch('reportedBy', _updateReportedBy);

            function _updateRole(newValue, oldValue) {
                if (newValue !== oldValue) {
                    if (!!newValue && newValue.hasOwnProperty('_id')) {
                        $scope.model.roles = $scope.role._id;
                    } else {
                        delete $scope.model.roles;
                    }
                }
            }
            $scope.$watch('role', _updateRole);

            function _updateHasQuestions(newValue, oldValue){
                var modelKey = 'steps.quizItems.1';
                if ( newValue !== oldValue ){
                    if ( newValue ){
                        $scope.model[modelKey] = { dollar_exists : true };
                    }else{
                        delete $scope.model[modelKey];
                    }
                }
            }
            $scope.$watch('hasQuestions', _updateHasQuestions);

            // isCopyOf: for Admin use
            function _updateIsCopyOf(newValue, oldValue){
                var modelKey = 'copyOf';
                if ( newValue !== oldValue ){
                    if ( newValue ){
                        $scope.model[modelKey] = { dollar_exists : false };
                    }else{
                        delete $scope.model[modelKey];
                    }
                }
            }
            $scope.$watch('isCopyOf', _updateIsCopyOf);

            // removeSubject: for Admin use
            function _updateRemoveSubject(newValue, oldValue){
                var modelKey = 'removeSubject';
                if ( newValue !== oldValue ){
                    if ( newValue ){
                        $scope.model[modelKey] = { dollar_exists : false };
                    }else{
                        delete $scope.model[modelKey];
                        $scope.ninSubject = [];
                       /*  localStorageService.remove($scope.ninSubject); */
                    }
                }
            }
            $scope.$watch('removeSubject', _updateRemoveSubject);


            // persist the removeSubject list after returning to page
            $scope.$watch('trigger.storedSubjectNin', function(newValue) {
                if (!newValue ) {
                    $scope.trigger.storedSubjectNin = localStorageService.get('storeNinSubject');
                }
            });

            // hasAdminComment: for Admin use
            function _updateHasAdminComment(newValue, oldValue){
                var modelKey = 'adminComment';
                if ( newValue !== oldValue ){
                    if ( newValue ){
                        $scope.model[modelKey] = { dollar_exists : false };
                    }else{
                        delete $scope.model[modelKey];
                    }
                }
            }
            $scope.$watch('hasAdminComment', _updateHasAdminComment);

            function _updateReportLesson(newValue, oldValue){
                $log.info('report lesson was updated!!');
                if ( newValue !== oldValue ){
                    if ( !!newValue && newValue.hasOwnProperty('_id')) {

                        $scope.model['data.lessonId'] = $scope.reportLesson._id;
                        $log.info('lessonId was changed');
                    }
                    else {
                        $scope.model['data.lessonId'] = undefined;
                    }
                }


            }
            $scope.$watch('reportLesson', _updateReportLesson, true);

			function _updateReportStudent() {
				if (!!$scope.reportStudent && $scope.reportStudent !== '' && $scope.opts.showStudents) {
					scope.model['data.invitee.name'] = $scope.reportStudent;
				} else {
					delete scope.model['data.invitee.name'];
				}
			}

			$scope.$watch('reportStudent', function(newValue, oldValue) {
				if (newValue !== oldValue) {
                    _updateReportStudent();
				}
			});

			$scope.$watch('opts.showStudents', function(newValue, oldValue) {
				if (oldValue !== newValue) {
					_updateReportStudent();
				}
			});


            function _updateReportClass() {
                if (!!$scope.reportClass && $scope.reportClass !== '' && $scope.opts.showClass ) {
                    scope.model['data.invitee.class'] = $scope.reportClass;
                } else {
                    delete scope.model['data.invitee.class'];
                }
            }

            $scope.$watch('reportClass', function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    $timeout(function () {
                        $log.info('class changed');
                        _updateReportClass();
                    }, 3000);
                }
            });

            $scope.$watch('opts.showClass', function(newValue, oldValue) {
                if (oldValue !== newValue) {
                    _updateReportClass();
                }
            });



			var _updateStatusValue = function(newValue, oldValue) {
				if (oldValue !== newValue) {
					$log.info('statusValue changed');

					if (newValue === 'private') {
						$scope.model.public = {
							'dollar_exists' : false
						};

					} else if (newValue === 'public') {
						$scope.model.public = {
							'dollar_exists' : true
						};
					} else {
						delete $scope.model.public;
					}
				}
			};
			$scope.$watch('limitedLessonStatusValue', _updateStatusValue);

            //function languageObjToFilterLanguage( langObj ){
            //    return { id: langObj.name };
            //}

			function setDefaultLanguage(force) {
				try {
					if ((!!scope.opts.showLanguage && !scope.filterLanguage) || !!force) {
                        if (LergoTranslate.getLanguageObject()) {
                            scope.filterLanguage = LergoTranslate.getLanguageObject().name;
                        } else {
                            scope.filterLanguage = 'hebrew';
                            $log.info('getLanguageObject was undefined');
                        }
						//scope.filterLanguage = languageObjToFilterLanguage(LergoTranslate.getLanguageObject());
                        _updateLanguage(scope.filterLanguage);
					}
				} catch (e) {
					$log.error('unable to set default language filter', e);
				}
			}


			$scope.$watch(function() {
				return LergoTranslate.getLanguage();
			}, function(newValue, oldValue) {
				$log.info('should change language in filter?');
				if (!!newValue && !!oldValue && newValue !== oldValue) {
					setDefaultLanguage(true);
				}
			});

			$scope.reportStatusValue = null;
			var _updateReportStatusValue = function(newValue, oldValue) {
				if (oldValue !== newValue) {
					if (newValue === 'complete') {
						$scope.model.finished = {
							'dollar_exists' : true
						};
					} else if (newValue === 'incomplete') {
						// todo - there is ambiguity in this field.. as
						// incomplete could be interpreted as 'not exists', null
						// or false..
						// todo - i checked with production, and currently
						// either it exists with value `true` or it doesn't..
						// but we have to get rid of the multiple meanings.
						$scope.model.finished = {
							'dollar_exists' : false
						};
					} else {
						delete $scope.model.finished;
					}
				}
			};
			$scope.$watch('reportStatusValue', _updateReportStatusValue, true);

			// we want to save seperate filter for status for invite and report
			$scope.inviteStatusValue = null;
            var _updateInviteStatusValue = _updateReportStatusValue; // does the same exact thing

			$scope.$watch('inviteStatusValue', _updateReportStatusValue, true);

            /**
             *
             * @param propertyName
             * @param scopeVariabl
             * @returns {Function}
             */
			function minMaxFilter(propertyName, scopeVariable ) {
				return function(newValue) {
					$log.info('min max filter changed ');


                    var model = $scope.model[propertyName];
					if (!!newValue && ( !!newValue.min || !!newValue.max ) ) {
                        if ( !model ){
                            $scope.model[propertyName] = {};
                            model = $scope.model[propertyName];
                        }
                        if (!!newValue.min && model.dollar_gte !== newValue.min ) {
                            model.dollar_gte = newValue.min;
                        } else if ( !newValue.min ) {
                            delete model.dollar_gte;
                        }

                        // add support for limit values for min/max
                        // after we decided what the new value should be, if that value does not fit our limit, we normalize it.


                        if (!!newValue.max && model.dollar_lte !== newValue.max ) {
                            model.dollar_lte = newValue.max;
                        }else if ( !newValue.max ) {
                            delete model.dollar_lte;
                        }


					} else {
						delete $scope.model[propertyName];
						$scope[scopeVariable] = null;
					}



					$log.info('min max filter applied');
				};
			}


            /// todo: consider turning this to a directive instead.
            function limitMinMaxFilter( scopeVariable, limitScopeVariable, relevancyFlag, filterHandler ){
                return function(newValue,oldValue){

                    var changed = false;
                    if ( $scope.opts && $scope.opts[relevancyFlag] ) { // only apply limits if relevant.
                        var limitValue = typeof(limitScopeVariable) === 'string' ? $scope[limitScopeVariable] : null;

                        if ( !$scope[scopeVariable] ){
                            $scope[scopeVariable] = {};
                        }
                        var scopeVar = $scope[scopeVariable];


                        if (limitValue && limitValue.min  && (  !newValue || !newValue.min || newValue.min < limitValue.min )) {
                            scopeVar.min = limitValue.min;
                            changed = true;
                        }

                        if (limitValue && limitValue.max && ( !newValue || !newValue.max || newValue.max > limitValue.max )) {
                            scopeVar.max = limitValue.max;
                            changed = true;
                        }
                    }

                    if ( !changed ){
                        filterHandler(newValue, oldValue);
                    }
                };
            }


			var _updateAgeFilter = limitMinMaxFilter( 'ageFilter', 'limitAge', 'showLimitedAge', minMaxFilter('age', 'ageFilter'));
			$scope.$watch('ageFilter', _updateAgeFilter, true);
			var _updateViewsFilter = minMaxFilter('views', 'viewsFilter');
			$scope.$watch('viewsFilter', _updateViewsFilter, true);
			var _updateCorrectPercentage = minMaxFilter('correctPercentage', 'correctPercentage');
			$scope.$watch('correctPercentage', _updateCorrectPercentage, true);

            function enforceLanguageLimits(){
                var oldValue = $scope.filterLanguage;
                if ($scope.opts && $scope.opts.showLimitedLanguage) {
                    if ( !$scope.filterLanguage || ( $scope.filterLanguage && $scope.limitedLanguages && $scope.limitedLanguages.indexOf($scope.filterLanguage) < 0)) {
                        $scope.filterLanguage = _.first($scope.limitedLanguages);

                        /**
                         * GUY : implement $watch here...
                         * this is very important.. because the filter mechanism works on $watch.
                         * once the language changes on 'model', the controller will trigger a new backend query.
                         *
                         * The 'enforce' mechanism does not apply on the model directly.
                         * It relies on $watch to call _updateLanguage, which will also happen in next tick.
                         *
                         * So we have a race condition between the query and the limitation. and that causes bugs..
                         *
                         * To resolve the race, we execute our own $watch implementation within the same tick..
                         *
                         */
                        if ( $scope.filterLanguage !== oldValue ){
                            _updateLanguage( $scope.filterLanguage, oldValue );
                        }
                    }
                }
            }

            function enforceLessonStatusLimits(){
                // if limited, then can only mean private.. naiive implementation will do for now.
                if ( $scope.opts && $scope.opts.showLimitedSubject && userPermissions && userPermissions.limitations.editOnlyUnpublishedContent ){
                    $scope.limitedLessonStatusValue = LergoFilterService.LESSON_STATUS.PRIVATE;
                }
            }

            function enforceSubjectLimits(){
                //normalize restricted values
                if ($scope.opts && $scope.opts.showLimitedSubject && userPermissions && _.size(userPermissions.limitations.manageSubject)>0 ) {
                    if (!$scope.model.subject || ( $scope.model.subject && $scope.limitedSubjects && $scope.limitedSubjects.indexOf($scope.model.subject) < 0 ) ){
                        $scope.model.subject = _.first($scope.limitedSubjects);
                    }
                }
            }

			// handle 'all' values or null values - simply remove them from the
            // model.
            // dealing with the two special cases of removeSubject and removeCreatedBy where the lists
            // are not part of the model
            $scope.trigger = {};
            $scope.ninSubject = [];
			$scope.$watch('model', function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    _.each(['subject', 'removeSubject', 'adminRating', 'public', 'status', 'age', 'userId', 'views', 'searchText', 'correctPercentage', 'finished', 'data.lessonId'], function (prop) {
                        if ($scope.model[prop] === undefined || $scope.model[prop] === null || $scope.model[prop] === '' || $scope.model[prop] === 'all') {
                            delete $scope.model[prop];
                            if (prop === 'removeSubject') {
                                localStorageService.set('storeNinSubject', null );
                            }

                        } else {
                            if(prop === 'subject' && $scope.removeSubject) {
                                $scope.ninSubject = _.union([$scope.model[prop]], $scope.ninSubject);
                                localStorageService.set('storeNinSubject', _.union($scope.ninSubject,localStorageService.get('storeNinSubject')));
                                $scope.trigger.storedSubjectNin = localStorageService.get('storeNinSubject');
                            }
                        }
                    });
                }

                enforceSubjectLimits();

                enforceLanguageLimits();

                enforceLessonStatusLimits();


			}, true);

			$scope.filterTags = null;
			var _updateFilterTags = function() {
				$log.info('filterTags changed');
				if (!$scope.filterTags || $scope.filterTags.length === 0) {
					delete $scope.model['tags.label'];
				} else {
					$scope.model['tags.label'] = {
						'dollar_in' : _.map($scope.filterTags, 'label')
					};
				}

			};
			$scope.$watch('filterTags', _updateFilterTags, true);






			// load the filter from local storage
			// we do this before we define how to persist so we want get an
			// event to persist every property we load
			// we do this after we defined the entire scope - DO NOT ADD MORE
			// LOGIC UNDER LOCAL STORAGE HANDLING
			// as every property that we will load should trigger the correct
			// watcher to inflict change on the scope

			/**
			 * the keyName to inflict on the  local storage
			 *
			 * @param {LergoFilter} filter
             * @param {boolean} override
			 */
			function load(filter, override) {
			    LergoFilterService.syncValue( filter, scope, _isChangeUrl(), scope.opts, UPDATE_FUNCTIONS[filter.key], override );
			}

			// load for switches change and if some field became relevant, load
			// it.
			// we do lazy load since not all fields are relevant for all filter.
			// admin wants to know if lesson is private or public
			// but while looking at reports, public/private flag makes no
			// difference.
			function watchLoad(filter) {
				$scope.$watch('opts.' + filter.relevancy, function(newValue, oldValue) {
					if (newValue !== oldValue) {
						load(filter);
					}
				});
			}

			// save the property only if changed and is relevant.
			function save(filter) {

				$scope.$watch(filter.key,  LergoFilterService.save(filter, _isChangeUrl(), $scope.opts), true);
			}

			// how to persist the filter.
			// NOTE: sometimes we convert values. for example lesson status
			// 'public' or 'private'
			// is converted to filter.public = { '$exists' : 1 } or { '$exists'
			// : 0 }
			// same for a lot of other properties : filterTags, createdBy,
			// ageFilter etc..
			// WE WANT TO PERSIST ONLY THE PROPERTIES WE REFERENCE IN THE
			// TEMPLATE (HTML) AS NG-MODEL
			// as those are the properties that decide the state of the filter.
			//
			// updateFn - used for loading.
			// some fields are complex - and do not affect the model directly..
			// we are watching these values with $watch and only then we apply
			// them to the model
			// when we load we want to invoke those callbacks immediately and
			// not wait for another $digest cycle.

			// basically this directive works on $watch. It triggers an
			// 'onChange'
			// this is all true but the first initialization.
			// when we load/initialize, we would like to set everything up in
			// the same $digest cycle
			// use case: when we load lessons, we want the first time to include
			// the loaded filter.
			// otherwise we will need to handle multiple http queries overriding
			// one another..
			function persist(filter) {
				load(filter);

				watchLoad(filter);

				save(filter);

            }

            var UPDATE_FUNCTIONS = {};
            UPDATE_FUNCTIONS[LergoFilterService.FILTERS.REPORT_STUDENT] =  _updateReportStudent ;
            UPDATE_FUNCTIONS[LergoFilterService.FILTERS.REPORT_CLASS] =  _updateReportClass ;
            UPDATE_FUNCTIONS[LergoFilterService.FILTERS.AGE_FILTER] =  _updateAgeFilter ;
            UPDATE_FUNCTIONS[LergoFilterService.FILTERS.VIEWS_FILTER] =  _updateViewsFilter ;
            UPDATE_FUNCTIONS[LergoFilterService.FILTERS.CORRECT_PERCENTAGE] =  _updateCorrectPercentage ;
            UPDATE_FUNCTIONS[LergoFilterService.FILTERS.FILTER_TAGS] =  _updateFilterTags ;
            UPDATE_FUNCTIONS[LergoFilterService.FILTERS.REPORT_STATUS_VALUE] =  _updateReportStatusValue ;
            UPDATE_FUNCTIONS[LergoFilterService.FILTERS.INVITE_STATUS_VALUE] =  _updateInviteStatusValue ;
            UPDATE_FUNCTIONS[LergoFilterService.FILTERS.LIMITED_LESSON_STATUS_VALUE] =  _updateStatusValue ;
            UPDATE_FUNCTIONS[LergoFilterService.FILTERS.CREATED_BY] =  _updateCreatedBy ;
            UPDATE_FUNCTIONS[LergoFilterService.FILTERS.REPORTED_BY] = _updateReportedBy  ;
            UPDATE_FUNCTIONS[LergoFilterService.FILTERS.ROLE] =  _updateRole ;
            UPDATE_FUNCTIONS[LergoFilterService.FILTERS.REPORT_LESSON] =  _updateReportLesson ;
            UPDATE_FUNCTIONS[LergoFilterService.FILTERS.HAS_QUESTIONS] =  _updateHasQuestions ;
            UPDATE_FUNCTIONS[LergoFilterService.FILTERS.IS_COPY_OF] =  _updateIsCopyOf ;
            UPDATE_FUNCTIONS[LergoFilterService.FILTERS.REMOVE_CREATED_BY] =  _updateRemoveCreatedBy ;
            UPDATE_FUNCTIONS[LergoFilterService.FILTERS.REMOVE_SUBJECT] =  _updateRemoveSubject ;
            UPDATE_FUNCTIONS[LergoFilterService.FILTERS.HAS_ADMIN_COMMENT] =  _updateHasAdminComment ;

            function reload( newValue, oldValue ){
                if ( !!newValue && !!oldValue && newValue !== oldValue ) {
                    _.each(LergoFilterService.FILTERS, function (f) {
                        load(f, true);
                    });
                }
            }


            // persist all
            _.each(LergoFilterService.FILTERS, persist);

            setDefaultLanguage(); // have to be below "persistAll" or otherwise default value will apply regardless

			$log.info('filter loaded. calling callback');

            // load triggers now moved to 'permissions' callback.. only after we apply limits is the filter really loaded.

            scope.$watch(function(){ // if filter data was reset, we need to reload this directive
                return LergoFilterService.getLastReset();
            }, reload);
		}
	};
});
