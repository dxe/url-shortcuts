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
    vm.update = update;

    function remove(login) {
      if ($window.confirm('Are you sure you want to delete this login?')) {
        if (login) {
          login.$remove();

          vm.logins.splice(vm.logins.indexOf(login), 1);
          Notification.success('Allowed Login deleted successfully!');
        } else {
          vm.login.$remove(function () {
            $state.go('admin.allowed-logins');
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Allowed Login deleted successfully!' });
          });
        }
      }
    }

    function update(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.allowedLoginForm');

        return false;
      }

      var login = vm.login;

      login.$update(function () {
        $state.go('admin.allowed-login', {
          allowedLoginId: login._id
        });
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Allowed Login saved successfully!' });
      }, function (errorResponse) {
        Notification.error({ message: errorResponse.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Allowed Login update error!' });
      });
    }
  }
}());
