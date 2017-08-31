'use strict';

/**
 * Module dependencies
 */
var shortcutsPolicy = require('../policies/shortcuts.server.policy'),
  shortcuts = require('../controllers/shortcuts.server.controller');

module.exports = function (app) {
  // Shortcuts collection routes
  app.route('/api/shortcuts').all(shortcutsPolicy.isAllowed)
    .get(shortcuts.list)
    .post(shortcuts.create);

  // Single shortcut routes
  app.route('/api/shortcuts/:shortcutId').all(shortcutsPolicy.isAllowed)
    .get(shortcuts.read)
    .put(shortcuts.update)
    .delete(shortcuts.delete);

  // Shortcut redirect route
  app.route('/:shortcutCode')
    .get(shortcuts.redirect);

  // Finish by binding the shortcut middleware
  app.param('shortcutId', shortcuts.shortcutByID);
  app.param('shortcutCode', shortcuts.shortcutByCode);
};
