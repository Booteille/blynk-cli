'use strict'

exports.command = 'add'
exports.desc = 'Add a new user'

exports.builder = {}

exports.handler = function (argv) {
  require('../../libs/user').add(argv)
}
