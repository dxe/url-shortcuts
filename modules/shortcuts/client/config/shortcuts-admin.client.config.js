(function () {
  'use strict';

  // Configuring the Shortcuts Admin module
  angular
    .module('shortcuts.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    /*
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Shortcuts',
      state: 'admin.shortcuts.list'
    });
    */
  }
}());
