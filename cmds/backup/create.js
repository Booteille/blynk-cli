'use strict'

exports.command = 'create <name>'
exports.aliases = 'c'
exports.desc = 'Make a backup named <name> of the data folder'

exports.builder = {}

exports.handler = function (argv) {
  require('../../libs/backup').create(argv)
}
