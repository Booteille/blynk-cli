'use strict'

exports.command = 'set <email> <key> <value>'
exports.desc = 'Set property <key> with value <value> of user <email>'

exports.builder = {}

exports.handler = function (argv) {
  require('../../libs/user').set(argv)
}
