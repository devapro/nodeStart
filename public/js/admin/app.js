'use strict';

var app = angular.module('angularAdmin', [
    'angularUtils.directives.dirPagination',
    'ui-notification',
    'angularSpinner',
    'pathgather.popeye',
    'ngFileUpload',
    '720kb.datepicker',
    'angularMoment',
    'ui.select'
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
    });