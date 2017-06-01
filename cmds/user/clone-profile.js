'use strict'

exports.command = 'clone-profile <emailSource> <emailTarget>'
exports.desc = 'Clone user <emailSource> profile to <emailTarget> '

exports.builder = {}

exports.handler = function (argv) {
  require('../../libs/user').cloneProfile(argv)
}
