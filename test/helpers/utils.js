/**
 * Originally taken from yargs
 * @url(https://github.com/yargs/yargs/blob/master/test/helpers/utils.js)
 */

'use strict'

const Hash = require('hashish')
const chalk = require('chalk')

// capture terminal output, so that we might
// assert against it.
exports.checkOutput = function (f, argv, cb) {
  var exit = false
  var _exit = process.exit
  var _emit = process.emit
  var _env = process.env
  var _argv = process.argv
  var _error = console.error
  var _info = console.info
  var _log = console.log
  var _warn = console.warn

  process.exit = function () { exit = true }
  process.env = Hash.merge(process.env, { _: 'node' })
  process.argv = argv || [ './usage' ]

  var errors = []
  var infos = []
  var logs = []
  var warnings = []

  console.error = function (msg) { errors.push(msg) }
  console.info = function (msg) { infos.push(msg) }
  console.log = function (msg) { logs.push(msg) }
  console.warn = function (msg) { warnings.push(msg) }

  var result

  if (typeof cb === 'function') {
    process.exit = function () {
      exit = true
      cb(null, done())
    }
    process.emit = function (ev, value) {
      if (ev === 'uncaughtException') {
        done()
        cb(value)
        return true
      }

      return _emit.apply(this, arguments)
    }

    f()
  } else {
    try {
      result = f()
    } finally {
      reset()
    }

    return done()
  }

  function reset () {
    process.exit = _exit
    process.emit = _emit
    process.env = _env
    process.argv = _argv

    console.error = _error
    console.info = _info
    console.log = _log
    console.warn = _warn
  }

  function done () {
    reset()

    return {
      errors: errors,
      infos: infos,
      logs: logs,
      warnings: warnings,
      exit: exit,
      result: result
    }
  }
}

exports.msg = {
  error: function (message) {
    return chalk.red.bold('[ERR] ') + message
  },
  info: function (message) {
    return chalk.bold('[INFO] ') + message
  },
  success: function (message) {
    return chalk.green.bold('[OK] ') + message
  },
  warning: function (message) {
    return chalk.yellow.bold('[WARN] ') + message
  }
}
