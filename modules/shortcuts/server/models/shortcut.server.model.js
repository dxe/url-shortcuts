'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  path = require('path'),
  config = require(path.resolve('./config/config')),
  chalk = require('chalk');

/**
 * Shortcut Schema
 */
var ShortcutSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  code: {
    type: String,
    default: '',
    trim: true,
    required: 'URL cannot be blank',
    unique: 'Shortcut Code already exists'
  },
  target: {
    type: String,
    default: '',
    trim: true,
    required: 'Target URL cannot be blank'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

ShortcutSchema.statics.seed = seed;

mongoose.model('Shortcut', ShortcutSchema);

/**
* Seeds the User collection with document (Shortcut)
* and provided options.
*/
function seed(doc, options) {
  var Shortcut = mongoose.model('Shortcut');

  return new Promise(function (resolve, reject) {

    skipDocument()
      .then(findAdminUser)
      .then(add)
      .then(function (response) {
        return resolve(response);
      })
      .catch(function (err) {
        return reject(err);
      });

    function findAdminUser(skip) {
      var User = mongoose.model('User');

      return new Promise(function (resolve, reject) {
        if (skip) {
          return resolve(true);
        }

        User
          .findOne({
            roles: { $in: ['admin'] }
          })
          .exec(function (err, admin) {
            if (err) {
              return reject(err);
            }

            doc.user = admin;

            return resolve();
          });
      });
    }

    function skipDocument() {
      return new Promise(function (resolve, reject) {
        Shortcut
          .findOne({
            title: doc.title
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

            // Remove Shortcut (overwrite)

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
            message: chalk.yellow('Database Seeding: Shortcut\t' + doc.title + ' skipped')
          });
        }

        var shortcut = new Shortcut(doc);

        shortcut.save(function (err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: Shortcut\t' + shortcut.title + ' added'
          });
        });
      });
    }
  });
}
