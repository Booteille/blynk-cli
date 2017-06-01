'use strict'

exports.command = 'show [email]'
exports.desc = 'Show infos about user [email]'

exports.builder = {}

exports.handler = function (argv) {
  require('../../libs/user').show(argv)
}
