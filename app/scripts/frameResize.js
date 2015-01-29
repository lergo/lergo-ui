'use strict';

window.lergoUtilsChangeFrameSize = function(frameElement) {


    var height = 0;
    var width = 0;

    function changeSize(newDimensions) {
        if (!newDimensions) {
            return;
        }
        if (newDimensions.height !== height) {
            height = newDimensions.height;
            frameElement.setAttribute('height', height);
            frameElement.height = height;
        }

        if (newDimensions.width !== width) {
            width = newDimensions.width;
            frameElement.setAttribute('width', width);
            frameElement.width = width;
        }
    }

    // listen to incoming messages
    window.addEventListener('message', function (e) {

        if (!e.data) {
            console.error('unable to find data on message');
            return;
        }

        var message = e.data;

        if (typeof(message) === 'string') { // just to be on the safe side.
            message = JSON.parse(message);
        }

        if (message.name === 'lergo_size_change') {
            changeSize(message.data);
        }
    });


};
