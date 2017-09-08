(function () {
  'use strict';

  angular
    .module('shortcuts')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Shortcuts',
      state: 'shortcuts.list',
      roles: ['user', 'admin']
    });

  }
}());
