'use strict'

exports.command = 'uninstall'
exports.desc = 'Uninstall Blynk Server'

exports.builder = {}

exports.handler = function (argv) {
  require('../../libs/server').uninstall()
}
