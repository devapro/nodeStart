var app = angular.module('japp');

app.controller('posts',function($scope, $http, $timeout,  Notification, Popeye){
    $scope.loading = false;
    $scope.items = [];

    $scope.popUp = false;

    $scope.pageno = 1;
    $scope.itemsPerPage = 10;

    var locale = function(number, index) {
        // number: the timeago / timein number;
        // index: the index of array below;
        return [
            ['just now', 'сейчас'],
            ['%s seconds ago', '%s секунд'],
            ['1 minute ago', 'минута'],
            ['%s minutes ago', '%s минут'],
            ['1 hour ago', 'час'],
            ['%s hours ago', '%s часов'],
            ['1 day ago', 'день'],
            ['%s days ago', '%s дней'],
            ['1 week ago', 'неделя'],
            ['%s weeks ago', '%s недель'],
            ['1 month ago', 'месяц'],
            ['%s months ago', '%s месяцев'],
            ['1 year ago', 'год'],
            ['%s years ago', '%s лет']
        ][index];
    };
    timeago.register('ru_RU', locale);
    var timeagoInstance = new timeago();

    $scope.getData = function (url_api) {

        $scope.loading = true;
        $http.get("/api_v1/posts" + url_api + "/" + $scope.pageno + "/")
            .success(function(response){
                console.log(response);
                var items = response.data.data;
                $scope.items = $scope.items.concat(items);
                $scope.loading = false;
                $timeout(function () {
                    for(var i = 0; i < items.length; i++){
                        var el = null;
                        if(items[i].image_full){
                            el = document.getElementById(items[i].id+"_image");
                        } else {
                            el = document.getElementById(items[i].id+"_text");
                        }
                        el.className="ya-share2";
                        Ya.share2(el);
                    }
                }, 1000);
            })
            .error(function (response) {
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

    $scope.showMore = function (on_page, page, url_api) {
        if($scope.items.length == 0){
            $scope.pageno = page+1;
            $scope.itemsPerPage = on_page;
        }
        $scope.pageno++;
        $scope.getData(url_api);
    };

    $scope.showNextRandom = function (type) {
        $scope.loading = true;
        $http.get("/api_v1/post" + type)
            .success(function(response){
                console.log(response);
                var item = response.data;
                $scope.item = item;
                $scope.loading = false;
                $timeout(function () {
                    var el = null;
                    if(item.image_full){
                        el = document.getElementById(item.id+"_image");
                    } else {
                        el = document.getElementById(item.id+"_text");
                    }
                    el.className="ya-share2";
                    Ya.share2(el);
                }, 1000);
            })
            .error(function (response) {
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

    $scope.formatDate = function (date) {
      return timeagoInstance.format(date, 'ru_RU');
    };
    $scope.formatDateF = function (date) {
        return timeagoInstance.format(new Date(date), 'ru_RU');
    };

    $scope.showPost = function (item) {
        $scope.showedItem = item;
        $scope.popUp = Popeye.openModal({
            templateUrl: "/templates/public/post.html",
            scope: $scope
        });
        $scope.popUp.open();
    };

    $scope.closePopUps = function () {
        if($scope.popUp){
            $scope.popUp.close();
        }
    };

    $scope.disable_rate = false;
    $scope.good = function (id, type) {
        if($scope.disable_rate){
            return;
        }
        $scope.disable_rate = true;
        $timeout(function () {
            $scope.disable_rate = false;
        }, 3000);

        $scope.loading = true;
        $http.get("/api_v1/rate/unlike/" + type + "/" + id)
            .success(function(response){
                Notification.success("Спасибо за оцеку!");
                $scope.loading = false;
            })
            .error(function (response) {
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
    
    $scope.bad = function (id, type) {
        if($scope.disable_rate){
            return;
        }
        $scope.disable_rate = true;
        $timeout(function () {
            $scope.disable_rate = false;
        }, 3000);
        $scope.loading = true;
        $http.get("/api_v1/rate/like/" + type + "/" + id)
            .success(function(response){
                Notification.success("Спасибо за оцеку!");
                $scope.loading = false;
            })
            .error(function (response) {
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
    }

});