'use strict'

exports.command = 'server <command>'
exports.aliases = 's'
exports.desc = 'Manage your Blynk server'

exports.builder = function (yargs) {
  return yargs.commandDir('server')
}

exports.handler = function (argv) {}
