'use strict';

angular.module('lergoApp')
    .service('RequestProgressMonitor', function RequestProgressMonitor($log) {
        this.newMonitor = function (promise) {


            function Monitor() {

                var monitor = this;
                this.success = false;
                this.error = false;
                this.inProgress = true;

                $log.info(promise.status);
                promise.then(function (/*result*/) {
                    $log.info(promise.status);
                    monitor.success = true;
                    monitor.inProgress = false;
                }, function (/*result*/) {
                    $log.info(promise.status);
                    monitor.error = true;
                    monitor.inProgress = false;
                });
            }

            return new Monitor();

        };
    });
