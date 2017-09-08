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
        abstract: true,
        url: '/allowed-logins',
        template: '<ui-view />'
      })
      .state('admin.allowed-logins.list', {
        url: '',
        templateUrl: '/modules/users/client/views/admin/list-allowed-logins.client.view.html',
        controller: 'AllowedLoginListController',
        controllerAs: 'vm'
      })
      .state('admin.allowed-logins.create', {
        url: '/create',
        templateUrl: '/modules/users/client/views/admin/edit-allowed-login.client.view.html',
        controller: 'AllowedLoginController',
        controllerAs: 'vm',
        resolve: {
          allowedLoginResolve: newAllowedLogin
        }
      })
      .state('admin.allowed-logins.view', {
        url: '/:allowedLoginId',
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
      .state('admin.allowed-logins.edit', {
        url: '/:allowedLoginId/edit',
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

    getAllowedLogin.$inject = ['$stateParams', 'AllowedLoginsService'];

    function getAllowedLogin($stateParams, AllowedLoginsService) {
      return AllowedLoginsService.get({
        allowedLoginId: $stateParams.allowedLoginId
      }).$promise;
    }

    newAllowedLogin.$inject = ['AllowedLoginsService'];

    function newAllowedLogin(AllowedLoginsService) {
      return new AllowedLoginsService();
    }
  }
}());
