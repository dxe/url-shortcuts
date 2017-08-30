'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Shortcuts Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/shortcuts',
      permissions: '*'
    }, {
      resources: '/api/shortcuts/:shortcutId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/shortcuts',
      permissions: ['get', 'post']
    }, {
      resources: '/api/shortcuts/:shortcutId',
      permissions: []
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/shortcuts',
      permissions: ['get']
    }, {
      resources: '/api/shortcuts/:shortcutId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Shortcuts Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an shortcut is being processed and the current user created it then allow any manipulation
  if (req.shortcut && req.user && req.shortcut.user && req.shortcut.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
