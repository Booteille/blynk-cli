'use strict'

exports.command = 'restart'
exports.describe = 'Restart Blynk server'

exports.builder = {}

exports.handler = function (yargs) {
  require('../../libs/server').restart()
}
