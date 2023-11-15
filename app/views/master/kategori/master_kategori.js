'use strict';

angular.module('myApp.masterKategori', ['ngRoute', 'angularFileUpload', 'recepuncu.ngSweetAlert2', 'ngFileUpload'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/master-kategori', {
                templateUrl: 'views/master/kategori/index_kategori.html',
                controller: 'MasterCategoryCtrl',
                middleware: 'async-auth'
            })
            .when('/add-kategori', {
                templateUrl: 'views/master/kategori/form_kategori.html',
                controller: 'ManageKategoriCtrl',
                middleware: 'async-auth',
            })
            .when('/edit-kategori', {
                templateUrl: 'views/master/kategori/form_kategori_edit.html',
                controller: 'ManageKategoriCtrl',
                middleware: 'async-auth',
                params: {
                    data: null
                }
            });
    }])

    .controller('MasterCategoryCtrl', ['$scope', '$http', '$location', 'SweetAlert2', 'globalVar', function ($scope, $http, $location, SweetAlert2, globalVar) {
        $scope.name = localStorage.getItem('name')
        $scope.admin = localStorage.getItem('admin')
        $scope.getCategories = function () {
            $http({
                method: 'GET',
                url: globalVar.url + '/category/all',
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                },
                params: {
                    per_page: 10,
                    search: $scope.searchValue

                }
            }).then(function success(res) {
                    if (res.data.status == 200) {
                        var data = res.data.data.categories
                        $scope.categories = data
                    }
                },
                function fail(err) {
                    console.log(err);
                });
        }
        $scope.getCategories()

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
                        var data = res.data.data.categories
                        $scope.categories = data
                    } else {
                        console.log(err);
                        SweetAlert2.fire({
                            title: 'Error',
                            text: 'Terjadi kesalahan !',
                            icon: 'error',
                        })
                    }
                },
                function fail(err) {
                    console.log(err);
                    SweetAlert2.fire({
                        title: 'Error',
                        text: 'Terjadi kesalahan !',
                        icon: 'error',
                    })
                });
        }


        $scope.deleteCategoryFunc = function (id) {
            SweetAlert2.fire({
                title: "Apakah anda yakin?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, hapus!"
            }).then((result) => {
                if (result.isConfirmed) {
                    $http({
                        method: 'DELETE',
                        url: globalVar.url + '/category/' + id + '/delete',
                        headers: {
                            Authorization: 'Bearer ' + localStorage.getItem('token')
                        },
                    }).then(function successCallback(response) {
                        if (response.data.status == 200) {
                            SweetAlert2.fire({
                                title: 'Success',
                                text: "Kategori buku berhasil dihapus!",
                                icon: 'success',
                            })
                            $scope.getCategories()
                            $location.path('/master-kategori')
                        } else {
                            console.log(response);
                            SweetAlert2.fire({
                                title: 'Error',
                                text: 'Terjadi kesalahan !',
                                icon: 'error',
                            })
                        }
                    }, function errorCallback(response) {
                        console.log(response)
                        SweetAlert2.fire({
                            title: 'Error',
                            text: 'Terjadi kesalahan !',
                            icon: 'error',
                        })
                    });
                }
            });
        }
    }])

    .controller('ManageKategoriCtrl', ['$scope', '$http', 'Upload', '$location', 'FileUploader', 'SweetAlert2', 'globalVar', function ($scope, $http, Upload, $location, FileUploader, SweetAlert2, globalVar) {
        $scope.uploader = new FileUploader();
        $scope.name = localStorage.getItem('name')

        $scope.editFunc = function (id) {
            $http({
                method: 'GET',
                url: globalVar.url + '/category/' + id,
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                },
            }).then(function success(res) {
                    console.log(res);
                    if (res.data.status == 200) {
                        var data = res.data.data.category
                        $scope.addCategory = data
                    }
                },
                function fail(err) {
                    console.log(err);
                });
        }

        if ($location.search().id) {
            $scope.editFunc($location.search().id)
        }
        if ($location.search().id_detail) {
            $scope.detailFunc($location.search().id_detail)
        }

        $scope.addCategoryFunc = function () {
            var data = {
                'nama_kategori': $scope.addCategory.nama_kategori,
            }
            $http({
                method: 'POST',
                url: globalVar.url + '/category/create',
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                },
                data: data
            }).then(function successCallback(response) {
                if (response.data.status == 201) {
                    SweetAlert2.fire({
                        title: 'Success',
                        text: "Data kategori berhasil ditambahkan!",
                        icon: 'success',
                    })
                    $location.path('/master-kategori')
                } else {
                    console.log(response.data);
                    SweetAlert2.fire({
                        title: 'Error',
                        text: 'Terjadi kesalahan !',
                        icon: 'error',
                    })
                }
            }, function errorCallback(response) {
                console.log(response)
                SweetAlert2.fire({
                    title: 'Error',
                    text: 'Terjadi kesalahan !',
                    icon: 'error',
                })
                $location.path('/add-buku')
            });
        }

        $scope.editCategoryFunc = function () {
            var data = {
                'nama_kategori': $scope.addCategory.nama_kategori,
            }
            $http({
                method: 'POST',
                url: globalVar.url + '/category/update/' + $location.search().id,
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                },
                data: data
            }).then(function successCallback(response) {
                if (response.data.status == 200) {
                    SweetAlert2.fire({
                        title: 'Success',
                        text: "Data kategori berhasil diubah!",
                        icon: 'success',
                    })
                    $location.url('/master-kategori')
                } else {
                    SweetAlert2.fire({
                        title: 'Error',
                        text: 'Terjadi kesalahan !',
                        icon: 'error',
                    })
                    $location.path('/add-buku')
                }
            }, function errorCallback(response) {
                console.log(response)
                SweetAlert2.fire({
                    title: 'Error',
                    text: 'Terjadi kesalahan !',
                    icon: 'error',
                })
                $location.path('/edit-kategori')
            });
        }

        $scope.pinjamBukuFunc = function () {
            if (!$scope.pinjamBuku || !$scope.pinjamBuku.tanggalKembali) {
                SweetAlert2.fire({
                    title: 'Error',
                    text: 'Tanggal pinjam tidak boleh kosong !',
                    icon: 'error',
                })
            } else {
                var d = new Date($scope.pinjamBuku.tanggalKembali),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();

                if (month.length < 2)
                    month = '0' + month;
                if (day.length < 2)
                    day = '0' + day;

                var datePinjam = [year, month, day].join('-');

                console.log($scope.addBooks.id);
                var id_user = localStorage.getItem('id_user')
                var data = {
                    bypass: 1,
                    tanggal_pengembalian: datePinjam
                }

                $http({
                    method: 'POST',
                    url: globalVar.url + '/peminjaman/book/' + $scope.addBooks.id + '/member/' + id_user,
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    },
                    data: data
                }).then(function successCallback(response) {
                    if (response.data.status == 201) {
                        SweetAlert2.fire({
                            title: 'Success',
                            text: "Buku berhasil dipinjam !",
                            icon: 'success',
                        })
                        $location.path('/master-buku')
                    } else {
                        SweetAlert2.fire({
                            title: 'Error',
                            text: 'Terjadi kesalahan !',
                            icon: 'error',
                        })
                        $location.path('/add-buku')
                    }
                }, function errorCallback(response) {
                    console.log(response)
                    SweetAlert2.fire({
                        title: 'Error',
                        text: 'Terjadi kesalahan !',
                        icon: 'error',
                    })
                    $location.path('/add-buku')
                });
            }
        }

    }]);