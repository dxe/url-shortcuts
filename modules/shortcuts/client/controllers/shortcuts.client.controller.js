(function () {
  'use strict';

  angular
    .module('shortcuts')
    .controller('ShortcutsController', ShortcutsController);

  ShortcutsController.$inject = ['$scope', 'shortcutResolve', 'Authentication'];

  function ShortcutsController($scope, shortcut, Authentication) {
    var vm = this;

    vm.shortcut = shortcut;
    vm.authentication = Authentication;

  }
}());
