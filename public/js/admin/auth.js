var app = angular.module('japp');
app.controller('LoginController',function($scope, $http, Notification){
    $scope.loading = false;
    $scope.form = {};
    $scope.submitLogin = function () {
        $scope.loading = true;
        $http.post('/admin/login', $scope.form).then(function (response) {
            $scope.loading = false;
            document.location.href = '/admin';
        }, function (response) {
            console.log(response);
            if(response.data.errors && response.data.errors.forEach){
                response.data.errors.forEach(function (val, key, array) {
                    Notification.error(val);
                });
            } else {
                Notification.error("Server error!");
            }
            $scope.loading = false;
        });
    };
});
app.controller('ForgotController',function($scope, $http, Notification){
    $scope.loading = false;
    $scope.form = {};
    $scope.submitForgot = function () {
        $scope.loading = true;
        $http.post('/admin/forgot', $scope.form).then(function (response) {
            $scope.loading = false;
            Notification.success("Пароль отправлен!");
        }, function (response) {
            console.log(response);
            if(response.data.errors && response.data.errors.forEach){
                response.data.errors.forEach(function (val, key, array) {
                    Notification.error(val);
                });
            } else {
                Notification.error("Server error!");
            }
            $scope.loading = false;
        });
    };
});