'use strict';

angular.module('lergoApp')
    .factory('ContinuousSave', function (localStorageService, $timeout, $rootScope, $log) {

        var _preventedPageExit = [];
        var _preventedFlag;

        function impl(opts) {

            /*jshint validthis:true */
            var _me = this;

            var _localVersion;
            var _remoteVersion;

            var _saveFn;  // a function that returns a promise and saves the model.
            var _status = { 'saving': false };

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
             * We keep "preventedPageExit" variable which will be shared to all instances and it holds
             * the status for each instance if they alerted or not.
             *
             * if map is empty - i can alert since i am first.
             * if i am in map already - this means the map needs a reset since there are left overs from previous run. i can alert
             * if i am not in the map but everybody else did not alert since everything is saved, i can alert.
             *
             * otherwise, i have no reason to alert as my data is saved OR someone else already alerted.
             *
             * assuming everyone saved everything, no one will alert and user can exist page.
             *
             **/


            $rootScope.$on('$locationChangeStart', function (event) {

                // if I have something need saving and it is not saved, we need to prevent page exit
                if (!!_localVersion && !!_localVersion._id) {
                    var uid = _localVersion._id;

                    if (_preventedPageExit.indexOf(_localVersion._id) > 0) {  // i exit. reset list
                        _preventedPageExit = [];
                        _preventedPageExit.push(_localVersion._id);


                        if (!_status.saved) { // if there is unsaved data, we need to prevent
                            _preventedPageExit.push(_preventedFlag); // i prevented, so i put the flag on the list.

                            var answer = window.confirm('You have unsaved changes.Are you sure you want to leave this page?');
                            if (!answer) {
                                event.preventDefault();
                            }
                        }

                    } else if (_preventedPageExit.indexOf(_preventedFlag) > 0) {
                        _preventedPageExit.push(uid);
                    }

                }
            });


            function _onValueChange(newValue, oldValue) {

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
                    _remoteVersion = result.data;
                    _status.saved = _versionMatch();
                    _status.saving = false;

                    if (!_status.saved) {
                        setTimeout(_save, 0);
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


        return impl;
    });
