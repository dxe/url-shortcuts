(function () {
  'use strict';

  angular
    .module('shortcuts')
    .controller('ShortcutsListController', ShortcutsListController);

  ShortcutsListController.$inject = ['ShortcutsService', 'Authentication', '$filter'];

  function ShortcutsListController(ShortcutsService, Authentication, $filter) {
    var vm = this;
    vm.user = Authentication.user;

    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;

    ShortcutsService.query(function (data) {
      vm.shortcuts = data;
      vm.buildPager();
    });

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 20;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.shortcuts, {
        $: vm.search
      });

      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }
  }
}());
