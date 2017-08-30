(function () {
  'use strict';

  angular
    .module('shortcuts')
    .controller('ShortcutsListController', ShortcutsListController);

  ShortcutsListController.$inject = ['ShortcutsService', 'Authentication'];

  function ShortcutsListController(ShortcutsService, Authentication) {
    var vm = this;
    vm.user = Authentication.user;

    vm.shortcuts = ShortcutsService.query();
  }
}());
