'use strict';

angular.module('myApp.masterMember', ['ngRoute', 'recepuncu.ngSweetAlert2'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/index-member', {
                templateUrl: 'views/member/index_member.html',
                controller: 'MasterMemberCtrl',
                middleware: 'async-auth'
            });
    }])

    .controller('MasterMemberCtrl', ['$scope', '$http', '$window', '$location', 'SweetAlert2', 'globalVar', function ($scope, $http, $window, $location, SweetAlert2, globalVar) {
        $scope.name = localStorage.getItem('name')
        $scope.admin = localStorage.getItem('admin')
        $scope.getMember = function () {
            $http({
                method: 'GET',
                url: globalVar.url + '/user/member/all',
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                },
                params: {
                    per_page: 10,
                    search: $scope.searchValue
                }
            }).then(function success(res) {
                    if (res.data.status == 200) {
                        $scope.members = res.data.data.users
                    }
                },
                function fail(err) {
                    console.log(err);
                });
        }
        $scope.getMember()

        $scope.nextFunc = function (next_page_url) {
            $http({
                method: 'GET',
                url: next_page_url,
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                },
                params: {
                    per_page: 10,
                    search: $scope.searchValue
                }
            }).then(function success(res) {
                    if (res.data.status == 200) {
                        $scope.members = res.data.data.users
                    }
                    $location.path('/index-member');
                },
                function fail(err) {
                    console.log(err);
                    $location.path('/index-member');
                });
        }
    }])