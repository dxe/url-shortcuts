(function (app) {
  'use strict';

  app.registerModule('shortcuts', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('shortcuts.admin', ['core.admin']);
  app.registerModule('shortcuts.admin.routes', ['core.admin.routes']);
  app.registerModule('shortcuts.services');
  app.registerModule('shortcuts.routes', ['ui.router', 'core.routes', 'shortcuts.services']);
}(ApplicationConfiguration));
