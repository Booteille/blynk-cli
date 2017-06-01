'use strict'

exports.command = 'start'
exports.desc = 'Start Blynk server'

exports.builder = {}

exports.handler = function (argv) {
  require('../../libs/server').start()
}
