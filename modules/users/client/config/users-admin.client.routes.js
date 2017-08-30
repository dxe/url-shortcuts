(function () {
  'use strict';

  // Setting up route
  angular
    .module('users.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.users', {
        url: '/users',
        templateUrl: '/modules/users/client/views/admin/list-users.client.view.html',
        controller: 'UserListController',
        controllerAs: 'vm'
      })
      .state('admin.user', {
        url: '/users/:userId',
        templateUrl: '/modules/users/client/views/admin/view-user.client.view.html',
        controller: 'UserController',
        controllerAs: 'vm',
        resolve: {
          userResolve: getUser
        },
        data: {
          pageTitle: '{{ userResolve.displayName }}'
        }
      })
      .state('admin.user-edit', {
        url: '/users/:userId/edit',
        templateUrl: '/modules/users/client/views/admin/edit-user.client.view.html',
        controller: 'UserController',
        controllerAs: 'vm',
        resolve: {
          userResolve: getUser
        },
        data: {
          pageTitle: '{{ userResolve.displayName }}'
        }
      })
      .state('admin.allowed-logins', {
        url: '/allowed-logins',
        templateUrl: '/modules/users/client/views/admin/list-allowed-logins.client.view.html',
        controller: 'AllowedLoginListController',
        controllerAs: 'vm'
      })
      .state('admin.allowed-login', {
        url: '/allowed-logins/:allowedLoginId',
        templateUrl: '/modules/users/client/views/admin/view-allowed-login.client.view.html',
        controller: 'AllowedLoginController',
        controllerAs: 'vm',
        resolve: {
          allowedLoginResolve: getAllowedLogin
        },
        data: {
          pageTitle: '{{ allowedLoginResolve.email }}'
        }
      })
      .state('admin.allowed-login-edit', {
        url: '/allowed-logins/:allowedLoginId/edit',
        templateUrl: '/modules/users/client/views/admin/edit-allowed-login.client.view.html',
        controller: 'AllowedLoginController',
        controllerAs: 'vm',
        resolve: {
          allowedLoginResolve: getAllowedLogin
        },
        data: {
          pageTitle: '{{ allowedLoginResolve.email }}'
        }
      });

    getUser.$inject = ['$stateParams', 'AdminService'];

    function getUser($stateParams, AdminService) {
      return AdminService.get({
        userId: $stateParams.userId
      }).$promise;
    }

    getAllowedLogin.$inject = ['$stateParams', 'AllowedLoginService'];

    function getAllowedLogin($stateParams, AllowedLoginService) {
      return AllowedLoginService.get({
        allowedLoginId: $stateParams.allowedLoginId
      }).$promise;
    }
  }
}());
