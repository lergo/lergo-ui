'use strict';


/**
 *
 *
 *
 * This service helps you implement a continuous save.
 *
 * You have to do 3 things to use it:
 *
 *
 *   Save an instance of continuous save
 *   pass to it a function to implement on save
 *
 *   var saveLesson = new ContinuousSave({
				'saveFn' : function(value) {
					return LergoClient.lessons.update(value);
				}
			});
 *
 *
 *
 *
 *   bind 'watch' event to onValueChange method. like this:
 *
 *   $scope.$watch('lesson', saveLesson.onValueChange, true);
 *
 *
 *   make sure you model has an _id attribute  - this ID will be used as the key for the local storage
 *
 */
angular.module('lergoApp')
    .factory('ContinuousSave', function (localStorageService, $timeout, $rootScope, $log,$filter) {


        var _preventedFlag = {};

        function impl(opts) {

            /*jshint validthis:true */
            var _me = this;

            var _localVersion; // version we have locally
            var _remoteVersion; // version we got from server

            var _retries = opts.retries || 5;
            var _retryDelay = opts.retryDelay || 1000;
            var _confirmMessage = opts.confirmMessage || $filter('translate')('continousSave.Confirm');

            var _saveFn;  // a function that returns a promise and saves the model.
            var _status = { 'saving': false };

            /**
             *
             * @description
             * makes sure the version we have locally, is the same version we have on the server
             *
             * @returns {boolean} true iff locationVersion exists and equals to remoteVersion
             * @private
             */
            function _versionMatch() {
                return !!_localVersion && !!_remoteVersion && _localVersion.lastUpdate === _remoteVersion.lastUpdate;
            }


            /**
             *
             * We want to prevent users from leaving the page in case there are unsaved changes by alerting the user.
             *
             * We also want to assume there are multiple models being continuously saved in the background.
             * In which case the users will get multiple alerts. We need to prevent this. How?
             *
             *
             * when location change starts, the following happens:
             * - I check if I already registered on the model
             *      - if yes - there is data from old run. clean the model.
             *      - if no - register myself to the model
             * - Check if I need to alert
             *      - if yes - check is someone else already alerted
             *          - if yes - do nothing
             *          - if no - alert, and update model with 'alerted : true' - so everyone will know someone alerted
             *      - if no - do nothing
             *
             * locationChangeStart is the event we are listening because this is the only event to properly support
             * scenarios where reloadOnSearch is off and user navigates in history.
             *
             **/
            var deregister = $rootScope.$on('$locationChangeStart', function (event) {

                // if I have something need saving and it is not saved, we need to prevent page exit
                if (!!_localVersion && !!_localVersion._id) {

                    var uid = _localVersion._id;
                    if ( _preventedFlag.hasOwnProperty(uid)){// data from last run, needs reset
                        _preventedFlag = {};
                        _preventedFlag.alerted = false;
                    }

                    _preventedFlag[uid] = uid;

                    if ( !_status.saved  ){ // do I need to alert
                        if ( !_preventedFlag.alerted ){ // did someone else alert? no? alert and update model
                            _preventedFlag.alerted = true;
                            var answer = confirm(_confirmMessage);
                            if (!answer) {
                                event.preventDefault();
                            }else{
                                deregister();
                            }

                        } // else - if someone alerted, do nothing
                    } // else, i don't need to alert, do nothing..

                }
            });

            // if location has changed. we need to reset the "alert" mechanism
            var deregisterLocationChangeSuccess = $rootScope.$on('$locationChangeSuccess', function(){
                _preventedFlag = {};
                deregisterLocationChangeSuccess();
            });

            function _onValueChange(newValue, oldValue) {
                if ( newValue === oldValue ){
                    return;
                }

                if (!newValue) { // page still not initialized
                    return;
                }

                if (!!oldValue && !!newValue && oldValue.lastUpdate !== newValue.lastUpdate) {
                    return; // ignore changes to 'last update'
                }

                _status.isSaved = false;
                newValue.lastUpdate = new Date().getTime();
                localStorageService.add(newValue._id, newValue);
                _localVersion = newValue;


                $timeout(_save, 0);
            }

            var retries = 0;

            function _updateRemoteVersion(newValue){
                if ( newValue ){
                    $log.debug('updating continuous save', newValue.lastUpdate );
                }
                if ( !!newValue && !!_remoteVersion && newValue.lastUpdate < _remoteVersion.lastUpdate ){
                    $log.error('got old version from sever');
                    return;
                }
                _remoteVersion = newValue;
            }

            function _save() {


                $log.info(_localVersion);

                if (!!_status.saving || _versionMatch()) {
                    return; //already saving
                }

                if ( !!_localVersion && !!_remoteVersion && _localVersion.lastUpdate < _remoteVersion.lastUpdate ){
                    $log.info('local version is outdated');
                    return;
                }

                if (!_saveFn) {
                    throw new Error('save function must be defined. use setSaveFn(fn) to set it');
                }

                _status.saving = true;
                _saveFn(_localVersion).then(function (result) {
                    retries = 0;
                    _updateRemoteVersion(result.data);
                    _status.saved = _versionMatch();
                    _status.saving = false;
                    _status.errorSaving = false;
                    if (!_status.saved) {
                        $timeout(_save, 0);
                    }

                }, function( result ){
                    $log.error('unable to save ', result);
                    _status.errorSaving = true;
                    _status.saving = false;
                    if ( retries > _retries ){
                        return;
                    }else{
                        retries++;
                        $timeout(_save, _retryDelay );
                    }

                });


            }

            _me.versionMatch = _versionMatch;
            _me.save = _save;
            _me.onValueChange = _onValueChange;

            if (!!opts.saveFn) {
                _saveFn = opts.saveFn;
            }

            _me.getStatus = function () {
                return _status;
            };
        }

        // make this available on the outside
        impl.getPreventedFlag = function(){
            return _preventedFlag;
        };

        impl.setPreventedFlag = function( value ){
            _preventedFlag = value;
        };


        return impl;
    });
