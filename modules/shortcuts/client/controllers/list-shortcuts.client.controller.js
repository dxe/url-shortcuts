(function () {
  'use strict';

  angular
    .module('shortcuts')
    .controller('ShortcutsListController', ShortcutsListController);

  ShortcutsListController.$inject = ['ShortcutsService'];

  function ShortcutsListController(ShortcutsService) {
    var vm = this;

    vm.shortcuts = ShortcutsService.query();
  }
}());
