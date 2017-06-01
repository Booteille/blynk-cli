'use strict'

exports.command = 'password [email]'
exports.desc = 'Change password of selected user'

exports.builder = {}

exports.handler = function (argv) {
  require('../../libs/user').password(argv)
}
