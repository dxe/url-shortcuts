'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Shortcut = mongoose.model('Shortcut'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an shortcut
 */
exports.create = function (req, res) {
  var shortcut = new Shortcut(req.body);
  shortcut.user = req.user;

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

  shortcut.url = req.body.url;
  shortcut.target = req.body.target;

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
