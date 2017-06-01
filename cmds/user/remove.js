'use strict'

exports.command = 'remove [email]'
exports.aliases = 'r'
exports.desc = 'Remove an user'

exports.builder = {}

exports.handler = function (argv) {
  require('../../libs/user').remove(argv)
}
