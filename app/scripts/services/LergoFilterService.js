'use strict';

/**
 * @ngdoc service
 * @name lergoApp.LergoFilterService
 * @description
 * # LergoFilterService
 * Service in the lergoApp.
 */
angular.module('lergoApp')
    .service('LergoFilterService', function () {

        var me = this;

        me.FILTER_PREFIX='lergoFilter';

        var resetFilter = function( keepKeys ){

        };




        me.RESET_TYPES = {
            'LOGO' : 'logo'
        };

        me.FILTER_KEYS = {
            'REPORT_STUDENT':            'reportStudent',
            'AGE_FILTER':                'ageFilter',
            'VIEWS_FILTER':              'viewsFilter',
            'CORRECT_PERCENTAGE':        'correctPercentage',
            'MODEL_LANGUAGE':            'model.language',
            'MODEL_SUBJECT':             'model.subject',
            'FILTER_TAGS':               'filterTags',
            'REPORT_STATUS_VALUE':       'reportStatusValue',
            'INVITE_STATUS_VALUE':       'inviteStatusValue',
            'MODEL_STATUS':              'model.status',
            'STATUS_VALUE':              'statusValue',
            'MODEL_SEARCHTEXT':          'model.searchText',
            'CREATED_BY':                'createdBy',
            'REPORTED_BY':               'reportedBy',
            'ROLE':                      'role',
            'REPORT_LESSON':             'reportLesson'
        };

        me.resetFilter = function( resetType ){
            if ( resetType === me.RESET_TYPES.LOGO ){
                resetFilter(
                    [
                        me.FILTER_KEYS.MODEL_LANGUAGE
                    ]
                )
            }
        }
    });
