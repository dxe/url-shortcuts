(function () {
  'use strict';

  angular
    .module('shortcuts')
    .controller('ShortcutsController', ShortcutsController);

  ShortcutsController.$inject = ['$scope', 'shortcutResolve', 'Authentication', '$window', '$state', 'Notification', '$location'];

  function ShortcutsController($scope, shortcut, Authentication, $window, $state, Notification, $location) {
    var vm = this;

    vm.shortcut = shortcut;
    vm.authentication = Authentication;
    vm.remove = remove;
    vm.save = save;

    vm.user = vm.authentication.user;
    vm.isCurrentUserAdmin = vm.user && vm.user.roles && vm.user.roles.indexOf('admin') !== -1;
    vm.canEdit = vm.user && (vm.shortcut.isCurrentUserOwner || vm.isCurrentUserAdmin);

    vm.getShortcutLink = getShortcutLink;

    function getShortcutLink(shortcut) {
      shortcut = shortcut || vm.shortcut;

      if (!shortcut || !shortcut.code) {
        return;
      }

      return $location.protocol() + '://' + $location.host() + '/' + shortcut.code;
    }

    // Remove existing Shortcut
    function remove() {
      if (!vm.canEdit) {
        return;
      }

      if ($window.confirm('Are you sure you want to delete?')) {
        vm.shortcut.$remove(function () {
          $state.go('shortcuts.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Shortcut deleted successfully!' });
        });
      }
    }

    // Save Shortcut
    function save(isValid) {
      if (!vm.user || (!vm.canEdit && vm.shortcut._id)) {
        return;
      }

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.shortcutForm');
        return false;
      }

      // Create a new shortcut, or update the current instance
      vm.shortcut.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('shortcuts.view', { shortcutId: vm.shortcut._id }); // should we send the User to the list or the updated Shortcut's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Shortcut saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Shortcut save error!' });
      }
    }
  }
}());
