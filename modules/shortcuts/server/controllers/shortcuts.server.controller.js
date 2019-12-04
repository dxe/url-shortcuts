'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Shortcut = mongoose.model('Shortcut'),
  Analytics = mongoose.model('Analytics'),
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

  console.log('Finding by ID!');

  Shortcut
    .findById(id)
    .populate('user', 'displayName')
    // trying this
    .populate('analytics', 'analytics')
    .exec(function (err, shortcut) {
      if (err) {
        return next(err);
      } else if (!shortcut) {
        return res.status(404).send({
          message: 'No shortcut with that identifier has been found'
        });
      }
      console.log(shortcut);
      req.shortcut = shortcut;
      next();
    });
};

function redirectShortcut(req, res, next) {
  // go to admin page
  if (req.url === '/shortcuts') {
    return next();
  }

  // go to url on website
  if (!req.shortcut) {
    res.redirect('http://directactioneverywhere.com' + req.url);
  }

  // go to shortcut
  res.redirect(req.shortcut.target);
}

function shortcutByCode(req, res, next, code) {
  if (restrictedShortcutCodes.indexOf(code) !== -1) {
    // This is probably an edge case, but it's an easy way to handle it.
    return next();
  }

  Shortcut
    .aggregate([{
      $project: {
        code_lower: { $toLower: '$code' },
        code: 1,
        target: 1,
        user: 1,
        created: 1
      }
    }, {
      $match: { code_lower: code.toString().toLowerCase() }
    }])
    .exec()
    .then(function (shortcuts) {
      if (!shortcuts || !shortcuts.length) {
        return next();
      }

      // TODO: If a shortcut is not found, or we find "too many", should we
      // just redirect them to dxe.io rather than show an error page?
      // We probably want to keep dxe.io/shortcuts hidden from public users.

      if (shortcuts.length !== 1) {
        return next(new Error('Found too many shortcuts for code: ', code));
      }

      req.shortcut = shortcuts[0];

      // log basic analytics data to shortcut
      Shortcut.findByIdAndUpdate(
        req.shortcut._id,
        {
          $set: { lastVisit: Date.now() },
          $inc: { totalVisits: 1 }
        },
        (err) => {
          if (err) {
            return next(new Error('Something went wrong!'));
          }
        }
      );
      // insert full data into analytics collection
      var analytics = new Analytics({
        shortcut: req.shortcut._id,
        referer: req.headers.referer,
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
      });
      analytics.save((err) => {
        if (err) return next(new Error('Something went wrong!'));
      });

      return next();
    })
    .catch(function (err) {
      return next(err);
    });
}
