'use strict'

exports.command = 'version'
exports.desc = 'Print your Blynk server version'

exports.builder = {}

exports.handler = function (argv) {
  require('../../libs/server').version()
}
