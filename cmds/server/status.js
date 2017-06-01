'use strict'

exports.command = 'status'
exports.desc = 'Print the current state of Blynk Server'

exports.builder = {}

exports.handler = function (argv) {
  require('../../libs/server').status()
}
