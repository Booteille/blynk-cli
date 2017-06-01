'use strict'

exports.command = 'update'
exports.aliases = 'u'
exports.desc = 'Update Blynk server with latest Github release'

exports.builder = {}

exports.handler = function (argv) {
  require('../../libs/server').update()
}
