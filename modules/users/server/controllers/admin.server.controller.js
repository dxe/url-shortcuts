'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  AllowedLogin = mongoose.model('AllowedLogin'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.readLogin = readLogin;
exports.listLogins = listLogins;
exports.addLogin = addLogin;
exports.updateLogin = updateLogin;
exports.deleteLogin = deleteLogin;
exports.loginByID = loginByID;

/**
 * Show the current user
 */
exports.read = function (req, res) {
  res.json(req.model);
};

/**
 * Update a User
 */
exports.update = function (req, res) {
  var user = req.model;

  // For security purposes only merge these parameters
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.displayName = user.firstName + ' ' + user.lastName;
  user.roles = req.body.roles;

  user.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
};

/**
 * Delete a user
 */
exports.delete = function (req, res) {
  var user = req.model;

  user.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
};

/**
 * List of Users
 */
exports.list = function (req, res) {
  User.find({}, '-salt -password -providerData').sort('-created').populate('user', 'displayName').exec(function (err, users) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(users);
  });
};

/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }

  User.findById(id, '-salt -password -providerData').exec(function (err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return next(new Error('Failed to load user ' + id));
    }

    req.model = user;
    next();
  });
};

function readLogin(req, res) {
  res.json(req.allowedLogin);
}

function listLogins(req, res) {
  AllowedLogin.find({})
    .exec(function (err, logins) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      }

      res.json(logins);
    });
}

function addLogin(req, res) {
  var login = new AllowedLogin(req.body);
  login.createdBy = req.user;

  login.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(login);
  });
}

function updateLogin(req, res) {
  var login = req.allowedLogin;

  // For security purposes only merge these parameters
  login.email = req.body.email;
  login.isAdmin = req.body.isAdmin;
  login.isDisabled = req.body.isDisabled;

  login.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(login);
  });
}

function deleteLogin(req, res) {
  var login = req.allowedLogin;

  login.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(login);
  });
}

function loginByID(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Allowed Login is invalid'
    });
  }

  AllowedLogin
    .findById(id)
    .exec(function (err, login) {
      if (err) {
        return next(err);
      } else if (!login) {
        return next(new Error('Failed to load allowed login ' + id));
      }

      req.allowedLogin = login;
      next();
    });
}
