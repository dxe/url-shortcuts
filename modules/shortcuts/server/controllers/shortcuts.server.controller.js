'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Shortcut = mongoose.model('Shortcut'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  url = require('url');

var restrictedShortcutCodes = ['api', 'modules', 'lib', 'server-error', '*'];

exports.shortcutByCode = shortcutByCode;
exports.redirect = redirectShortcut;

// Helper function for formatting Shortcut Target URL
function formatShortcutTarget(target) {
  var targetUrl = url.parse(target);
  targetUrl.slashes = true;

  return url.format(targetUrl);
}

/**
 * Create an shortcut
 */
exports.create = function (req, res) {
  var shortcut = new Shortcut(req.body);
  shortcut.user = req.user;

  shortcut.target = formatShortcutTarget(shortcut.target);

  if (restrictedShortcutCodes.indexOf(shortcut.code) !== -1) {
    return res.status(422).send({
      message: 'You cannot use restricted keywords as Shortcut code: ' + restrictedShortcutCodes.join(', ')
    });
  }

  shortcut.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(shortcut);
    }
  });
};

/**
 * Show the current shortcut
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var shortcut = req.shortcut ? req.shortcut.toJSON() : {};

  // Add a custom field to the Shortcut, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Shortcut model.
  shortcut.isCurrentUserOwner = !!(req.user && shortcut.user && shortcut.user._id.toString() === req.user._id.toString());

  res.json(shortcut);
};

/**
 * Update an shortcut
 */
exports.update = function (req, res) {
  var shortcut = req.shortcut;

  shortcut.code = req.body.code;
  shortcut.target = formatShortcutTarget(req.body.target);

  shortcut.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(shortcut);
    }
  });
};

/**
 * Delete an shortcut
 */
exports.delete = function (req, res) {
  var shortcut = req.shortcut;

  shortcut.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(shortcut);
    }
  });
};

/**
 * List of Shortcuts
 */
exports.list = function (req, res) {
  Shortcut.find()
    .sort('-created')
    .populate('user', 'displayName')
    .exec(function (err, shortcuts) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(shortcuts);
      }
    });
};

/**
 * Shortcut middleware
 */
exports.shortcutByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Shortcut is invalid'
    });
  }

  Shortcut
    .findById(id)
    .populate('user', 'displayName')
    .exec(function (err, shortcut) {
      if (err) {
        return next(err);
      } else if (!shortcut) {
        return res.status(404).send({
          message: 'No shortcut with that identifier has been found'
        });
      }
      req.shortcut = shortcut;
      next();
    });
};

function redirectShortcut(req, res, next) {
  if (!req.shortcut) {
    return next();
  }

  res.redirect(req.shortcut.target);
}

function shortcutByCode(req, res, next, code) {
  if (restrictedShortcutCodes.indexOf(code) !== -1) {
    // This is probably an edge case, but it's an easy way to handle it.
    return next();
  }

  Shortcut
    .findOne({
      code: code
    })
    .exec()
    .then(function (shortcut) {
      req.shortcut = shortcut;
      return next();
    })
    .catch(function (err) {
      return next(err);
    });
}
