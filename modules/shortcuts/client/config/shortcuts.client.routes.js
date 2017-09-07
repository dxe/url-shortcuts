(function () {
  'use strict';

  angular
    .module('shortcuts.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('shortcuts', {
        abstract: true,
        url: '/shortcuts',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('shortcuts.list', {
        url: '',
        templateUrl: '/modules/shortcuts/client/views/list-shortcuts.client.view.html',
        controller: 'ShortcutsListController',
        controllerAs: 'vm'
      })
      .state('shortcuts.create', {
        url: '/create',
        templateUrl: '/modules/shortcuts/client/views/form-shortcut.client.view.html',
        controller: 'ShortcutsController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'user']
        },
        resolve: {
          shortcutResolve: newShortcut
        }
      })
      .state('shortcuts.view', {
        url: '/:shortcutId',
        templateUrl: '/modules/shortcuts/client/views/view-shortcut.client.view.html',
        controller: 'ShortcutsController',
        controllerAs: 'vm',
        resolve: {
          shortcutResolve: getShortcut
        },
        data: {
          pageTitle: '{{ shortcutResolve.title }}'
        }
      })
      .state('shortcuts.edit', {
        url: '/:shortcutId/edit',
        templateUrl: '/modules/shortcuts/client/views/form-shortcut.client.view.html',
        controller: 'ShortcutsController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'user'],
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
