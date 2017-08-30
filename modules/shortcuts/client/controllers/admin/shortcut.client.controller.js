(function () {
  'use strict';

  angular
    .module('shortcuts.admin')
    .controller('ShortcutsAdminController', ShortcutsAdminController);

  ShortcutsAdminController.$inject = ['$scope', '$state', '$window', 'shortcutResolve', 'Authentication', 'Notification'];

  function ShortcutsAdminController($scope, $state, $window, shortcut, Authentication, Notification) {
    var vm = this;

    vm.shortcut = shortcut;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Shortcut
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.shortcut.$remove(function () {
          $state.go('admin.shortcuts.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Shortcut deleted successfully!' });
        });
      }
    }

    // Save Shortcut
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.shortcutForm');
        return false;
      }

      // Create a new shortcut, or update the current instance
      vm.shortcut.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.shortcuts.list'); // should we send the User to the list or the updated Shortcut's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Shortcut saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Shortcut save error!' });
      }
    }
  }
}());
