'use strict';

angular.module('myApp.dashboard', ['ngRoute', 'recepuncu.ngSweetAlert2'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/dashboard', {
            templateUrl: 'views/dashboard/dashboard.html',
            controller: 'DashboardCtrl',
            middleware: 'async-auth'
        });
    }])

    .controller('DashboardCtrl', ['$scope', '$http', '$location', 'SweetAlert2', function ($scope, $http, $location, SweetAlert2) {
        var request = this;
        $scope.name = localStorage.getItem('name')
        $http({
                method: 'GET',
                url: 'http://perpus-api.mamorasoft.com/api/book/dashboard',
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })

            // The server has responded!
            .then(function success(res) {
                    if (res.data.status == 200) {
                        var data = res.data.data.dashboard
                        $scope.totalBuku = data.totalBuku
                        $scope.totalStok = data.totalStok
                        $scope.totalMember = data.totalMember
                        $scope.totalPegawai = data.totalPegawai
                        $scope.totalDipinjam = data.totalDipinjam
                        $scope.totalDikembalikan = data.totalDikembalikan
                    }
                    $location.path('/dashboard');
                },
                function fail(err) {
                    $location.path('/dashboard');
                });
    }]);