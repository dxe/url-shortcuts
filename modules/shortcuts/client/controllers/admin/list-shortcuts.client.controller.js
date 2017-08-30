(function () {
  'use strict';

  angular
    .module('shortcuts.admin')
    .controller('ShortcutsAdminListController', ShortcutsAdminListController);

  ShortcutsAdminListController.$inject = ['ShortcutsService'];

  function ShortcutsAdminListController(ShortcutsService) {
    var vm = this;

    vm.shortcuts = ShortcutsService.query();
  }
}());
