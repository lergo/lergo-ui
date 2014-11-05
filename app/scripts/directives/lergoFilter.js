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

angular.module('lergoApp').directive('lergoFilter', function($rootScope, LergoClient, TagsService, $timeout, FilterService, $log, localStorageService, $location, $routeParams) {
	return {
		templateUrl : 'views/directives/_lergoFilter.html',
		restrict : 'A',
		scope : {
			'model' : '=',
			'opts' : '=',
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

			$scope.ageFilter = {};

			$scope.subjects = FilterService.subjects;

			$scope.languages = FilterService.languages;

			$scope.status = FilterService.status;

			$scope.reportStatus = FilterService.reportStatus;
			$scope.abuseReportStatus = FilterService.abuseReportStatus;

			$scope.statusValue = null;

			function _isChangeUrl() {
				return scope.noUrlChanges !== true && scope.noUrlChanges !== 'true';
			}

			LergoClient.reports.getStudents().then(function(result) {
				scope.students = result.data;
			});

			LergoClient.users.getUsernames().then(function(result) {
				scope.users = result.data;
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

			$scope.$watch('reportedBy', _updateCreatedBy);

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
					if ((!!scope.opts.showLanguage && !scope.model.language) || !!force) {
						scope.model.language = FilterService.getLanguageByLocale($rootScope.lergoLanguage);
					}
				} catch (e) {
					$log.error('unable to set default language filter', e);
				}
			}
			setDefaultLanguage();

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
			$scope.$watch('inviteStatusValue', _updateReportStatusValue, true);

			function minMaxFilter(propertyName, scopeVariable) {
				return function(newValue, oldValue) {
					$log.info('min max filter changed ', scopeVariable, newValue, oldValue, propertyName);

					if (newValue === oldValue || newValue === null) {
						return;
					}
					if (!!newValue.min || !!newValue.max) {
						$scope.model[propertyName] = {};
					} else {
						delete $scope.model[propertyName];
						$scope[scopeVariable] = null;
					}

					if (!!newValue.min) {
						$scope.model[propertyName].dollar_gte = newValue.min;
					}

					if (!!newValue.max) {
						$scope.model[propertyName].dollar_lte = newValue.max;
					}
					$log.info('min max filter applied', $scope.model[propertyName]);
				};
			}

			$scope.getTagsLike = function(like) {
				return TagsService.getAllAvailableTags(like).then(function(result) {
					return result.data;
				});
			};

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

				_.each([ 'language', 'subject', 'public', 'status', 'age', 'userId', 'views', 'searchText', 'correctPercentage', 'data.finished' ], function(prop) {
					if ($scope.model[prop] === null || $scope.model[prop] === '') {
						delete $scope.model[prop];
					}
				});
			}, true);

			$scope.filterTags = [];
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
			 * the keyName to inflict on the
			 * 
			 * @param keyName -
			 *            the key name in the scope/local storage we want to
			 *            load
			 * @param relevancy -
			 *            property on opts that tells us if we need to load this
			 *            property or not
			 * @param updateFn -
			 *            function used to apply change to the model. used for
			 *            complex values. see explanation above.
			 */
			function load(keyName, relevancy, updateFn) {

				if (!updateFn) {
					updateFn = function() {
					}; // noop
				}

				if (!!scope.opts && !!scope.opts[relevancy]) {
					var args = keyName.split('.');
					var filterName = 'lergoFilter.' + keyName;
					$log.info('loading : ' + filterName);
					var saved = ($routeParams[filterName] && JSON.parse($routeParams[filterName])) || localStorageService.get(filterName);
					if (_.isEmpty(saved)) {
						saved = null;
					}
					var scopeVariable = scope;
					if (!!saved) {
						for ( var i = 0; i < args.length - 1; i++) {
							scopeVariable = scopeVariable[args[i]];
						}
						if (_isChangeUrl()) {
							$location.search(filterName, saved === null ? null : JSON.stringify(saved));
						}
					}

					$log.info('loading filter', filterName, saved, scopeVariable[args[args.length - 1]]);
					if (saved === null) {
						delete scopeVariable[args[args.length - 1]];
					} else {
						scopeVariable[args[args.length - 1]] = saved;
					}

					updateFn(saved);
				}
			}

			// load for switches change and if some field became relevant, load
			// it.
			// we do lazy load since not all fields are relevant for all filter.
			// admin wants to know if lesson is private or public
			// but while looking at reports, public/private flag makes no
			// difference.
			function watchLoad(keyName, relevancy) {
				$scope.$watch('opts.' + relevancy, function(newValue, oldValue) {
					if (newValue !== oldValue) {
						load(keyName, relevancy);
					}
				});
			}

			// save the property only if changed and is relevant.
			function save(keyName, relevancy) {
				$scope.$watch(keyName, function(newValue, oldValue) {

					if (newValue !== oldValue && !!scope.opts[relevancy]) {
						if (_.isEmpty(newValue)) {
							newValue = null;
						}
						$log.info(keyName + ' has changed. persisting [' + newValue + ']');
						var filterName = 'lergoFilter.' + keyName;
						localStorageService.set(filterName, newValue);
						if (_isChangeUrl()) {
							$location.search(filterName, newValue === null ? null : angular.toJson(newValue));
						}
					}
				}, true);
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
			function persist(keyName, relevancy, updateFn) {

				load(keyName, relevancy, updateFn);

				watchLoad(keyName, relevancy);

				save(keyName, relevancy);
			}

			function persistAll() {
				persist('reportStudent', 'showStudents', _updateReportStudent);
				persist('ageFilter', 'showAge', _updateAgeFilter);
				persist('viewsFilter', 'showViews', _updateViewsFilter);
				persist('correctPercentage', 'showCorrectPercentage', _updateCorrectPercentage);
				persist('model.language', 'showLanguage');
				persist('model.subject', 'showSubject');
				persist('filterTags', 'showTags', _updateFilterTags);
				persist('reportStatusValue', 'showReportStatus', _updateReportStatusValue);
				persist('inviteStatusValue', 'showInviteStatus', _updateReportStatusValue);
				persist('model.status', 'showAbuseReportStatus');
				persist('statusValue', 'showLessonStatus', _updateStatusValue);
				persist('model.searchText', 'showSearchText');
				persist('createdBy', 'showCreatedBy', _updateCreatedBy);
				persist('reportedBy', 'showReportedBy', _updateReportedBy);
			}

			persistAll();

			$log.info('filter loaded. calling callback', scope.load);
			scope.$evalAsync(scope.load); // notify you were loaded
		}
	};
});
