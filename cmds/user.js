'use strict'

exports.command = 'user <command>'
exports.desc = 'Manage Blynk server users'

exports.builder = function (yargs) {
  return yargs.commandDir('user')
}

exports.handler = function (argv) {}
