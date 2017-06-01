'use strict'

exports.command = 'clone-projects <emailSource> <emailTarget>'
exports.desc = 'Clone user <emailSource> projects to <emailTarget> '
exports.aliases = 'cp'

exports.builder = {}

exports.handler = function (argv) {
  require('../../libs/user').cloneProjects(argv)
}
