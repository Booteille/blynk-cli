'use strict'

exports.command = 'stop'
exports.desc = 'Stop Blynk server'

exports.builder = {}

exports.handler = function (argv) {
  require('../../libs/server').stop()
}
