(function () {
  'use strict';

  angular
    .module('shortcuts.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.shortcuts', {
        abstract: true,
        url: '/shortcuts',
        template: '<ui-view/>'
      })
      .state('admin.shortcuts.list', {
        url: '',
        templateUrl: '/modules/shortcuts/client/views/admin/list-shortcuts.client.view.html',
        controller: 'ShortcutsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.shortcuts.create', {
        url: '/create',
        templateUrl: '/modules/shortcuts/client/views/admin/form-shortcut.client.view.html',
        controller: 'ShortcutsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          shortcutResolve: newShortcut
        }
      })
      .state('admin.shortcuts.edit', {
        url: '/:shortcutId/edit',
        templateUrl: '/modules/shortcuts/client/views/admin/form-shortcut.client.view.html',
        controller: 'ShortcutsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: '{{ shortcutResolve.title }}'
        },
        resolve: {
          shortcutResolve: getShortcut
        }
      });
  }

  getShortcut.$inject = ['$stateParams', 'ShortcutsService'];

  function getShortcut($stateParams, ShortcutsService) {
    return ShortcutsService.get({
      shortcutId: $stateParams.shortcutId
    }).$promise;
  }

  newShortcut.$inject = ['ShortcutsService'];

  function newShortcut(ShortcutsService) {
    return new ShortcutsService();
  }
}());
