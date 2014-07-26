'use strict';


/**
 *
 * This service is concerned about role issues regarding the display
 *
 * For example - should I display this button or not.
 *
 * These decisions are made based upon the route of the page and should not involve backend in anyway.
 * If a role decision is made based on data on DB, we will have another service for that.
 *
 *
 * We have to separate the questions:
 *
 *  - can i edit ANY lesson
 *  - can i edit THIS lesson
 *
 * Since this service focuses on display, these questions will be:
 *
 *  - can i see the edit lesson button  for ANY lesson
 *  - can i see the edit lesson button for THIS lesson
 *
 *  So this service tries to answer the ANY category while focusing on display.
 *  It is heavily based on our URL convention and other than mapping between "route" and "capabilities" it has no other
 *  logic.
 *
 *  It <b>does not</b>, for example, redirect to other pages.
 *
 *
 *  Example:
 *
 *  if i am a public user, i am not logged in,
 *
 *   - can i see 'my lessons' ? ---> NO
 *
 *     Indeed, 'my lessons' link starts with '/user', which means you need to be a user to see it.
 *
 *   - can i see 'edit' button on lesson intro page? ---> Depends
 *
 *    Since the intro page is available to all roles ( '/:role/lessons/:lessonId/intro' ) we need to check
 *    if you used '/user/lessons/:lessonId/intro' - you will see the button
 *    if you used '/public/lessons/:lessonId/intro' - you will not see the button
 *
 *    Now - all that is left, is to expose the right link in the correct place.
 *    the '/user' intro link will be displayed from 'my lessons'
 *    the '/public' intro link will be displayed from 'homepage'.
 *
 *
 *
 *
 *
 */
angular.module('lergoApp')
    .service('DisplayRoleService', function DisplayRoleService($routeParams) {

        var currentRole = function(){
            return $routeParams.role;
        };

        // all activities
        var editLesson = 'edit lesson';

        // a map between role and activities.
        // if the activity appears, the role is allowed to do it
        var roles = {
            'user': [
                editLesson
            ],

            'admin': [
                editLesson
            ],

            'public': []

        };

        function role() {
            return roles[currentRole()];
        }

        function can(activity) {
            return role().indexOf(activity) >= 0;
        }

        this.canSeeActionItemsOnLessonIntroPage = function () {
            return can(editLesson);
        };


    });
