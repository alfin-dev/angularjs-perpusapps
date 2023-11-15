'use strict';

// Declare app level module which depends on views, and core components
angular.module('myApp', [
    'ngRoute',
    'ngRoute.middleware',
    'myApp.login',
    'myApp.dashboard',
    'myApp.version',
    'myApp.module',
    'myApp.masterBuku',
    'myApp.masterKategori',
    'myApp.peminjaman',
    'myApp.masterMember',
    'recepuncu.ngSweetAlert2',
    'angularFileUpload',
    'ngFileUpload',
  ])
  .config(['$middlewareProvider', function ($middlewareProvider) {
    $middlewareProvider.map({
      /** It will wait for async requests too! */
      'async-auth': ['$http', function asyncAuth($http) {
        // We'll need access to "this" in a deeper context
        var request = this;

        // Grab something from the server
        $http({
            method: 'GET',
            url: 'http://perpus-api.mamorasoft.com/api/validate',
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token')
            }
          })

          // The server has responded!
          .then(function success(res) {
              if (res.data.status == 200) {
                return request.next();
              }
              request.redirectTo('/login');
            },
            function fail(err) {
              request.redirectTo('/login');
            });
      }],

      'validate-login-page': ['$http', function asyncAuth($http) {
        // We'll need access to "this" in a deeper context
        var request = this;

        // Grab something from the server
        $http({
            method: 'GET',
            url: 'http://perpus-api.mamorasoft.com/api/validate',
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token')
            }
          })

          // The server has responded!
          .then(function success(res) {
              if (res.data.status == 200) {
                request.redirectTo('/dashboard');
              }
              request.next();
            },
            function fail(err) {
              request.next();
            });
      }]
    });
  }])
  .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');
    $routeProvider
      .otherwise({
        redirectTo: '/dashboard'
      });
  }])
  .factory('globalVar', function () {
    return {
      url: 'http://perpus-api.mamorasoft.com/api',
      baseUrl: 'http://perpus-api.mamorasoft.com/'
    }
  })
  .controller('headerCtrl', ['$scope', '$location', function ($scope, $location) {
    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };
  }])