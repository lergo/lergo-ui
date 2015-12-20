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
 *
 * persistency ===========
 *
 * persistency is done by marshalling and unmarshalling the scope using
 * {@link FilterService#marshall} and {@link FilterService#unmarhsall}
 *
 *
 *
 *
 */

angular.module('lergoApp').directive('lergoFilter', function($rootScope, LergoClient, TagsService, $timeout, $q, FilterService, $log, LergoFilterService) {

	return {
		templateUrl : 'views/directives/_lergoFilter.html',
		restrict : 'A',
		scope : {
			'model' : '=',
			'opts' : '=',
            'isActive' : '=?',
			'change' : '&onChange',
			'load' : '&onLoad',
			'noUrlChanges' : '@noUrlChanges'
		},
		link : function postLink(scope/* , element, attrs */) {

			scope.$watch('model', function(newValue, oldValue) {
				if (newValue === oldValue) {
					return;
				}
				scope.change();
			}, true);

			var $scope = scope;

			$scope.ageFilter = null; //should be null to properly load from localStorage

			$scope.subjects = FilterService.subjects;

			$scope.languages = [{'id' : 'all'}].concat(FilterService.languages,[{ 'id' : 'other'}]);

			$scope.status = FilterService.status;

			$scope.reportStatus = FilterService.reportStatus;
			$scope.abuseReportStatus = FilterService.abuseReportStatus;

			$scope.statusValue = null;

			function _isChangeUrl() {
				return scope.noUrlChanges !== true && scope.noUrlChanges !== 'true';
			}

            LergoClient.isLoggedIn(true).then(function( result ){
                if ( result.user ) {
                    LergoClient.reports.getStudents().then(function (result) {
                        scope.students = result.data;
                    });
                }
                return result;
            });


			LergoClient.users.getUsernames().then(function(result) {
				scope.users = result.data;
			});


            $q.all([LergoClient.isLoggedIn(true), LergoClient.users.getUserPermissions()]).then(function( result ){

                var userResult = result[0];
                var permissionsResult = result[1];
                if ( ( userResult && userResult.user && userResult.user.isAdmin ) || ( permissionsResult && permissionsResult.roles ) ) {
                    LergoClient.roles.list({projection: {'_id': 1, 'name': 1}}).then(function (result) {
                        scope.roles = result.data.data;
                    });
                }
            });




			function _updateCreatedBy(newValue, oldValue) {
				if (newValue !== oldValue) {
					if (!!newValue && newValue.hasOwnProperty('_id')) {
						$scope.model.userId = $scope.createdBy._id;
					} else {
						delete $scope.model.userId;
					}
				}
			}
            $scope.$watch('createdBy', _updateCreatedBy, true);

            function _updateLanguage(newValue, oldValue){
                if ( newValue !== oldValue  || !$scope.model  || scope.model.language !== newValue  ){
                    if ( !!newValue){
                        if ( newValue === 'all' ){
                            delete $scope.model.language;
                        }else if ( newValue === 'other'){
                            $scope.model.language = { 'dollar_nin' : _.map( FilterService.languages, 'id')};
                        }else{
                            $scope.model.language = newValue;
                        }
                    }
                }
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

            function _updateReportLesson(newValue, oldValue){
                $log.info('report lesson was updated!!');
                if ( newValue !== oldValue ){
                    if ( !!newValue && newValue.hasOwnProperty('_id')) {

                        $scope.model['data.lessonId'] = $scope.reportLesson._id;
                        $log.info('lessonId was changed',$scope.model);
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
					$log.info('student changed', arguments);
					_updateReportStudent();
				}
			});

			$scope.$watch('opts.showStudents', function(newValue, oldValue) {
				if (oldValue !== newValue) {
					_updateReportStudent();
				}
			});



			var _updateStatusValue = function(newValue, oldValue) {
				if (oldValue !== newValue) {
					$log.info('statusValue changed', newValue, oldValue);

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
			$scope.$watch('statusValue', _updateStatusValue);

			function setDefaultLanguage(force) {
				try {
					if ((!!scope.opts.showLanguage && !scope.filterLanguage) || !!force) {
						scope.filterLanguage = FilterService.getLanguageByLocale($rootScope.lergoLanguage);
                        _updateLanguage(scope.filterLanguage);
					}
				} catch (e) {
					$log.error('unable to set default language filter', e);
				}
			}


			$scope.$watch(function() {
				return $rootScope.lergoLanguage;
			}, function(newValue, oldValue) {
				$log.info('should change language in filter?', newValue, oldValue);
				if (!!newValue && !!oldValue && newValue !== oldValue) {
					setDefaultLanguage(true);
				}
			});

			$scope.reportStatusValue = null;
			var _updateReportStatusValue = function(newValue, oldValue) {
				if (oldValue !== newValue) {
					if (newValue === 'complete') {
						$scope.model['data.finished'] = {
							'dollar_exists' : true
						};
					} else if (newValue === 'incomplete') {
						// todo - there is ambiguity in this field.. as
						// incomplete could be interpreted as 'not exists', null
						// or false..
						// todo - i checked with production, and currently
						// either it exists with value `true` or it doesn't..
						// but we have to get rid of the multiple meanings.
						$scope.model['data.finished'] = {
							'dollar_exists' : false
						};
					} else {
						delete $scope.model['data.finished'];
					}
				}
			};
			$scope.$watch('reportStatusValue', _updateReportStatusValue, true);

			// we want to save seperate filter for status for invite and report
			$scope.inviteStatusValue = null;
            var _updateInviteStatusValue = _updateReportStatusValue; // does the same exact thing

			$scope.$watch('inviteStatusValue', _updateReportStatusValue, true);

			function minMaxFilter(propertyName, scopeVariable) {
				return function(newValue, oldValue) {
					$log.info('min max filter changed ', scopeVariable, newValue, oldValue, propertyName);

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

                        if (!!newValue.max && model.dollar_lte !== newValue.max ) {
                            model.dollar_lte = newValue.max;
                        }else if ( !newValue.max ) {
                            delete model.dollar_lte;
                        }
					} else {
						delete $scope.model[propertyName];
						$scope[scopeVariable] = null;
					}


					$log.info('min max filter applied', $scope.model[propertyName]);
				};
			}



			var _updateAgeFilter = minMaxFilter('age', 'ageFilter');
			$scope.$watch('ageFilter', _updateAgeFilter, true);
			var _updateViewsFilter = minMaxFilter('views', 'viewsFilter');
			$scope.$watch('viewsFilter', _updateViewsFilter, true);
			var _updateCorrectPercentage = minMaxFilter('correctPercentage', 'correctPercentage');
			$scope.$watch('correctPercentage', _updateCorrectPercentage, true);

			// handle 'all' values or null values - simply remove them from the
			// model.
			$scope.$watch('model', function(newValue, oldValue) {

				if (newValue === oldValue) {
					return;
				}

				_.each([ 'subject', 'public', 'status', 'age', 'userId', 'views', 'searchText', 'correctPercentage', 'data.finished' ], function(prop) {
					if ($scope.model[prop] === null || $scope.model[prop] === '') {
						delete $scope.model[prop];
					}
				});
			}, true);

			$scope.filterTags = null;
			var _updateFilterTags = function() {
				$log.info('filterTags changed', $scope.filterTags);
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
            UPDATE_FUNCTIONS[LergoFilterService.FILTERS.AGE_FILTER] =  _updateAgeFilter ;
            UPDATE_FUNCTIONS[LergoFilterService.FILTERS.VIEWS_FILTER] =  _updateViewsFilter ;
            UPDATE_FUNCTIONS[LergoFilterService.FILTERS.CORRECT_PERCENTAGE] =  _updateCorrectPercentage ;
            UPDATE_FUNCTIONS[LergoFilterService.FILTERS.FILTER_TAGS] =  _updateFilterTags ;
            UPDATE_FUNCTIONS[LergoFilterService.FILTERS.REPORT_STATUS_VALUE] =  _updateReportStatusValue ;
            UPDATE_FUNCTIONS[LergoFilterService.FILTERS.INVITE_STATUS_VALUE] =  _updateInviteStatusValue ;
            UPDATE_FUNCTIONS[LergoFilterService.FILTERS.STATUS_VALUE] =  _updateStatusValue ; // lesson status
            UPDATE_FUNCTIONS[LergoFilterService.FILTERS.CREATED_BY] =  _updateCreatedBy ;
            UPDATE_FUNCTIONS[LergoFilterService.FILTERS.REPORTED_BY] = _updateReportedBy  ;
            UPDATE_FUNCTIONS[LergoFilterService.FILTERS.ROLE] =  _updateRole ;
            UPDATE_FUNCTIONS[LergoFilterService.FILTERS.REPORT_LESSON] =  _updateReportLesson ;

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

			$log.info('filter loaded. calling callback', scope.load);
			scope.$evalAsync(scope.load); // notify you were loaded

            scope.$watch(function(){ // if filter data was reset, we need to reload this directive
                return LergoFilterService.getLastReset();
            }, reload);

            scope.$watch(function(){
                return LergoFilterService.isActive(LergoFilterService.RESET_TYPES.LOGO,scope.opts);
            }, function(newValue){
                $log.info('isActive changed : ' +  newValue );
                scope.isActive = !!newValue;
            });
		}
	};
});
