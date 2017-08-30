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
        template: '<ui-view/>'
      })
      .state('shortcuts.list', {
        url: '',
        templateUrl: '/modules/shortcuts/client/views/list-shortcuts.client.view.html',
        controller: 'ShortcutsListController',
        controllerAs: 'vm'
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
      });
  }

  getShortcut.$inject = ['$stateParams', 'ShortcutsService'];

  function getShortcut($stateParams, ShortcutsService) {
    return ShortcutsService.get({
      shortcutId: $stateParams.shortcutId
    }).$promise;
  }
}());
