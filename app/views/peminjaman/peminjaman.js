'use strict';

angular.module('myApp.peminjaman', ['ngRoute', 'angularFileUpload', 'recepuncu.ngSweetAlert2', 'ngFileUpload'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/index-peminjaman', {
                templateUrl: 'views/peminjaman/index_peminjaman.html',
                controller: 'MasterPeminjamanCtrl',
                middleware: 'async-auth'
            })
            .when('/detail-peminjaman', {
                templateUrl: 'views/peminjaman/detail_peminjaman.html',
                controller: 'MasterPeminjamanCtrl',
                middleware: 'async-auth'
            });
    }])

    .controller('MasterPeminjamanCtrl', ['$scope', '$http', '$location', 'SweetAlert2', 'globalVar', function ($scope, $http, $location, SweetAlert2, globalVar) {
        $scope.name = localStorage.getItem('name')
        $scope.admin = localStorage.getItem('admin')
        $scope.getPeminjaman = function () {
            $http({
                method: 'GET',
                url: globalVar.url + '/peminjaman',
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                },
                params: {
                    per_page: 10,
                    search: $scope.searchValue
                }
            }).then(function success(res) {
                    if (res.data.status == 200) {
                        $scope.peminjamans = res.data.data.peminjaman
                    }
                },
                function fail(err) {
                    console.log(err);
                });
        }
        $scope.getPeminjaman()

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
                        $scope.peminjamans = res.data.data.peminjaman
                    }
                },
                function fail(err) {
                    console.log(err);
                });
        }

        $scope.bookReturnFunc = function (id) {
            SweetAlert2.fire({
                title: "Kembalikan buku?",
                text: "buku akan dikembalikan sekarang",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Ya !"
            }).then((result) => {
                if (result.isConfirmed) {
                    $http({
                        method: 'POST',
                        url: globalVar.url + '/peminjaman/book/' + id + '/return',
                        headers: {
                            Authorization: 'Bearer ' + localStorage.getItem('token')
                        },
                    }).then(function success(res) {
                            if (res.data.status == 200) {
                                SweetAlert2.fire({
                                    title: "Berhasil!",
                                    text: "Buku berhasil dikembalikan.",
                                    icon: "success"
                                });
                                if ($location.path() != '/index-peminjaman')
                                    $location.path('/index-peminjaman')
                                else {
                                    $scope.getPeminjaman()
                                }
                            } else {
                                console.log(res.data.status);
                                SweetAlert2.fire({
                                    title: "Gagal!",
                                    text: "Terjadi kesalahan! .",
                                    icon: "error"
                                });
                            }
                        },
                        function fail(err) {
                            SweetAlert2.fire({
                                title: "Gagal!",
                                text: "Terjadi kesalahan! .",
                                icon: "error"
                            });
                            console.log(err);
                        });
                }
            });
        }

        $scope.detailFunc = function (id) {
            $http({
                method: 'GET',
                url: globalVar.url + '/peminjaman/show/' + id,
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                },
            }).then(function success(res) {
                    if (res.data.status == 200) {
                        var data = res.data.data.book
                        $scope.dataPeminjaman = data
                    }
                },
                function fail(err) {
                    console.log(err);
                });
        }

        if ($location.search().id_detail) {
            $scope.detailFunc($location.search().id_detail)
        }
    }])