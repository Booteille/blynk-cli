'use strict'

exports.command = 'list'
exports.desc = 'List existing users'

exports.builder = {}

exports.handler = function (argv) {
  require('../../libs/user').list()
}
