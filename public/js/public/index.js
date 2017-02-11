var app = angular.module('index', [
    'ui-notification',
    'angularSpinner',
    'pathgather.popeye'
]);

app.config(function(NotificationProvider) {
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
});

app.controller('navigation',function($scope, $http, Notification, Popeye){
    $scope.loading = false;

    /**
     * Register
     * @type {boolean}
     */
    $scope.regFormPopUp = false;
    $scope.register = function () {
        $scope.regFormPopUp = Popeye.openModal({
            templateUrl: "register.html",
            scope: $scope
        });
        $scope.regFormPopUp.open();
    };
    $scope.success = false;
    $scope.submitRegForm = function(isValid) {
        // check to make sure the form is completely valid
        if (isValid) {
            $scope.loading = true;
            $http
                .post('/account/ajax/register', $scope.form)
                .then(function (res) {
                    var data = res.data.data;
                    if(!data){
                        Notification.error("Server error");
                    } else {
                        $scope.success = true;
                        $scope.new_password = data.new_password;
                    }
                    $scope.loading = false;
            }, function (res) {
                if(res.data.errors && res.data.errors.forEach){
                    res.data.errors.forEach(function (err, key, errors) {
                        Notification.error(err);
                    });
                } else {
                    Notification.error("Server error...");
                }
                $scope.loading = false;
            });
        }
    };

    $scope.goToLogin = function () {
        $scope.closePopUps();
        $scope.login();
    };

    /**
     * Login
     * @type {boolean}
     */
    $scope.loginFormPopUp = false;
    $scope.login = function () {
        $scope.loginFormPopUp = Popeye.openModal({
            templateUrl: "login.html",
            scope: $scope
        });
        $scope.loginFormPopUp.open();
    };

    $scope.submitLoginForm = function (isValid) {
        if (isValid) {
            $scope.loading = true;
            $http
                .post('/account/ajax/login', $scope.form)
                .then(function (res) {
                    var data = res.data.data;
                    if(!data){
                        Notification.error("Server error");
                    } else {
                        document.location.href = "/account/";
                    }
            }, function (res) {
                if(res.data.errors && res.data.errors.forEach){
                    res.data.errors.forEach(function (err, key, errors) {
                        Notification.error(err);
                    });
                } else {
                    Notification.error("Server error...");
                }
                $scope.loading = false;
            });
        }
    };

    /**
     * Restore
     * @type {boolean}
     */
    $scope.loginRestorePopUp = false;
    $scope.restore = function () {
        $scope.loginRestorePopUp = Popeye.openModal({
            templateUrl: "restore.html",
            scope: $scope
        });
        $scope.loginRestorePopUp.open();
    };

    $scope.submitRestoreForm = function (isValid) {
        if (isValid) {
            $scope.loading = true;
            $http
                .post('/account/ajax/restore', $scope.form)
                .then(function (res) {
                    var data = res.data.data;
                    if(!data){
                        Notification.error("Server error");
                    } else {
                        $scope.success = true;
                    }
                    $scope.loading = false;
            }, function (res) {
                if(res.data.errors && res.data.errors.forEach){
                    res.data.errors.forEach(function (err, key, errors) {
                        Notification.error(err);
                    });
                } else {
                    Notification.error("Server error...");
                }
                $scope.loading = false;
            });
        }
    };

    $scope.closePopUps = function () {
        if($scope.regFormPopUp)
            $scope.regFormPopUp.close();
        if($scope.loginFormPopUp)
            $scope.loginFormPopUp.close();
        if($scope.loginRestorePopUp)
            $scope.loginRestorePopUp.close();
    };

});