(function () {
  'use strict';

  angular
    .module('shortcuts')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Shortcuts',
      state: 'shortcuts',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'shortcuts', {
      title: 'List Shortcuts',
      state: 'shortcuts.list',
      roles: ['*']
    });
  }
}());
