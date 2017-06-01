'use strict'

exports.command = 'list'
exports.desc = 'List each backup located in the backup folder'

exports.builder = {}

exports.handler = function (argv) {
  require('../../libs/backup').list()
}
