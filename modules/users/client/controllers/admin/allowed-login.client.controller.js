(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('AllowedLoginController', AllowedLoginController);

  AllowedLoginController.$inject = ['$scope', '$state', '$window', 'Authentication', 'allowedLoginResolve', 'Notification'];

  function AllowedLoginController($scope, $state, $window, Authentication, login, Notification) {
    var vm = this;

    vm.authentication = Authentication;
    vm.login = login;
    vm.remove = remove;
    vm.save = save;

    function remove(login) {
      if ($window.confirm('Are you sure you want to delete this login?')) {
        if (login) {
          login.$remove();

          vm.logins.splice(vm.logins.indexOf(login), 1);
          Notification.success('Allowed Login deleted successfully!');
        } else {
          vm.login.$remove(function () {
            $state.go('admin.allowed-logins.list');
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Allowed Login deleted successfully!' });
          });
        }
      }
    }

    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.allowedLoginForm');

        return false;
      }

      // Create a new shortcut, or update the current instance
      vm.login.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.allowed-logins.list');
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Allowed Login saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Allowed Login save error!' });
      }
    }
  }
}());
