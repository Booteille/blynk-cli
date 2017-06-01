'use strict'

exports.command = 'restore <name>'
exports.desc = 'Restore from backup named <name>'

exports.builder = {}

exports.handler = function (argv) {
  require('../../libs/backup').restore(argv)
}
