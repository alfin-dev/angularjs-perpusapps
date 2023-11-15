'use strict';

angular.module('myApp.masterBuku', ['ngRoute', 'angularFileUpload', 'recepuncu.ngSweetAlert2', 'ngFileUpload'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/master-buku', {
                templateUrl: 'views/master/master_buku.html',
                controller: 'MasterCtrl',
                middleware: 'async-auth'
            })
            .when('/add-buku', {
                templateUrl: 'views/master/form_buku.html',
                controller: 'ManageBookCtrl',
                middleware: 'async-auth',
            })
            .when('/edit-buku', {
                templateUrl: 'views/master/form_buku_edit.html',
                controller: 'ManageBookCtrl',
                middleware: 'async-auth',
                params: {
                    data: null
                }
            })
            .when('/detail-buku', {
                templateUrl: 'views/master/detail_buku.html',
                controller: 'ManageBookCtrl',
                middleware: 'async-auth',
                params: {
                    data: null
                }
            })
            .when('/import-buku', {
                templateUrl: 'views/master/import_buku.html',
                controller: 'ManageBookCtrl',
                middleware: 'async-auth',
                params: {
                    data: null
                }
            });
    }])

    .controller('MasterCtrl', ['$scope', '$http', '$window', '$location', 'SweetAlert2', 'globalVar', function ($scope, $http, $window, $location, SweetAlert2, globalVar) {
        $scope.name = localStorage.getItem('name')
        $scope.admin = localStorage.getItem('admin')
        $scope.getBooks = function () {
            $http({
                method: 'GET',
                url: globalVar.url + '/book/all',
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                },
                params: {
                    per_page: 10,
                    search: $scope.searchValue,
                    filter: $scope.filterCategory
                }
            }).then(function success(res) {
                    if (res.data.status == 200) {
                        var data = res.data.data.books
                        $scope.books = data
                    }
                },
                function fail(err) {
                    console.log(err);
                });
        }
        $scope.getBooks()

        $http({
            method: 'GET',
            url: globalVar.url + '/category/all/all',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            },
        }).then(function success(res) {
                if (res.data.status == 200) {
                    var data = res.data.data.categories
                    $scope.categories = data
                }
            },
            function fail(err) {
                console.log(err);
            });

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
                        var data = res.data.data.books
                        $scope.books = data
                    }
                    $location.path('/master-buku');
                },
                function fail(err) {
                    console.log(err);
                    $location.path('/master-buku');
                });
        }

        $scope.deleteBooksFunc = function (id) {
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
                        url: globalVar.url + '/book/' + id + '/delete',
                        headers: {
                            Authorization: 'Bearer ' + localStorage.getItem('token')
                        },
                    }).then(function successCallback(response) {
                        if (response.data.status == 200) {
                            SweetAlert2.fire({
                                title: 'Success',
                                text: "Data buku berhasil dihapus!",
                                icon: 'success',
                            })
                            $scope.getBooks()
                            $location.path('/master-buku')
                        } else {
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

        $scope.downloadPdf = function () {
            $http({
                method: 'GET',
                url: globalVar.url + '/book/export/pdf',
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                },
            }).then(function success(res) {
                    if (res.data.status == 200) {
                        console.log(res.data);
                        $window.open('http://perpus-api.mamorasoft.com/' + res.data.path)
                    }
                },
                function fail(err) {
                    console.log(err);
                });
        }

        $scope.downloadExcel = function () {
            $http({
                method: 'GET',
                url: globalVar.url + '/book/export/excel',
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                },
            }).then(function success(res) {
                    if (res.data.status == 200) {
                        console.log(res.data);
                        $window.open(globalVar.baseUrl + res.data.path)
                    }
                },
                function fail(err) {
                    console.log(err);
                });
        }
    }])

    .controller('ManageBookCtrl', ['$scope', '$http', '$window', 'Upload', '$location', 'FileUploader', 'SweetAlert2', 'globalVar', function ($scope, $http, $window, Upload, $location, FileUploader, SweetAlert2, globalVar) {
        $scope.uploader = new FileUploader();
        $scope.name = localStorage.getItem('name')
        $scope.getCategoryFunc = function () {
            $http({
                method: 'GET',
                url: 'http://perpus-api.mamorasoft.com/api/category/all/all',
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                },
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

        $scope.editFunc = function (id) {
            $http({
                method: 'GET',
                url: globalVar.url + '/book/' + id,
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                },
            }).then(function success(res) {
                    console.log(res);
                    if (res.data.status == 200) {
                        var data = res.data.data.book
                        $scope.addBooks = data
                        $scope.addBooks.stock = $scope.addBooks.stok
                        $scope.addBooks.category = $scope.addBooks.category_id
                    }
                },
                function fail(err) {
                    console.log(err);
                });
        }

        $scope.detailFunc = function (id) {
            $scope.date = new Date();
            $http({
                method: 'GET',
                url: globalVar.url + '/book/' + id,
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                },
            }).then(function success(res) {
                    if (res.data.status == 200) {
                        var data = res.data.data.book
                        $scope.addBooks = data
                        console.log($scope.addBooks);
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
        $scope.getCategoryFunc()

        $scope.SelectFile = function (e) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $scope.PreviewImage = e.target.result;
                $scope.$apply();
            };

            $scope.cover = e.target.files[0];
            reader.readAsDataURL(e.target.files[0]);
        }

        $scope.SelectFileExcel = function (e) {
            $scope.excel = e.target.files[0];
        }

        $scope.addBooksFunc = function () {
            var data = {
                'judul': $scope.addBooks.judul,
                'category_id': $scope.addBooks.category,
                'pengarang': $scope.addBooks.pengarang,
                'penerbit': $scope.addBooks.penerbit,
                'tahun': $scope.addBooks.tahun,
                'stok': $scope.addBooks.stock,
                'path': $scope.cover,
            }
            Upload.upload({
                method: 'POST',
                url: globalVar.url + '/book/create',
                headers: {
                    'Content-Type': undefined,
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                },
                data: data
            }).then(function successCallback(response) {
                if (response.data.status == 201) {
                    SweetAlert2.fire({
                        title: 'Success',
                        text: "Data buku berhasil ditambahkan!",
                        icon: 'success',
                    })
                    $location.path('/master-buku')
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

        $scope.editBooksFunc = function () {
            var data = {
                'judul': $scope.addBooks.judul,
                'category_id': $scope.addBooks.category,
                'pengarang': $scope.addBooks.pengarang,
                'penerbit': $scope.addBooks.penerbit,
                'tahun': $scope.addBooks.tahun,
                'stok': $scope.addBooks.stock,
                'path': $scope.addBooks.cover,
            }
            $http({
                method: 'POST',
                url: 'http://perpus-api.mamorasoft.com/api/book/' + $location.search().id + '/update',
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                },
                data: data
            }).then(function successCallback(response) {
                if (response.data.status == 200) {
                    SweetAlert2.fire({
                        title: 'Success',
                        text: "Data buku berhasil diubah!",
                        icon: 'success',
                    })
                    $location.url('/master-buku')
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

        $scope.downloadTemplateExport = function () {
            $http({
                method: 'GET',
                url: globalVar.url + '/book/download/template',
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                },
            }).then(function success(res) {
                    if (res.data.status == 200) {
                        console.log(res.data);
                        $window.open('http://perpus-api.mamorasoft.com/' + res.data.path)
                    }
                },
                function fail(err) {
                    console.log(err);
                });
        }

        $scope.importBooksFunc = function () {
            Upload.upload({
                method: 'POST',
                url: globalVar.url + '/book/import/excel',
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                },
                data: {
                    file_import: $scope.excel
                }
            }).then(function success(res) {
                    if (res.data.status == 200) {
                        SweetAlert2.fire({
                            title: 'Success',
                            text: "Data buku berhasil diimport!",
                            icon: 'success',
                        })
                        $location.path('/master-buku')
                    } else {
                        console.log(res)
                        SweetAlert2.fire({
                            title: 'Error',
                            text: res.data.message,
                            icon: 'error',
                        })
                    }
                },
                function fail(err) {
                    console.log(err)
                    SweetAlert2.fire({
                        title: 'Error',
                        text: 'Terjadi kesalahan !',
                        icon: 'error',
                    })
                });
        }

    }]);