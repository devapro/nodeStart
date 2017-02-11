var app = angular.module('japp');
app.controller('UserLoginController',function($scope, $http, Notification){
    $scope.loading = false;
    $scope.form = {};
    $scope.submitLogin = function () {
        $scope.loading = true;
        $http.post('/account/ajax/auth/login', $scope.form).then(function (response) {
            $scope.loading = false;
            document.location.href = '/account';
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
app.controller('UserForgotController',function($scope, $http, Notification){
    $scope.loading = false;
    $scope.form = {};
    $scope.submitForgot = function () {
        $scope.loading = true;
        $http.post('/account/ajax/auth/forgot', $scope.form).then(function (response) {
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
app.controller('UserRegisterController',function($scope, $http, Notification){
    $scope.loading = false;
    $scope.form = {};
    $scope.submitRegister = function () {

        if($scope.form.password != $scope.form.password2){
            Notification.error("Пароли не совпадают!");
            return;
        }

        $scope.loading = true;
        $http.post('/account/ajax/auth/register', $scope.form).then(function (response) {
            $scope.loading = false;
            Notification.success("Регистрация успешна!");
            $scope.form = {};
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