'use strict';

var app = angular.module('japp', [
    'ui-notification',
    'angularSpinner',
    'pathgather.popeye'
])

    .config(function (NotificationProvider) {
        NotificationProvider.setOptions({
            delay: 10000,
            startTop: 20,
            startRight: 10,
            verticalSpacing: 20,
            horizontalSpacing: 20,
            positionX: 'left',
            positionY: 'bottom',
            maxCount: 10
        });
    })

    .constant("AppConfig", {
        ApiUrl: "",
        itemsPerPage: 5
    })

    .filter('show_html', ['$sce', function ($sce) {
        return function (obj) {
            obj = obj ? obj.toString() : "";
            return $sce.trustAsHtml(obj);
        };
    }]);