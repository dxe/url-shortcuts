(function () {
  'use strict';

  angular
    .module('shortcuts.services')
    .factory('ShortcutsService', ShortcutsService);

  ShortcutsService.$inject = ['$resource', '$log'];

  function ShortcutsService($resource, $log) {
    var Shortcut = $resource('/api/shortcuts/:shortcutId', {
      shortcutId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Shortcut.prototype, {
      createOrUpdate: function () {
        var shortcut = this;
        return createOrUpdate(shortcut);
      }
    });

    return Shortcut;

    function createOrUpdate(shortcut) {
      if (shortcut._id) {
        return shortcut.$update(onSuccess, onError);
      } else {
        return shortcut.$save(onSuccess, onError);
      }

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
