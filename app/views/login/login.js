'use strict';

angular.module('myApp.login', ['ngRoute', 'ngStorage', 'recepuncu.ngSweetAlert2'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'views/login/login.html',
        controller: 'LoginCtrl',
        middleware: 'validate-login-page',
        resolve: {
          loadDependencies: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load('bootstrap');
          }],
        }
      })
      .when('/register', {
        templateUrl: 'views/login/register.html',
        controller: 'LoginCtrl',
        // middleware: 'validate-login-page',
        resolve: {
          loadDependencies: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load('bootstrap');
          }],
        }
      });
  }])

  .controller('LoginCtrl', ['$scope', '$http', '$location', 'SweetAlert2', function ($scope, $http, $location, SweetAlert2) {
    $scope.loginFunc = function () {
      $scope.user = {
        username: $scope.user.username,
        password: $scope.user.password
      }

      $http({
        method: 'POST',
        url: 'http://perpus-api.mamorasoft.com/api/login',
        data: $scope.user
      }).then(function successCallback(response) {
        if (response.data.status == 200) {
          var token = response.data.data.token
          var name = response.data.data.user.name
          var id_user = response.data.data.user.id
          var role = response.data.data.user.roles[0].name
          if (role == 'admin') {
            localStorage.setItem('admin', true)
          } else {
            localStorage.setItem('admin', false)
          }
          localStorage.setItem('token', token)
          localStorage.setItem('name', name)
          localStorage.setItem('id_user', id_user)
          SweetAlert2.fire({
            title: 'Success',
            text: "Login succeed!",
            icon: 'success',
          })
          $location.path('/dashboard')
        } else {
          SweetAlert2.fire({
            title: 'Error',
            text: response.data.message + ' !',
            icon: 'error',
          })
          $location.path('/login')
        }
      }, function errorCallback(response) {
        console.log(response)
        $location.path('/login')
      });
    }

    $scope.registerFunc = function () {
      var user = {
        name: $scope.newUser.name,
        email: $scope.newUser.email,
        username: $scope.newUser.username,
        password: $scope.newUser.password,
        confirm_password: $scope.newUser.confirmpassword
      }
      $http({
        method: 'POST',
        url: 'http://perpus-api.mamorasoft.com/api/register',
        data: user
      }).then(function successCallback(response) {
        if (response.data.status == 200) {
          SweetAlert2.fire({
            title: 'Success',
            text: "Register succeed !",
            icon: 'success',
          })
          $location.path('/login')
        } else {
          console.log(response);
          SweetAlert2.fire({
            title: 'Error',
            text: response.data.message + ' !',
            icon: 'error',
          })
          $location.path('/register')
        }
      }, function errorCallback(response) {
        console.log(response)
        SweetAlert2.fire({
          title: 'Error',
          text: response.data.message + ' !',
          icon: 'error',
        })
        $location.path('/register')
      });
    }

    $scope.logoutFunc = function () {
      $http({
          method: 'GET',
          url: 'http://perpus-api.mamorasoft.com/api/logout',
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
          }
        })

        // The server has responded!
        .then(function success(res) {
          console.log(res);
          localStorage.clear()
          $location.path('/login')
        });
    }
  }]);