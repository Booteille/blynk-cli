'use strict'

exports.command = 'remove <name>'
exports.desc = 'Remove a backup named <name>'

exports.builder = {}

exports.handler = function (argv) {
  require('../../libs/backup').remove(argv)
}
