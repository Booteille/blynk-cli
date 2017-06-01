'use strict'

exports.command = 'get <email> <key>'
exports.aliases = 'g'
exports.desc = 'Get property <key> of user <email>'

exports.builder = {}

exports.handler = function (argv) {
  require('../../libs/user').get(argv)
}
