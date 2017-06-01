'use strict'

exports.command = 'backup <command>'
exports.desc = 'Manage Backups'

exports.builder = function (yargs) {
  return yargs.commandDir('backup')
}

exports.handler = function (argv) {}
