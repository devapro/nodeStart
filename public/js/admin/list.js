var app = angular.module('angularAdmin');

app.controller('listdata',function($scope, $http, Notification){
    $scope.loading = false;

    $scope.items = [];
    $scope.search = "";

    $scope.sortKey = "created_at";
    $scope.reverse = false;

    $scope.pageno = 1;
    $scope.total_count = 0;
    $scope.itemsPerPage = 50;

    $scope.header = {};
    $scope.urls = {
        "view": "view",
        "update": "update",
        "delete": "delete"
    };

    $scope.getData = function () {
        $scope.loading = true;
        $http.get($scope.dataUrl + $scope.itemsPerPage + "/" + $scope.pageno + "/?q=" + $scope.search + "&sortKey=" + $scope.sortKey + "&reverse=" + ($scope.reverse ? 1 : -1) ).success(function(response){
            $scope.items = response.data.data;
            $scope.header = response.data.header;
            $scope.urls = response.data.urls;
            $scope.total_count = response.data.total_count;
            $scope.loading = false;
        }).error(function (response) {
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

    $scope.$watch('search', function () {
        $scope.getData();
    });

    $scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
        $scope.getData();
    };

    $scope.cancelSearch = function () {
        $scope.search = "";
        $scope.getData();
    };

    $scope.showWait = function () {
        $scope.loading = true;
    };

    $scope.hideWait = function () {
        $scope.loading = false;
    };
});

/**
 * Delete item
 */
app.directive('ngDeleteItem', [ '$http', 'Notification', function($http, Notification) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                var id = attrs.ngDeleteId;
                var url = attrs.ngDeleteUrl;
                if (confirm("Delete this item?")) {
                    scope.loading = true;
                    $http.get(url + id ).success(function(response){
                        Notification.success('Success delete');
                        scope.loading = false;
                        scope.getData();
                    }).error(function (err) {
                        Notification.error('Error delete');
                        scope.loading = false;
                    });
                }
            });
        }
    }
}]);

/**
 * Delete all
 */
app.directive('ngDeleteAll', [ '$http', 'Notification', function($http, Notification) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                var url = attrs.ngDeleteUrl;
                if (confirm("Delete all items?")) {
                    scope.loading = true;
                    $http.get(url).success(function(response){
                        Notification.success('Success delete all');
                        scope.loading = false;
                        scope.getData();
                    }).error(function (err) {
                        Notification.error('Error delete');
                        scope.loading = false;
                    });
                }
            });
        }
    }
}]);

/**
 * View item
 */
app.directive('ngViewItem', [ '$http', 'Notification', 'Popeye', function($http, Notification, Popeye) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                var id = attrs.ngViewId;
                var url = attrs.ngViewUrl;

                scope.loading = true;
                $http.get(url + id ).success(function(response){
                    var model = response.data.model;
                    scope.names = response.data.names;

                    scope.model = {};
                    for(var i in model){
                        if(scope.names[i]){
                            scope.model[i] = model[i];
                        }
                    }

                    Popeye.openModal({
                        templateUrl: "viewItem.html",
                        scope: scope
                    });

                    scope.loading = false;
                }).error(function (response) {
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
            });
        }
    }
}]);

/**
 * Update item
 */
app.directive('ngUpdateItem', [ '$http', 'Notification', 'Popeye', function($http, Notification, Popeye) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                var id = attrs.ngUpdateId;
                var url = attrs.ngUpdateUrl;
                var template = attrs.ngUpdateTemplate;

                scope.loading = true;
                scope.formUrl = url + id;
                $http
                    .get(scope.formUrl)
                    .success(function(response){
                        if(response.data && response.data.model){
                            scope.model = response.data.model;
                            scope.lists = response.data.lists;
                            scope.meta = response.data.meta;
                            if (scope.popup && scope.popup.close) {
                                scope.popup.close();
                            }
                            scope.popup = Popeye.openModal({
                                templateUrl: template,
                                scope: scope
                            });
                        } else {
                            Notification.error("Server error!");
                        }
                        scope.loading = false;
                    }).error(function (response) {
                    console.log(response);
                    if (response.data.errors && response.data.errors.forEach) {
                        response.data.errors.forEach(function (val, key, array) {
                            Notification.error(val);
                        });
                    } else {
                        Notification.error("Server error!");
                    }
                    scope.loading = false;
                });
            });
        }
    }
}]);

/**
 * Create item
 */
app.directive('ngCreateItem', [ '$http', 'Notification', 'Popeye', function($http, Notification, Popeye) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                scope.formUrl = attrs.ngCreateUrl;
                var template = attrs.ngCreateTemplate;
                scope.model = {};
                scope.loading = true;
                $http
                    .get(scope.formUrl)
                    .success(function(response){
                    if(response.data && response.data.model){
                        scope.model = response.data.model;
                        scope.lists = response.data.lists;
                        scope.meta = response.data.meta;
                        if (scope.popup && scope.popup.close) {
                            scope.popup.close();
                        }
                        scope.popup = Popeye.openModal({
                            templateUrl: template,
                            scope: scope
                        });
                    } else {
                        Notification.error("Server error!");
                    }
                    scope.loading = false;
                }).error(function (response) {
                    console.log(response);
                    if (response.data.errors && response.data.errors.forEach) {
                        response.data.errors.forEach(function (val, key, array) {
                            Notification.error(val);
                        });
                    } else {
                        Notification.error("Server error!");
                    }
                    scope.loading = false;
                });

            });
        }
    }
}]);

/**
 * Submit form with file
 */
app.directive('ngFileFormProcess', [ '$http', 'Notification', 'Upload', function($http, Notification, Upload) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('submit', function(e) {
                e.preventDefault();
                scope.loading = true;
                Upload.upload({
                    url: scope.formUrl,
                    data: scope.model
                }).then(function (resp) {
                    scope.getData();
                    Notification.success('Success save');
                    if (scope.popup && scope.popup.close) {
                        scope.popup.close();
                    }
                    scope.loading = false;
                }, function (response) {
                    console.log(response);
                    if (response.data.errors && response.data.errors.forEach) {
                        response.data.errors.forEach(function (val, key, array) {
                            Notification.error(val);
                        });
                    } else {
                        Notification.error("Server error!");
                    }
                    scope.loading = false;
                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ');
                });

            });
        }
    }
}]);

/**
 * Submit form
 */
app.directive('ngFormProcess', [ '$http', 'Notification', 'Upload', function($http, Notification, Upload) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('submit', function(e) {
                e.preventDefault();

                $http
                    .post(scope.formUrl, scope.model)
                    .success(function (resp) {
                        scope.getData();
                        Notification.success('Success save');
                        if (scope.popup && scope.popup.close) {
                            scope.popup.close();
                        }
                        scope.loading = false;
                    })
                    .error(function (response) {
                        console.log(response);
                        if (response.errors && response.errors.forEach) {
                            response.errors.forEach(function (val, key, array) {
                                Notification.error(val);
                            });
                        } else {
                            Notification.error("Server error!");
                        }
                        scope.loading = false;
                    });

            });
        }
    }
}]);

app.filter('to_trusted', ['$sce', function($sce){
    return function(text) {
        if(!text){
            return "";
        }
        if (text != undefined && (!text.replace || text.replace( /^\D+/g, '').length > 7) && moment(text, moment.ISO_8601, true).isValid()) {
            text = moment(text).format('MMMM Do YYYY, h:mm').toString();
        }

        text = text != undefined ? text.toString() : "";
        text = text.toString();
        return $sce.trustAsHtml(text);
    };
}]);

app.filter('show_obj', ['$sce', function($sce){
    return function(obj, property_name) {
        if(obj == null || obj == undefined){
            return "";
        }

        var properties = property_name.split(".");

        var tmp = obj;
        for(var i = 0; i < properties.length; i++){
            tmp  = tmp[properties[i]];
        }

        if (tmp != undefined && (!tmp.replace || tmp.replace( /^\D+/g, '').length > 7) && moment(tmp, moment.ISO_8601, true).isValid()) {
            tmp = moment(tmp).format('MMMM Do YYYY, h:mm').toString();
        }

        tmp = tmp != undefined ? tmp.toString() : "";

        return $sce.trustAsHtml(tmp);
    };
}]);

app.filter('show_html', ['$sce', function($sce){
    return function(obj) {
        obj = obj ? obj.toString() : "";
        return $sce.trustAsHtml(obj);
    };
}]);

app.controller('MainController',function($scope, $http){

});