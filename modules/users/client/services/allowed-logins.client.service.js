(function () {
  'use strict';

  angular
    .module('users.admin.services')
    .factory('AllowedLoginsService', AllowedLoginsService);

  AllowedLoginsService.$inject = ['$resource', '$log'];

  function AllowedLoginsService($resource, $log) {
    var AllowedLogin = $resource('/api/logins/:allowedLoginId', {
      allowedLoginId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(AllowedLogin.prototype, {
      createOrUpdate: function () {
        var allowedLogin = this;
        return createOrUpdate(allowedLogin);
      }
    });

    return AllowedLogin;

    function createOrUpdate(allowedLogin) {
      if (allowedLogin._id) {
        return allowedLogin.$update(onSuccess, onError);
      }

      return allowedLogin.$save(onSuccess, onError);

      // Handle successful response
      function onSuccess(shortcut) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
