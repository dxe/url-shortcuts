'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  path = require('path'),
  config = require(path.resolve('./config/config')),
  validator = require('validator'),
  Schema = mongoose.Schema,
  crypto = require('crypto'),
  chalk = require('chalk');

/**
 * A Validation function for local strategy email
 */
var validateLocalStrategyEmail = function (email) {
  return (!this.updated || validator.isEmail(email, { require_tld: false }));
};

/**
 * Allowed Logins Schema
 * Manage a list of users that are allowed to login.
 */
var AllowedLoginSchema = new Schema({
  email: {
    type: String,
    index: {
      unique: true,
      sparse: true // For this to work on a previously indexed field, the index must be dropped & the application restarted.
    },
    lowercase: true,
    trim: true,
    default: '',
    validate: [validateLocalStrategyEmail, 'Please fill a valid email address']
  },
  provider: {
    type: String,
    lowercase: true,
    trim: true,
    default: 'google'
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isDisabled: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

AllowedLoginSchema.statics.seed = seed;

mongoose.model('AllowedLogin', AllowedLoginSchema);

/**
* Seeds the AllowedLogin collection with document (AllowedLogin)
* and provided options.
*/
function seed(doc, options) {
  var AllowedLogin = mongoose.model('AllowedLogin');

  return new Promise(function (resolve, reject) {

    skipDocument()
      // TODO: Find Admin user to use for createdBy field
      .then(add)
      .then(function (response) {
        return resolve(response);
      })
      .catch(function (err) {
        return reject(err);
      });

    function skipDocument() {
      return new Promise(function (resolve, reject) {
        AllowedLogin
          .findOne({
            email: doc.email
          })
          .exec(function (err, existing) {
            if (err) {
              return reject(err);
            }

            if (!existing) {
              return resolve(false);
            }

            if (existing && !options.overwrite) {
              return resolve(true);
            }

            // Remove Login (overwrite)

            existing.remove(function (err) {
              if (err) {
                return reject(err);
              }

              return resolve(false);
            });
          });
      });
    }

    function add(skip) {
      return new Promise(function (resolve, reject) {

        if (skip) {
          return resolve({
            message: chalk.yellow('Database Seeding: AllowedLogin\t\t' + doc.email + ' skipped')
          });
        }

        var login = new AllowedLogin(doc);

        login.save(function (err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: AllowedLogin\t\t' + login.email + ' added' + (login.isAdmin ? ' as an admin' : '')
          });
        });
      });
    }

  });
}
